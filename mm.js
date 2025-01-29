const ethers = require('ethers');
require("dotenv").config();

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

// `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`
const provider = new ethers.JsonRpcProvider(`https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
const account = wallet.connect(provider);

const wsteth = new ethers.Contract(
  wstethAddress,
  [
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address owner, address spender) public view returns (uint256)',
    'function wrap(uint256 _amount) external returns (uint256)',
    'function unwrap(uint256 _amount) external returns (uint256)',
  ],
  account
);

const weth = new ethers.Contract(
  wethAddress,
  [
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address owner, address spender) public view returns (uint256)',
  ],
  account
);

const router = new ethers.Contract(
  routerAddress,
  ['function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)'],
  account
);

const quoter = new ethers.Contract(
  quoterAddress,
  ['function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) public view returns (uint256 amountOut)'],
  account
);

const getLidoWrapUnwrapRatio = async () => {
  // Placeholder function to fetch Lido wrap/unwrap ratio
  // Replace with actual logic to fetch the ratio from Lido contract
  return BigInt(1);
};

const buyTokens = async () => {
  console.log('Buying Tokens');
  const deadline = Math.floor(Date.now() / 1000) + 600;
  const tx = await router.exactInputSingle([wethAddress, wstethAddress, fee, wallet.address, deadline, buyAmount, 0, 0], { value: buyAmount });
  await tx.wait();
  console.log(tx.hash);
};

const sellTokens = async () => {
  console.log('Selling Tokens');
  const allowance = await wsteth.allowance(wallet.address, routerAddress);
  console.log(`Current allowance: ${allowance}`);
  if (allowance < sellAmount) {
    console.log('Approving Spend (bulk approve in production)');
    const atx = await wsteth.approve(routerAddress, sellAmount);
    await atx.wait();
  }
  const deadline = Math.floor(Date.now() / 1000) + 600;
  const tx = await router.exactInputSingle([wstethAddress, wethAddress, fee, wallet.address, deadline, sellAmount, 0, 0]);
  await tx.wait();
  console.log(tx.hash);
};

const checkPrice = async () => {
  const amountOut = await quoter.quoteExactInputSingle(wethAddress, wstethAddress, fee, buyAmount, 0);
  const lidoRatio = await getLidoWrapUnwrapRatio();
  console.log(`Current Exchange Rate: ${amountOut.toString()}`);
  console.log(`Target Exchange Rate: ${targetAmountOut.toString()}`);
  console.log(`Lido Wrap/Unwrap Ratio: ${lidoRatio.toString()}`);
  if (amountOut < targetAmountOut * lidoRatio) buyTokens();
  if (amountOut > targetAmountOut * lidoRatio) sellTokens();
};

const simulateTrades = async () => {
  console.log('Simulating Trades');
  // Placeholder function to simulate trades for testing purposes
  // Replace with actual logic to simulate trades
};

const isTestMode = process.argv.includes('--test');

if (isTestMode) {
  simulateTrades();
} else {
  checkPrice();
  setInterval(() => {
    checkPrice();
  }, tradeFrequency);
}
