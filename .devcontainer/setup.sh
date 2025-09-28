#!/bin/bash

# Market Maker Bot Development Environment Setup
echo "🚀 Setting up Market Maker Bot development environment..."

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Create .env file from sample if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file from sample..."
    cp .env-sample .env
    echo "⚠️  Please update .env file with your actual API keys and private key"
else
    echo "✅ .env file already exists"
fi

# Create historical_data.json placeholder if it doesn't exist
if [ ! -f historical_data.json ]; then
    echo "📊 Creating sample historical data file..."
    cat > historical_data.json << 'EOF'
[
  {
    "timestamp": "2023-01-01T00:00:00Z",
    "amountOut": "40000000000000000000"
  },
  {
    "timestamp": "2023-01-01T01:00:00Z", 
    "amountOut": "39500000000000000000"
  },
  {
    "timestamp": "2023-01-01T02:00:00Z",
    "amountOut": "41000000000000000000"
  }
]
EOF
    echo "✅ Sample historical data created"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Update your .env file with real API keys and private key"
echo "2. Review mm.js configuration (token addresses, target price, etc.)"
echo "3. For testnet trading: Ensure you have Goerli ETH in your wallet"
echo "4. Run 'node mm.js' to start the bot"
echo ""
echo "⚠️  IMPORTANT: This bot is for educational/testing purposes only!"
echo "   Never use real funds without thorough testing and understanding."