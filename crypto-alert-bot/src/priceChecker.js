const axios = require('axios');

/**
 * Fetches the current price of a cryptocurrency from DexPaprika API
 * @param {string} network - The blockchain network (e.g., 'solana')
 * @param {string} tokenId - The token ID on that network
 * @returns {Promise<number>} - The current price in USD
 */
async function getTokenPrice(network, tokenId) {
  try {
    const url = `https://api.dexpaprika.com/networks/${network}/tokens/${tokenId}`;
    console.log(`Fetching price from: ${url}`);
    
    const response = await axios.get(url);
    
    if (response.data && response.data.summary && response.data.summary.price_usd) {
      const price = response.data.summary.price_usd;
      console.log(`Current price of token: $${price}`);
      return price;
    } else {
      throw new Error('Price data not found in API response');
    }
  } catch (error) {
    console.error('Error fetching token price:', error.message);
    if (error.response) {
      console.error('API response status:', error.response.status);
      console.error('API response data:', error.response.data);
    }
    throw error;
  }
}

/**
 * Checks if the price condition is met for sending an alert
 * @param {number} currentPrice - Current price of the token
 * @param {number} targetPrice - Target price threshold
 * @param {string} alertType - Type of alert ('above' or 'below')
 * @returns {boolean} - Whether the alert condition is met
 */
function shouldSendAlert(currentPrice, targetPrice, alertType) {
  if (alertType === 'above') {
    return currentPrice >= targetPrice;
  } else if (alertType === 'below') {
    return currentPrice <= targetPrice;
  }
  return false;
}

module.exports = {
  getTokenPrice,
  shouldSendAlert
}; 