# GitHub Codespaces Setup for Market Maker Bot

This repository is now configured for GitHub Codespaces development! 🚀

## Quick Start with Codespaces

### Option 1: Create a new Codespace from GitHub
1. Go to the [Market Maker Bot repository](https://github.com/duffmahn/Market-Maker-Bot)
2. Click the green **"Code"** button
3. Select the **"Codespaces"** tab
4. Click **"Create codespace on main"**
5. Wait for the environment to load (this may take a few minutes)

### Option 2: Use the direct link
Click this button to open in Codespaces: 
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/duffmahn/Market-Maker-Bot)

## What's Included in Your Codespace

Your development environment includes:
- ✅ Node.js 18 runtime
- ✅ All project dependencies pre-installed
- ✅ VS Code extensions for JavaScript development
- ✅ Git and GitHub CLI tools
- ✅ Automatic environment setup

## First Time Setup

After your Codespace loads:

1. **Configure your environment variables:**
   ```bash
   cp .env-sample .env
   # Edit .env with your actual values
   ```

2. **Required Environment Variables:**
   - `PRIVATE_KEY`: Your Ethereum private key (for testnet)
   - `ALCHEMY_API_KEY`: Your Alchemy API key

3. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

## Running the Bot

### For Backtesting (Safe - No Real Trading)
```bash
node mm.js
```
The bot will run in simulation mode using the historical data.

### For Live Trading (⚠️ Use Testnet Only)
1. Make sure your `.env` file has valid testnet credentials
2. Ensure you have Goerli ETH in your test wallet
3. Update token addresses in `mm.js` for testnet
4. Run: `node mm.js`

## Development Features

### Port Forwarding
- Port 3000: For any web interface you might add
- Port 8545: For local blockchain development (Hardhat, Ganache)

### Pre-installed VS Code Extensions
- Prettier (code formatting)
- ESLint (code linting)
- Path IntelliSense
- JSON tools

### File Structure
```
.
├── mm.js                 # Main trading bot logic
├── package.json          # Dependencies
├── .env-sample          # Environment template
├── .env                 # Your actual environment variables
├── historical_data.json # Sample historical data for backtesting
├── README.md            # Main project documentation
└── .devcontainer/       # Codespace configuration
    ├── devcontainer.json
    └── setup.sh
```

## Safety & Best Practices

⚠️ **IMPORTANT SAFETY NOTES:**

1. **Never use mainnet with real funds** until you fully understand the code
2. **Always test on Goerli testnet first**
3. **Keep your private keys secure** - never commit them to Git
4. **Start with small amounts** even on testnet
5. **Monitor gas prices** to avoid expensive transactions

## Troubleshooting

### Common Issues

**"Cannot find module" errors:**
```bash
npm install
```

**Environment variable issues:**
- Make sure your `.env` file exists and has the correct format
- Check that your API keys are valid
- Ensure private key format is correct (with 0x prefix)

**Network connection issues:**
- Verify your Alchemy API key is working
- Check if you're on the correct network (testnet vs mainnet)

### Getting Help

- Check the main [README.md](./README.md) for detailed bot documentation
- Review the code comments in `mm.js`
- Test with small amounts on Goerli testnet first

## Next Steps

1. 📖 Read the main [README.md](./README.md) for detailed bot features
2. 🔧 Configure your trading parameters in `mm.js`
3. 🧪 Test the backtesting functionality first
4. 🚀 Try testnet trading with small amounts
5. 📊 Explore the advanced features (ML, optimization, arbitrage)

Happy coding! 💻✨