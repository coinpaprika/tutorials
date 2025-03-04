const TelegramBot = require('node-telegram-bot-api');

/**
 * Creates a Telegram bot instance
 * @param {string} token - Telegram bot token from BotFather
 * @returns {TelegramBot} - Telegram bot instance
 */
function createBot(token) {
  try {
    console.log('Initializing Telegram bot...');
    const bot = new TelegramBot(token, { polling: false });
    console.log('Telegram bot initialized successfully');
    return bot;
  } catch (error) {
    console.error('Error creating Telegram bot:', error.message);
    throw error;
  }
}

/**
 * Sends an alert message through the Telegram bot
 * @param {TelegramBot} bot - Telegram bot instance
 * @param {string} chatId - Chat ID to send the message to
 * @param {Object} alertData - Data for the alert message
 * @returns {Promise<void>}
 */
async function sendAlert(bot, chatId, alertData) {
  try {
    const { tokenId, network, currentPrice, targetPrice, alertType } = alertData;
    
    const message = `
🚨 *PRICE ALERT* 🚨

Token: \`${tokenId}\` on ${network.toUpperCase()}
Price: $${currentPrice}
Alert Condition: Price is ${alertType} $${targetPrice}

Time: ${new Date().toLocaleString()}
    `;
    
    console.log(`Sending alert to chat ID: ${chatId}`);
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    console.log('Alert sent successfully');
  } catch (error) {
    console.error('Error sending Telegram alert:', error.message);
    throw error;
  }
}

module.exports = {
  createBot,
  sendAlert
}; 