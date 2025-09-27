const ethers = require('ethers');
require("dotenv").config();
const fs = require('fs');

const wethAddress = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'; // goerli weth
const wstethAddress = '0x0'; // placeholder for wsteth address, replace with actual address
const routerAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'; // Uniswap Router
const quoterAddress = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'; // Uniswap Quoter
const fee = 3000; // Uniswap pool fee bps 500, 3000, 10000
const buyAmount = ethers.parseUnits('0.001', 'ether');
const targetPrice = BigInt(40); // target exchange rate
const targetAmountOut = buyAmount * targetPrice;
const sellAmount = ethers.parseUnits('0.0005', 'ether');
const tradeFrequency = 3600 * 1000; // ms (once per hour)
const slippageTolerance = 0.01; // 1% slippage tolerance
const maxGasPrice = ethers.parseUnits('50', 'gwei'); // maximum gas price limit

// Performance tracking
let performanceMetrics = {
  totalTrades: 0,
  buyTrades: 0,
  sellTrades: 0,
  skippedTrades: 0,
  startTime: Date.now(),
  simulatedProfitLoss: 0
};

// Configuration validation
if (!process.env.PRIVATE_KEY) {
  console.log('Warning: PRIVATE_KEY not set in .env file. Using demo mode with sample data.');
}

// `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`
// const provider = new ethers.JsonRpcProvider(`https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`);
const provider = new ethers.JsonRpcProvider(`http://localhost:8545`);

// Only create wallet if private key is provided
let wallet, account;
if (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== '[ REDACTED ]') {
  try {
    wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    account = wallet.connect(provider);
  } catch (error) {
    console.log('Warning: Invalid private key. Running in simulation mode only.');
    wallet = null;
    account = null;
  }
} else {
  console.log('Running in simulation mode - no transactions will be executed.');
  wallet = null;
  account = null;
}

// Initialize contracts only if account is available
let wsteth, weth, router, quoter;

if (account) {
  wsteth = new ethers.Contract(
    wstethAddress,
    [
      'function approve(address spender, uint256 amount) external returns (bool)',
      'function allowance(address owner, address spender) public view returns (uint256)',
      'function wrap(uint256 _amount) external returns (uint256)',
      'function unwrap(uint256 _amount) external returns (uint256)',
    ],
    account
  );

  weth = new ethers.Contract(
    wethAddress,
    [
      'function approve(address spender, uint256 amount) external returns (bool)',
      'function allowance(address owner, address spender) public view returns (uint256)',
    ],
    account
  );

  router = new ethers.Contract(
    routerAddress,
    ['function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)'],
    account
  );

  quoter = new ethers.Contract(
    quoterAddress,
    ['function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) public view returns (uint256 amountOut)'],
    account
  );
}

const getLidoWrapUnwrapRatio = async () => {
  // Placeholder function to fetch Lido wrap/unwrap ratio
  // Replace with actual logic to fetch the ratio from Lido contract
  return BigInt(1);
};

// Gas price monitoring function
const getGasPrice = async () => {
  try {
    if (!provider) return maxGasPrice;
    const gasPrice = await provider.getFeeData();
    return gasPrice.gasPrice || maxGasPrice;
  } catch (error) {
    console.log('Warning: Could not fetch gas price, using default:', maxGasPrice.toString());
    return maxGasPrice;
  }
};

// Check if gas price is acceptable
const isGasPriceAcceptable = async () => {
  const currentGasPrice = await getGasPrice();
  const acceptable = currentGasPrice <= maxGasPrice;
  console.log(`Current gas price: ${ethers.formatUnits(currentGasPrice, 'gwei')} gwei, Max: ${ethers.formatUnits(maxGasPrice, 'gwei')} gwei, Acceptable: ${acceptable}`);
  return acceptable;
};

// Calculate minimum amount out with slippage tolerance
const calculateMinAmountOut = (expectedAmountOut) => {
  const slippageAmount = expectedAmountOut * BigInt(Math.floor(slippageTolerance * 10000)) / BigInt(10000);
  return expectedAmountOut - slippageAmount;
};

const buyTokens = async () => {
  console.log('Buying Tokens');
  
  // Track performance metrics
  performanceMetrics.totalTrades++;
  performanceMetrics.buyTrades++;
  
  // Check if we can execute transactions
  if (!account || !router) {
    console.log('Simulation mode: Would buy tokens with amount:', buyAmount.toString());
    return;
  }

  // Check gas price
  if (!(await isGasPriceAcceptable())) {
    console.log('Gas price too high, skipping trade');
    performanceMetrics.skippedTrades++;
    return;
  }

  try {
    // Calculate minimum amount out with slippage protection
    const expectedAmountOut = targetAmountOut;
    const minAmountOut = calculateMinAmountOut(expectedAmountOut);
    
    console.log(`Expected amount out: ${expectedAmountOut.toString()}`);
    console.log(`Minimum amount out (with ${slippageTolerance * 100}% slippage): ${minAmountOut.toString()}`);

    const deadline = Math.floor(Date.now() / 1000) + 600;
    const tx = await router.exactInputSingle([
      wethAddress, 
      wstethAddress, 
      fee, 
      wallet.address, 
      deadline, 
      buyAmount, 
      minAmountOut,  // Use calculated minimum instead of 0
      0
    ], { value: buyAmount });
    
    await tx.wait();
    console.log('Buy transaction hash:', tx.hash);
  } catch (error) {
    console.error('Error buying tokens:', error.message);
  }
};

