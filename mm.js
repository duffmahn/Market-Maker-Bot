const ethers = require('ethers');
const axios = require('axios');
require("dotenv").config();

const wethAddress = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'; // Goerli WETH
const wstethAddress = '0x6320cD32aA674d2898A68ec82e869385Fc5f7E2f'; // Goerli wstETH
const routerAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'; // Uniswap Router
const quoterAddress = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'; // Uniswap Quoter
const fee = 3000;
const tradeFrequency = 3600 * 1000;
const slippageTolerance = 0.01;

const provider = new ethers.JsonRpcProvider(`https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
const account = wallet.connect(provider);

// Initialize Uniswap Contracts
const router = new ethers.Contract(routerAddress, [
  "function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)",
], account);

const quoter = new ethers.Contract(quoterAddress, [
  "function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) public view returns (uint256 amountOut)",
], account);

// ✅ Telegram Alerts
const sendAlert = async (message) => {
  try {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    await axios.post(url, { chat_id: process.env.TELEGRAM_CHAT_ID, text: message });
  } catch (error) {
    console.error("❌ Failed to send alert:", error);
  }
};

// 📊 Fetch Lido Wrap/Unwrap Rate
const fetchLidoRate = async () => {
  try {
    const response = await axios.get('https://api.lido.fi/api/steth');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching Lido rate:', error);
    return null;
  }
};

// ⛽ Fetch Real-Time Gas Prices
const fetchGasPrice = async () => {
  try {
    const response = await axios.get('https://ethgasstation.info/api/ethgasAPI.json');
    return response.data.fast / 10; // Convert to Gwei
  } catch (error) {
    console.error('❌ Error fetching gas price:', error);
    return null;
  }
};

// 🏦 Execute Trade with Uniswap
const executeTrade = async (tokenIn, tokenOut, amountIn) => {
  try {
    const deadline = Math.floor(Date.now() / 1000) + 600;
    const amountOutMin = amountIn.mul(ethers.BigNumber.from(1 - slippageTolerance));

    const tx = await router.exactInputSingle(
      [tokenIn, tokenOut, fee, wallet.address, deadline, amountIn, amountOutMin, 0],
      { value: tokenIn === wethAddress ? amountIn : 0 }
    );

    await tx.wait();
    sendAlert(`✅ Trade Executed | TX: ${tx.hash}`);
  } catch (error) {
    console.error("❌ Trade Execution Failed:", error);
    sendAlert(`⚠️ Trade Failed: ${error.message}`);
  }
};

// 📡 Monitor Price & Execute Arbitrage
const checkPrice = async () => {
  try {
    const lidoRate = await fetchLidoRate();
    const gasPrice = await fetchGasPrice();
    if (!lidoRate || !gasPrice) return;

    const buyAmount = ethers.parseUnits("0.001", "ether");
    const amountOut = await quoter.quoteExactInputSingle(wethAddress, wstethAddress, fee, buyAmount, 0);

    console.log(`📊 Market Price: ${amountOut.toString()}`);
    console.log(`🎯 Lido Wrap Rate: ${lidoRate.wrap}`);
    console.log(`⛽ Gas Price: ${gasPrice} Gwei`);

    const adjustedTargetPrice = ethers.BigNumber.from(lidoRate.wrap).mul(ethers.BigNumber.from(gasPrice));

    if (amountOut.lt(adjustedTargetPrice)) {
      await executeTrade(wethAddress, wstethAddress, buyAmount);
    } else if (amountOut.gt(adjustedTargetPrice)) {
      await executeTrade(wstethAddress, wethAddress, buyAmount);
    }
  } catch (error) {
    console.error("❌ Error in price check:", error);
  }
};

// 🔄 Hook: Dynamic Liquidity Reallocation
const manageLiquidity = async () => {
  try {
    console.log("🔄 Adjusting Liquidity...");
    const lidoRate = await fetchLidoRate();
    if (!lidoRate) return;

    const targetThreshold = ethers.BigNumber.from(lidoRate.wrap).mul(ethers.BigNumber.from(0.99)); // Adjust threshold

    const liquidityChange = await router.exactInputSingle(
      [wstethAddress, wethAddress, fee, wallet.address, Math.floor(Date.now() / 1000) + 600, targetThreshold, 0, 0]
    );

    await liquidityChange.wait();
    sendAlert(`🔄 Liquidity Adjusted`);
  } catch (error) {
    console.error("❌ Liquidity Adjustment Failed:", error);
  }
};

// 📡 Hook: Capture Profitable Arbitrage
const captureArbitrage = async () => {
  try {
    const lidoRate = await fetchLidoRate();
    const amountOut = await quoter.quoteExactInputSingle(wethAddress, wstethAddress, fee, ethers.parseUnits("0.001", "ether"), 0);

    if (amountOut.gt(lidoRate.wrap)) {
      console.log("🚀 Arbitrage Opportunity Detected!");
      sendAlert("🚀 Arbitrage Opportunity Available!");
      await executeTrade(wstethAddress, wethAddress, ethers.parseUnits("0.001", "ether"));
    }
  } catch (error) {
    console.error("❌ Error Capturing Arbitrage:", error);
  }
};

// ⏳ Run Functions on New Blocks
provider.on('block', async (blockNumber) => {
  console.log(`🔄 New Block: ${blockNumber}`);
  await checkPrice();
  await manageLiquidity();
  await captureArbitrage();
});
