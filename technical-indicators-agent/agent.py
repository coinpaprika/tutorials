import json
import os
import time

import requests

API = "https://api.dexpaprika.com"
KEY = os.environ.get("DEXPAPRIKA_API_KEY")  # a free key from console.dexpaprika.com
HEADERS = {"Authorization": KEY} if KEY else {}
START = "-7d" if KEY else "-24h"  # the history window of each plan
INTERVAL = "1h"

WATCHLIST = [
    ("ethereum", "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640", "WETH/USDC, Uniswap v3"),
    ("solana", "Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE", "SOL/USDC, Orca"),
    ("base", "0x6c561b446416e1a00e8e93e221854d6ea4171372", "WETH/USDC, Uniswap v3"),
]


def get(path, **params):
    for _ in range(5):
        r = requests.get(f"{API}{path}", params=params, headers=HEADERS, timeout=30)
        if r.status_code == 429:
            time.sleep(int(r.headers.get("Retry-After", "5")) + 1)
            continue
        r.raise_for_status()
        return r.json()
    r.raise_for_status()


def indicator(network, pool, name):
    path = f"/networks/{network}/pools/{pool}/indicators"
    return get(path, indicator=name, interval=INTERVAL, start=START)["data"]


def snapshot(network, pool, label):
    rsi = indicator(network, pool, "rsi")[-1]
    prev, macd = indicator(network, pool, "macd")[-2:]
    bands = indicator(network, pool, "bbands")[-1]

    # The close of the same candle the indicators end on.
    candles = get(f"/networks/{network}/pools/{pool}/ohlcv",
                  start=START, interval=INTERVAL, limit=1000)
    close = next(c["close"] for c in candles if c["time_open"] == bands["timestamp"])

    cross = None
    if prev["histogram"] < 0 <= macd["histogram"]:
        cross = "up"
    elif prev["histogram"] > 0 >= macd["histogram"]:
        cross = "down"

    width = bands["upper"] - bands["lower"]
    return {
        "pool": label,
        "network": network,
        "candle": bands["timestamp"],
        "close": round(close, 6),
        "rsi_14": round(rsi["value"], 1),
        "macd_histogram": round(macd["histogram"], 6),
        "macd_cross": cross,
        "bbands_percent_b": round((close - bands["lower"]) / width, 2),
        "bbands_width_pct": round(width / bands["middle"] * 100, 2),
    }


def rules(s):
    """A plain baseline to compare the model against."""
    if s["rsi_14"] < 30 and s["bbands_percent_b"] < 0.05:
        return "buy"
    if s["rsi_14"] > 70 and s["bbands_percent_b"] > 0.95:
        return "sell"
    if s["macd_cross"] == "up" and s["rsi_14"] < 60:
        return "buy"
    if s["macd_cross"] == "down" and s["rsi_14"] > 40:
        return "sell"
    return "hold"


SYSTEM = """You are a paper-trading agent. For each pool in the JSON you get,
decide buy, sell or hold for the next hour, using only the fields given.
rsi_14: RSI(14), over 70 is commonly read as overbought, under 30 as oversold.
macd_histogram: MACD minus its signal line. macd_cross is "up" or "down" when
it changed sign on the last candle. bbands_percent_b: 0 at the lower Bollinger
Band, 1 at the upper. bbands_width_pct: band width as a percentage of the middle
band; narrow bands often come before a large move.
Answer with a JSON array only, one object per pool:
[{"pool": "...", "network": "...", "action": "buy|sell|hold",
  "confidence": 0.0, "reason": "one sentence"}]"""


def model(states):
    import anthropic  # pip install anthropic; reads ANTHROPIC_API_KEY

    reply = anthropic.Anthropic().messages.create(
        model="claude-sonnet-5",
        max_tokens=1024,
        system=SYSTEM,
        messages=[{"role": "user", "content": json.dumps(states)}],
    )
    return json.loads(reply.content[0].text)


def cycle(use_model):
    states = [snapshot(*p) for p in WATCHLIST]
    for s in states:
        print(json.dumps(s))
        print(f"  rules: {rules(s)}")
    if use_model:
        for d in model(states):
            print(f"  model, {d['pool']} on {d['network']}: {d['action']} "
                  f"({d['confidence']:.2f}) {d['reason']}")


if __name__ == "__main__":
    use_model = "ANTHROPIC_API_KEY" in os.environ
    while True:
        cycle(use_model)
        # Wake a minute after the next hourly candle closes.
        time.sleep(3600 - time.time() % 3600 + 60)
