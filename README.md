# Uniswap V3 Market Maker Trading Bot

Blog Post:
https://jamesbachini.com/uniswap-market-maker-bot/


The Uniswap market maker trading bot works by automatically buying and selling tokens in a liquidity pool in order to maintain a target price. The bot is programmed to buy tokens when the price falls below the target price, and to sell tokens when the price rises above the target price. This helps to keep the price of the tokens in the pool stable and balances liquidity on either side of the pool.

The bot is programmed to use a fixed target price, but it can also be adapted to use a dynamic target price. A dynamic target price can be based on a linear price path or something like a simple moving average of past prices.

The bot can be used to trade any pair of tokens that are listed on Uniswap v3 on any EVM compatible chain. The bot is setup as default to be run on the wsteth/weth pool on Goerli testnet, which allows users to test the bot without using real funds.

The following are the steps on how to set up the Uniswap market maker trading bot:

- Fork the repository from GitHub.
- Install the necessary libraries with the Node package manager (npm).
- Create a .env file and add your private key and Alchemy API key.
- Edit the mm.js file to specify the tokens that you want to trade and the target price.
- Run `node mm.js`

The bot will start trading and will automatically buy and sell tokens in order to maintain the target price.

The bot now focuses on the wsteth/weth trading pair and captures arbitrage opportunities through setting limit orders based on the Lido wrap/unwrap rate and gas costs. The bot uses a gas price oracle service to estimate gas costs and adjust transaction fees. It also incorporates slippage tolerance into the trading strategy and fetches the Lido wrap/unwrap rate programmatically using the Lido API. Additionally, the bot uses flash loans to maximize the opportunity for minimal risk by borrowing wsteth or weth, executing arbitrage trades, and repaying the flash loan within the same transaction.

Note the code is for demonstration purposes only and is not battle tested in a production environment.

const calculateMovingAverage = (prices, period) => {
  return prices.slice(-period).reduce((a, b) => a + b, 0) / period;
};

const fetchLidoRates = async () => {
  const response = await axios.get('https://api.lido.fi/api/steth');
  return response.data;
};

const fetchGasPrice = async () => {
  const response = await axios.get('https://ethgasstation.info/api/ethgasAPI.json');
  return response.data.average / 10; // Convert to Gwei
};

const executeFlashLoan = async (amount, token, callback) => {
  // Example flash loan logic
  const tx = await flashLoanProvider.flashLoan(wallet.address, token, amount, '0x');
  await callback(tx); // Execute trade logic
  await tx.wait();
};
