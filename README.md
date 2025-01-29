# Uniswap V3 Market Maker Trading Bot

Blog Post:
https://jamesbachini.com/uniswap-market-maker-bot/


The Uniswap market maker trading bot works by automatically buying and selling tokens in a liquidity pool in order to maintain a target price. The bot is programmed to buy tokens when the price falls below the target price, and to sell tokens when the price rises above the target price. This helps to keep the price of the tokens in the pool stable and balances liquidity on either side of the pool.

The bot is programmed to use a fixed target price, but it can also be adapted to use a dynamic target price. A dynamic target price can be based on a linear price path or something like a simple moving average of past prices.

The bot can be used to trade any pair of tokens that are listed on Uniswap v3 on any EVM compatible chain. The bot is setup as default to be run on the ETH/UNI pool on Goerli testnet, which allows users to test the bot without using real funds.

The following are the steps on how to set up the Uniswap market maker trading bot:

- Fork the repository from GitHub.
- Install the necessary libraries with the Node package manager (npm).
- Create a .env file and add your private key and Alchemy API key.
- Edit the mm.js file to specify the tokens that you want to trade and the target price.
- Run `node mm.js`

The bot will start trading and will automatically buy and sell tokens in order to maintain the target price.

Note the code is for demonstration purposes only and is not battle tested in a production environment.

# Arbitraging wsteth/weth Pair and Lido Wrap/Unwrap Ratio

The bot now supports arbitraging the differences between the wsteth/weth pair and the Lido wrap/unwrap ratio. The following are the steps on how to set up the bot for arbitraging the wsteth/weth pair and the Lido wrap/unwrap ratio:

- Fork the repository from GitHub.
- Install the necessary libraries with the Node package manager (npm).
- Create a .env file and add your private key and Alchemy API key.
- Update the `wethAddress` and `tokenAddress` variables in the `mm.js` file to reflect the wsteth and weth tokens.
- Add the actual wsteth address in the `mm.js` file.
- Update the `targetPrice`, `buyAmount`, `targetAmountOut`, and `sellAmount` variables in the `mm.js` file to reflect the desired trading parameters for the wsteth/weth pair.
- Add functions to interact with Lido's wrap/unwrap functions in the `mm.js` file.
- Add logic to fetch wsteth/weth pair prices from Uniswap in the `mm.js` file.
- Add logic to fetch the Lido wrap/unwrap ratio in the `mm.js` file.
- Add logic to compare the prices and perform arbitrage if there is a profitable opportunity in the `mm.js` file.
- Integrate flash loan logic into the `mm.js` file to capture the full amount of the arbitrage.
- Update the `buyTokens` and `sellTokens` functions in the `mm.js` file to include flash loan logic.
- Implement flash loan logic to request, use, and repay flash loans for arbitrage in the `mm.js` file.
- Integrate slippage handling into the `mm.js` file to ensure trades are executed within acceptable slippage tolerance.
- Update the `buyTokens` and `sellTokens` functions in the `mm.js` file to include a slippage tolerance parameter.
- Calculate the minimum amount of tokens to receive after accounting for slippage in the `mm.js` file.
- Use the calculated minimum amount in the `exactInputSingle` function calls for both buying and selling tokens in the `mm.js` file.
- Integrate gas fee handling into the `mm.js` file to manage gas fees for wsteth/weth trades.
- Monitor gas prices using a gas price oracle or API in the `mm.js` file.
- Set a gas price limit and optimize gas usage in the smart contract code in the `mm.js` file.
- Use gas-efficient functions and batch transactions if possible in the `mm.js` file.
- Monitor network congestion and avoid executing trades during peak times when gas prices are high in the `mm.js` file.
- Run `node mm.js`

The bot will start trading and will automatically buy and sell tokens in order to arbitrage the differences between the wsteth/weth pair and the Lido wrap/unwrap ratio.

Note the code is for demonstration purposes only and is not battle tested in a production environment.