const sellTokens = async () => {
  console.log('Selling Tokens');
  
  // Track performance metrics
  performanceMetrics.totalTrades++;
  performanceMetrics.sellTrades++;
  
  // Check if we can execute transactions
  if (!account || !router || !wsteth) {
    console.log('Simulation mode: Would sell tokens with amount:', sellAmount.toString());
    return;
  }

  // Check gas price
  if (!(await isGasPriceAcceptable())) {
    console.log('Gas price too high, skipping trade');
    performanceMetrics.skippedTrades++;
    return;
  }

  try {
    const allowance = await wsteth.allowance(wallet.address, routerAddress);
    console.log(`Current allowance: ${allowance}`);
    
    if (allowance < sellAmount) {
      console.log('Approving Spend (bulk approve in production)');
      const atx = await wsteth.approve(routerAddress, sellAmount);
      await atx.wait();
    }

    // Calculate minimum amount out with slippage protection
    const expectedAmountOut = sellAmount * targetPrice;  // Approximate expected output
    const minAmountOut = calculateMinAmountOut(expectedAmountOut);
    
    console.log(`Expected amount out: ${expectedAmountOut.toString()}`);
    console.log(`Minimum amount out (with ${slippageTolerance * 100}% slippage): ${minAmountOut.toString()}`);

    const deadline = Math.floor(Date.now() / 1000) + 600;
    const tx = await router.exactInputSingle([
      wstethAddress, 
      wethAddress, 
      fee, 
      wallet.address, 
      deadline, 
      sellAmount, 
      minAmountOut,  // Use calculated minimum instead of 0
      0
    ]);
    
    await tx.wait();
    console.log('Sell transaction hash:', tx.hash);
  } catch (error) {
    console.error('Error selling tokens:', error.message);
  }
};

const checkPrice = async (historicalData, index) => {
  const amountOut = BigInt(historicalData[index].amountOut);
  const lidoRatio = await getLidoWrapUnwrapRatio();
  const adjustedTarget = targetAmountOut * lidoRatio;
  
  console.log(`Current Exchange Rate: ${amountOut.toString()}`);
  console.log(`Target Exchange Rate: ${targetAmountOut.toString()}`);
  console.log(`Adjusted Target (with Lido ratio): ${adjustedTarget.toString()}`);
  console.log(`Lido Wrap/Unwrap Ratio: ${lidoRatio.toString()}`);
  
  if (amountOut < adjustedTarget) {
    console.log('Price below target - executing BUY order');
    await buyTokens();
  } else if (amountOut > adjustedTarget) {
    console.log('Price above target - executing SELL order');
    await sellTokens();
  } else {
    console.log('Price at target - no action needed');
  }
};

const loadHistoricalData = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`Warning: ${filePath} not found. Creating sample data.`);
      // Return default sample data if file doesn't exist
      return [
        { timestamp: Date.now() - 3600000, amountOut: "39000000000000000000" },
        { timestamp: Date.now() - 1800000, amountOut: "41000000000000000000" },
        { timestamp: Date.now(), amountOut: "40000000000000000000" }
      ];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading historical data from ${filePath}:`, error.message);
    console.log('Using fallback sample data');
    return [
      { timestamp: Date.now() - 3600000, amountOut: "39000000000000000000" },
      { timestamp: Date.now() - 1800000, amountOut: "41000000000000000000" },
      { timestamp: Date.now(), amountOut: "40000000000000000000" }
    ];
  }
};

const simulateTrading = async (historicalData) => {
  console.log(`Starting backtesting simulation with ${historicalData.length} data points`);
  
  for (let i = 0; i < historicalData.length; i++) {
    try {
      console.log(`\n--- Processing data point ${i + 1}/${historicalData.length} ---`);
      if (historicalData[i].timestamp) {
        console.log(`Timestamp: ${new Date(historicalData[i].timestamp).toISOString()}`);
      }
      await checkPrice(historicalData, i);
      
      // Add a small delay to simulate real trading intervals
      if (i < historicalData.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`Error processing data point ${i}:`, error.message);
      continue;
    }
  }
  
  console.log('\n--- Backtesting simulation completed ---');
  displayPerformanceMetrics();
};

// Display performance metrics
const displayPerformanceMetrics = () => {
  const duration = (Date.now() - performanceMetrics.startTime) / 1000;
  console.log('\n=== PERFORMANCE METRICS ===');
  console.log(`Simulation Duration: ${duration.toFixed(2)} seconds`);
  console.log(`Total Trading Decisions: ${performanceMetrics.totalTrades}`);
  console.log(`Buy Orders: ${performanceMetrics.buyTrades}`);
  console.log(`Sell Orders: ${performanceMetrics.sellTrades}`);
  console.log(`Skipped Trades (High Gas): ${performanceMetrics.skippedTrades}`);
  console.log(`Trade Success Rate: ${performanceMetrics.totalTrades > 0 ? 
    ((performanceMetrics.totalTrades - performanceMetrics.skippedTrades) / performanceMetrics.totalTrades * 100).toFixed(2) : 0}%`);
  console.log('=============================\n');
};

// Main execution with error handling
const main = async () => {
  try {
    console.log('=== Market Maker Bot Starting ===');
    console.log('Configuration:');
    console.log(`- Buy Amount: ${ethers.formatEther(buyAmount)} ETH`);
    console.log(`- Sell Amount: ${ethers.formatEther(sellAmount)} ETH`);
    console.log(`- Target Price: ${targetPrice.toString()}`);
    console.log(`- Slippage Tolerance: ${slippageTolerance * 100}%`);
    console.log(`- Max Gas Price: ${ethers.formatUnits(maxGasPrice, 'gwei')} gwei`);
    console.log(`- Trade Frequency: ${tradeFrequency / 1000}s`);
    
    const historicalData = loadHistoricalData('historical_data.json');
    await simulateTrading(historicalData);
  } catch (error) {
    console.error('Fatal error in main execution:', error.message);
    process.exit(1);
  }
};

// Execute main function
main();
