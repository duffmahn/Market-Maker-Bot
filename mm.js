const ethers = require('ethers');
require("dotenv").config();
const axios = require('axios');

const wethAddress = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'; // Goerli WETH
const wstethAddress = '0x7f39C581F595B53c5cb5a4f8fF576dC69316a8A2'; // wstETH
const routerAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'; // Uniswap V4 Router
const quoterAddress = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'; // Uniswap Quoter
const fee = 3000; // Uniswap Pool Fee
const tradeFrequency = 3600 * 1000; // Trade every hour
const slippageTolerance = 0.005; // 0.5% slippage
const minProfitThreshold = ethers.parseUnits('0.0001', 'ether'); // Minimum profit threshold
const gasPriceLimit = ethers.parseUnits('50', 'gwei'); // Gas price limit

// Ethereum Provider & Wallet
const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
const account = wallet.connect(provider);

const router = new ethers.Contract(routerAddress, [
  "function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)",
  "function flash(uint256 amount0, uint256 amount1, address recipient, bytes calldata data) external"
], account);

const quoter = new ethers.Contract(quoterAddress, [
  "function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) public view returns (uint256 amountOut)"
], account);

const getGasPrice = async () => {
  try {
    const response = await axios.get('https://ethgasstation.info/api/ethgasAPI.json');
    return ethers.parseUnits(response.data.fast.toString(), 'gwei');
  } catch (error) {
    return ethers.parseUnits('30', 'gwei');
  }
};

const fetchPrices = async (amount) => {
  try {
    const uniPrice = await quoter.quoteExactInputSingle(wethAddress, wstethAddress, fee, amount, 0);
    return { uniswap: uniPrice };
  } catch (error) {
    console.error("Error fetching prices:", error);
    return null;
  }
};

const executeFlashArbitrage = async (amountIn) => {
  try {
    const deadline = Math.floor(Date.now() / 1000) + 600;
    const flashTx = await router.flash(amountIn, 0, wallet.address, "0x");
    await flashTx.wait();
    console.log(`✅ Flash Arbitrage Executed: ${flashTx.hash}`);
  } catch (error) {
    console.error("Flash Arbitrage Failed:", error);
  }
};

const checkArbitrage = async () => {
  const tradeAmount = ethers.parseUnits("0.1", "ether");
  const prices = await fetchPrices(tradeAmount);
  const gasPrice = await getGasPrice();

  if (!prices) return;

  if (prices.uniswap > minProfitThreshold.add(gasPrice)) {
    console.log(`🟢 Arbitrage Opportunity: Uniswap Profit: ${ethers.formatUnits(prices.uniswap, 'ether')} ETH`);
    await executeFlashArbitrage(tradeAmount);
  } else {
    console.log("❌ No profitable arbitrage found.");
  }
};

provider.on('block', async (blockNumber) => {
  console.log(`🔄 New Block: ${blockNumber}`);
  await checkArbitrage();
});
