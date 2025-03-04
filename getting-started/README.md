# Fetch Token Prices with DexPaprika API

## Overview
In this tutorial, you'll learn how to **fetch the price of any token** using **DexPaprika API**, CoinPaprika's latest product. The tutorial demonstrates how to structure simple **cURL** requests and use API endpoints directly from the command line.

## Watch the Video
**[https://www.youtube.com/watch?v=BaRvndUG1EQ]** - Step-by-step guide on retrieving token prices.

## Steps to Fetch Token Price
1. **Find the Right API Endpoint**  
   - The `/tokens` endpoint provides near real-time token prices.  
   - Required parameters: **network** and **token address**.  

2. **Get Available Networks**  
   - Use the API to list all supported blockchain networks:  
     ```sh
     curl -X GET "https://api.dexpaprika.com/networks" | jq
     ```
   - Choose a network from the response.

3. **Search for Token Address**  
   - Use the `search` endpoint to find a token by name or address:  
     ```sh
     curl -X GET "https://api.dexpaprika.com/search?query=YOUR_INPUT" | jq
     ```
   - Extract the correct token address from the response.

4. **Fetch the Token Price**  
   - Once you have the **network** and **token address**, use:  
     ```sh
     curl -X GET "https://api.dexpaprika.com/networks/{network}/tokens/{token_address}" | jq
     ```
   - This will return the token's **Latest Data**.

5. **Filtering the Response**  
   - To extract only the price field, use:  
     ```sh
     curl -X GET "https://api.dexpaprika.com/networks/{network}/tokens/{token_address}" | jq '.summary.price_usd'
     ```
   - This ensures you get only get price as a response.

## Additional Resources
**API Documentation:** [https://docs.dexpaprika.com/api-reference/tokens/get-a-tokens-latest-data-on-a-network]  
**Need Help? Join our Discord!** [https://discord.gg/mS4cWp6a]  

The **DexPaprika API** is currently in **beta** and free to use. Try it out and let us know what you think!  
