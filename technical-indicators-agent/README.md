# Technical indicators for an AI trading agent

A paper-trading agent that wakes once an hour, reads RSI, MACD and Bollinger Bands for three DEX pools from the DexPaprika API, and asks a language model for buy, sell or hold on each, next to a plain rule-based baseline.

The API computes the indicators on the server from the pools' completed candles, so the agent gets a small JSON state per pool instead of a pile of candles to do maths on.

Full walkthrough: [Feed an AI trading agent with technical indicators](https://docs.dexpaprika.com/tutorials/agent-trading-signals).

## Run it

```sh
pip install -r requirements.txt
export DEXPAPRIKA_API_KEY=your_free_key      # optional
export ANTHROPIC_API_KEY=your_anthropic_key  # optional, without it only the rules run
python agent.py
```

It runs with no key at all. Without `DEXPAPRIKA_API_KEY` the indicators cover the last 24 hours, which is too short for RSI(14) to settle; a free key from [console.dexpaprika.com](https://console.dexpaprika.com) opens 7 days, and the script switches to it when the key is set.

One cycle is four requests per pool, twelve for the default watchlist. Limits per plan are on the [rate limits page](https://docs.dexpaprika.com/knowledge-base/rate-limits) and plans on [pricing](https://dexpaprika.com/api/pricing).

For paper trading and research only. Indicators describe the past; nothing here is financial advice.

## Change it

- `WATCHLIST`: any pools, as network, address and a label.
- `rules()`: the baseline the model is compared with.
- `SYSTEM`: the prompt. Any model that returns JSON works in `model()`.

Indicator reference: [pools](https://docs.dexpaprika.com/api-reference/pools/get-a-technical-indicator-for-a-pool), [tokens](https://docs.dexpaprika.com/api-reference/tokens/get-a-technical-indicator-for-a-token) (Dev or Pro).
