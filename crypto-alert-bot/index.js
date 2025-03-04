require('dotenv').config();
const schedule = require('node-schedule');
const { getTokenPrice, shouldSendAlert } = require('./src/priceChecker');
const { createBot, sendAlert } = require('./src/telegramBot');

// Configuration from environment variables
const config = {
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramChatId: process.env.TELEGRAM_CHAT_ID,
  cryptoTokenId: process.env.CRYPTO_TOKEN_ID,
  cryptoNetwork: process.env.CRYPTO_NETWORK,
  targetPrice: parseFloat(process.env.TARGET_PRICE),
  alertType: process.env.ALERT_TYPE.toLowerCase(),
  checkInterval: parseInt(process.env.CHECK_INTERVAL, 10)
};

// Validate configuration
function validateConfig() {
  const requiredFields = [
    'telegramBotToken', 
    'telegramChatId', 
    'cryptoTokenId', 
    'cryptoNetwork', 
    'targetPrice', 
    'alertType', 
    'checkInterval'
  ];
  
  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0) {
    console.error('Missing required configuration:', missingFields.join(', '));
    console.error('Please check your .env file and ensure all fields are set correctly.');
    process.exit(1);
  }
  
  if (isNaN(config.targetPrice)) {
    console.error('Invalid TARGET_PRICE: Must be a number');
    process.exit(1);
  }
  
  if (!['above', 'below'].includes(config.alertType)) {
    console.error('Invalid ALERT_TYPE: Must be "above" or "below"');
    process.exit(1);
  }
  
  if (isNaN(config.checkInterval) || config.checkInterval < 1) {
    console.error('Invalid CHECK_INTERVAL: Must be a positive number of minutes');
    process.exit(1);
  }
}

// Initialize system
async function initialize() {
  console.log('🚀 Starting Cryptocurrency Price Alert System');
  console.log('-------------------------------------------');
  console.log(`Tracking: ${config.cryptoTokenId} on ${config.cryptoNetwork}`);
  console.log(`Alert condition: Price ${config.alertType} $${config.targetPrice}`);
  console.log(`Checking every ${config.checkInterval} minutes`);
  console.log('-------------------------------------------');
  
  // Create Telegram bot
  const bot = createBot(config.telegramBotToken);
  
  // Send startup message
  try {
    await bot.sendMessage(
      config.telegramChatId, 
      `✅ *Price Alert Bot Started*\n\nNow tracking ${config.cryptoTokenId} on ${config.cryptoNetwork}\nWill alert when price is ${config.alertType} $${config.targetPrice}`,
      { parse_mode: 'Markdown' }
    );
    console.log('Startup message sent to Telegram');
  } catch (error) {
    console.error('Failed to send startup message. Please check your Telegram bot token and chat ID.');
    console.error(error.message);
    process.exit(1);
  }
  
  return bot;
}

// Check price and send alert if needed
async function checkPriceAndAlert(bot) {
  try {
    // Get current price
    const currentPrice = await getTokenPrice(config.cryptoNetwork, config.cryptoTokenId);
    
    // Check if we should send an alert
    if (shouldSendAlert(currentPrice, config.targetPrice, config.alertType)) {
      console.log(`Alert condition met! Price ${config.alertType} $${config.targetPrice}`);
      
      // Send alert to Telegram
      await sendAlert(bot, config.telegramChatId, {
        tokenId: config.cryptoTokenId,
        network: config.cryptoNetwork,
        currentPrice,
        targetPrice: config.targetPrice,
        alertType: config.alertType
      });
    } else {
      console.log(`Alert condition not met. Current price: $${currentPrice}, Target: ${config.alertType} $${config.targetPrice}`);
    }
  } catch (error) {
    console.error('Error in price check routine:', error.message);
  }
}

// Main function
async function main() {
  try {
    validateConfig();
    const bot = await initialize();
    
    // Schedule regular price checks
    const cronSchedule = `*/${config.checkInterval} * * * *`;
    console.log(`Setting up schedule with cron pattern: ${cronSchedule}`);
    
    schedule.scheduleJob(cronSchedule, async () => {
      console.log(`\n[${new Date().toLocaleString()}] Running scheduled price check...`);
      await checkPriceAndAlert(bot);
    });
    
    // Also run an immediate check
    console.log('Running initial price check...');
    await checkPriceAndAlert(bot);
    
  } catch (error) {
    console.error('Error in main program:', error.message);
    process.exit(1);
  }
}

// Start the application
main(); 