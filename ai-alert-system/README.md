# Cryptocurrency Price Alert Bot

A simple Node.js application that monitors cryptocurrency prices using the DexPaprika API and sends alerts to Telegram when price thresholds are met.

## Features

- Track any cryptocurrency available on DexPaprika API
- Set custom price thresholds
- Get alerts when prices go above or below your target
- Configurable check intervals
- Notifications sent directly to your Telegram

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- A Telegram account
- A Telegram Bot (created using BotFather)

## Setup Instructions

### 1. Setting up your Telegram Bot

1. Open Telegram and search for the "BotFather" (@BotFather)
2. Start a chat with BotFather and send the command `/newbot`
3. Follow the instructions to create a new bot
4. Once created, BotFather will give you a **bot token**. Save this for later.

### 2. Getting your Telegram Chat ID

1. Start a chat with your new bot
2. Send a message to your bot (any message)
3. Visit this URL in your browser, replacing `YOUR_BOT_TOKEN` with your actual bot token:
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
4. Look for the `"chat":{"id":XXXXXXXXX,` value in the response. This number is your **chat ID**.

### 3. Clone and install the application

1. Ensure Node.js is installed on your system
2. Download all the files from this project
3. Open a terminal/command prompt in the project directory
4. Run the following command to install dependencies:
   ```
   npm install
   ```

### 4. Configure your settings

1. Edit the `.env` file in the project directory
2. Fill in the following values:
   - `TELEGRAM_BOT_TOKEN`: Your bot token from step 1
   - `TELEGRAM_CHAT_ID`: Your chat ID from step 2
   - `CRYPTO_TOKEN_ID`: The ID of the cryptocurrency you want to track (default is Solana SOL token)
   - `CRYPTO_NETWORK`: The blockchain network (default is "solana")
   - `TARGET_PRICE`: The price threshold in USD (e.g., 50)
   - `ALERT_TYPE`: Set to either "above" or "below" to specify when to trigger alerts
   - `CHECK_INTERVAL`: How often to check prices, in minutes (e.g., 15)

## Running the Application

1. Open a terminal/command prompt in the project directory
2. Run the following command:
   ```
   node index.js
   ```
3. The application will start and send an initial message to your Telegram
4. It will continue running and checking prices at your specified interval
5. When the price condition is met, you'll receive a Telegram alert

## Setting Up as a Background Service

For continuous operation, you might want to run this as a background service:

### On Linux/Mac:
You can use `pm2` to keep the script running:

```
npm install -g pm2
pm2 start index.js --name crypto-alert
pm2 save
```

### On Windows:
You can create a Windows service or use a tool like `forever`:

```
npm install -g forever
forever start index.js
```

## Troubleshooting

- If you don't receive the startup message, double-check your bot token and chat ID
- Ensure the API endpoints are accessible from your network
- Check the console output for any error messages
- Verify that your cryptocurrency token ID is correct

## Customizing

You can modify the alert messages by editing the `telegramBot.js` file. The alert format can be customized to include additional information or different formatting.

## License

This project is open-source and available for personal or commercial use. 