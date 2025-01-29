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

# Backtesting Functionality

The bot now supports backtesting functionality to simulate historical trades. The following are the steps on how to set up the bot for backtesting:

- Fork the repository from GitHub.
- Install the necessary libraries with the Node package manager (npm).
- Create a .env file and add your private key and Alchemy API key.
- Update the `provider` variable in the `mm.js` file to read from a local file instead of using the Alchemy API.
- Create a function to load historical data from a JSON or CSV file in the `mm.js` file.
- Implement a simulation loop that iterates through the historical data set and executes the buy and sell logic in the `mm.js` file.
- Modify the `checkPrice` function in the `mm.js` file to use historical data instead of fetching live data.
- Track performance metrics, such as profit and loss, during the simulation in the `mm.js` file.
- Run `node mm.js`

The bot will simulate historical trades and track performance metrics during the simulation.

# Optimization Logic

The bot now supports optimization logic to adjust trading parameters dynamically. The following are the steps on how to set up the bot for optimization:

- Fork the repository from GitHub.
- Install the necessary libraries with the Node package manager (npm).
- Create a .env file and add your private key and Alchemy API key.
- Modify the `tradeFrequency` variable in the `mm.js` file to adjust how often the bot checks prices and executes trades.
- Adjust the `buyAmount` and `sellAmount` variables in the `mm.js` file to optimize the size of each trade.
- Replace the fixed `targetPrice` variable in the `mm.js` file with a dynamic target price based on a moving average or other indicators.
- Update the `checkPrice` function in the `mm.js` file to calculate the dynamic target price and use it for buy and sell decisions.
- Integrate slippage handling into the `buyTokens` and `sellTokens` functions in the `mm.js` file to ensure trades are executed within acceptable slippage tolerance.
- Monitor gas prices using a gas price oracle or API and set a gas price limit in the `mm.js` file.
- Run `node mm.js`

The bot will dynamically adjust trading parameters to optimize performance.

# Machine Learning-Based Strategies

The bot now supports machine learning-based strategies to improve decision-making. The following are the steps on how to set up the bot for machine learning-based strategies:

- Fork the repository from GitHub.
- Install the necessary libraries with the Node package manager (npm).
- Create a .env file and add your private key and Alchemy API key.
- Create a historical data set for the tokens you want to trade, including price and volume information for the relevant time period.
- Use machine learning algorithms to analyze historical data and predict future price movements.
- Train a model using historical price and volume data to identify patterns and trends.
- Integrate the trained model into the bot's decision-making process in the `mm.js` file.
- Modify the bot's logic in the `mm.js` file to use the model's predictions for making buy and sell decisions.
- Backtest the bot's performance with the integrated machine learning model using the historical data set.
- Run `node mm.js`

The bot will use machine learning-based strategies to improve its decision-making and overall performance.

Note the code is for demonstration purposes only and is not battle tested in a production environment.

# Setting up the Uniswap Market Maker Trading Bot

To set up the Uniswap market maker trading bot, follow these steps:

1. Fork the repository from GitHub.
2. Install the necessary libraries with the Node package manager (npm):
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and add your private key and Alchemy API key. You can use the `.env-sample` file as a reference. Here is an example of what the `.env` file should look like:
   ```
   PRIVATE_KEY=0xabc123
   ALCHEMY_API_KEY=sxSQa_Vasdfasdfaqbqu-0abc
   ```
   Make sure to replace the example values with your actual private key and Alchemy API key.
4. Edit the `mm.js` file to specify the tokens that you want to trade and the target price.
5. Run `node mm.js` to start the bot.

The bot will start trading and will automatically buy and sell tokens in order to maintain the target price.

# Testing the Bot on the Goerli Testnet

To test the bot on the Goerli testnet, follow these steps:

1. Ensure you have Node.js installed on your system. You can download it from the official Node.js website.
2. Open a terminal or command prompt.
3. Navigate to the root directory of the project.
4. Run the command `npm install` to install the dependencies listed in the `package.json` file.
5. Create a `.env` file in the root directory and add your private key and Alchemy API key. You can use the `.env-sample` file as a reference.
6. Edit the `mm.js` file to specify the tokens that you want to trade and the target price.
7. Run `node mm.js` to start the bot.

The bot will start trading on the Goerli testnet and will automatically buy and sell tokens in order to maintain the target price.
