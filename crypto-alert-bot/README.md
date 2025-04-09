# Build a Crypto Price Alert Bot with DexPaprika API

## Overview
This tutorial guides you through building a **real-time cryptocurrency price alert system** that monitors prices using the **DexPaprika API** and sends notifications to your Telegram when price thresholds are met. Perfect for traders and developers who want to stay updated on market movements without constant manual checking.

## Features
- Track any cryptocurrency available on DexPaprika API
- Set custom price thresholds for buy/sell opportunities
- Get instant alerts when prices go above or below your targets
- Configure check intervals to match your trading strategy
- Receive notifications directly on Telegram

## Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- A Telegram account
- A Telegram Bot (created using BotFather)

## Setup Instructions

### 1. Create Your Telegram Bot
1. Open Telegram and search for "BotFather" (@BotFather)
2. Start a chat and send the command `/newbot`
3. Follow the instructions to create your bot
4. Save the **bot token** BotFather provides you

### 2. Get Your Telegram Chat ID
1. Start a conversation with your new bot
2. Send any message to your bot
3. Visit this URL in your browser (replace with your actual token):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
4. Find the `"chat":{"id":XXXXXXXXX,` value in the response - this is your **chat ID**

### 3. Set Up the Project
1. Clone this repository or download the project files
2. Navigate to the project directory in your terminal
3. Install dependencies:
   ```bash
   npm install
   ```

### 4. Configure Your Settings
1. Create a `.env` file in the project directory (use the template below)
2. Fill in your details:
   ```
   # Telegram Bot Token (Get this from BotFather on Telegram)
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

   # Telegram Chat ID (The chat where alerts will be sent)
   TELEGRAM_CHAT_ID=your_telegram_chat_id_here

   # Cryptocurrency to track (token address)
   CRYPTO_TOKEN_ID=So11111111111111111111111111111111111111112
   CRYPTO_NETWORK=solana

   # Price threshold for alert (in USD)
   TARGET_PRICE=135
   # Alert type: "above" or "below" - to trigger when price goes above or below target
   ALERT_TYPE=above

   # How often to check price (in minutes)
   CHECK_INTERVAL=1
   ```

### 5. Finding the Right Token Address
Need to track a different token? Use DexPaprika API to find its address:

1. List available networks:
   ```bash
   curl -X GET "https://api.dexpaprika.com/networks" | jq
   ```

2. Search for your token:
   ```bash
   curl -X GET "https://api.dexpaprika.com/search?query=YOUR_TOKEN_NAME" | jq
   ```

3. Use the network and token address from the response in your .env file

## Running the Bot
1. Start the bot:
   ```bash
   node index.js
   ```
2. You'll receive a confirmation message on Telegram
3. The bot will check prices at your specified interval
4. When your price condition is met, you'll get an alert

## Running as a Background Service

### On Linux/Mac:
```bash
npm install -g pm2
pm2 start index.js --name crypto-alert
pm2 save
```

### On Windows:
```bash
npm install -g forever
forever start index.js
```

## How It Works
1. The application connects to DexPaprika API to retrieve real-time token prices
2. It compares the current price against your target threshold
3. When the condition is met, it sends an immediate alert via the Telegram Bot API
4. The process repeats based on your configured check interval

## Troubleshooting
- Not receiving messages? Double-check your bot token and chat ID
- Ensure your network/token combination is valid in DexPaprika
- Check console output for any error messages

## Next Steps
- Add multiple price alerts
- Implement price trend notifications
- Create a web dashboard for monitoring
- Set up SMS alerts as backup

## Additional Resources
- [DexPaprika API Documentation](https://docs.dexpaprika.com/introduction)
- [Complete Video Tutorial](https://www.youtube.com/watch?v=ndiHJL_7k_A)
- [Join our Discord for Help](https://discord.gg/mS4cWp6a)

## License
This project is open-source and free to use for personal or commercial purposes.

---

Built with DexPaprika API - currently in **beta** and free to use. 
