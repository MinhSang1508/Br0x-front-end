import React, { useState, createContext, useContext } from 'react';
import { HomePage } from './components/HomePage';
import { SwapPage } from './components/SwapPage';
import { SimpleSwapPage } from './components/SimpleSwapPage';
import { IndirectSwapPage } from './components/IndirectSwapPage';
import { DepositPage } from './components/DepositPage';
import { StatusPage } from './components/StatusPage';
import { DeveloperPanel } from './components/DeveloperPanel';
import { ErrorPage } from './components/ErrorPage';
import { SettingsPage } from './components/SettingsPage';
import { TransactionHistory } from './components/TransactionHistory';
import { LiquidityPage } from './components/LiquidityPage';
import { UserLiquidityPage } from './components/UserLiquidityPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';

// Theme context
const ThemeContext = createContext<{
  isDark: boolean;
  toggleTheme: () => void;
}>({
  isDark: true,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

// Navigation context
const NavigationContext = createContext<{
  currentPage: string;
  setCurrentPage: (page: string) => void;
  swapData: any;
  setSwapData: (data: any) => void;
}>({
  currentPage: 'swap',
  setCurrentPage: () => {},
  swapData: null,
  setSwapData: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

// Transaction History context for temporary storage
const TransactionHistoryContext = createContext<{
  transactions: any[];
  addTransaction: (transaction: any) => void;
  clearTransactions: () => void;
}>({
  transactions: [],
  addTransaction: () => {},
  clearTransactions: () => {},
});

export const useTransactionHistory = () => useContext(TransactionHistoryContext);

// Wallet context
const WalletContext = createContext<{
  isConnected: boolean;
  address: string | null;
  walletType: string | null;
  connectWallet: (walletType: string) => Promise<void>;
  disconnectWallet: () => void;
}>({
  isConnected: false,
  address: null,
  walletType: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export const useWallet = () => useContext(WalletContext);

export default function App() {
  // Dark mode enabled by default
  const [isDark, setIsDark] = useState(true);
  const [currentPage, setCurrentPage] = useState('home'); // Changed from 'swap' to 'home'
  const [swapData, setSwapData] = useState(null);
  
  // Wallet state
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<string | null>(null);

  // Generate diverse mock transactions for history
  const generateMockTransactions = () => {
    const networks = ['Cardano', 'Ethereum', 'BNB Chain', 'Solana', 'Polygon', 'Arbitrum', 'Optimism', 'Fantom', 'Polkadot', 'Avalanche'];
    const tokens = {
      'Cardano': ['ADA', 'DJED', 'SHEN', 'MIN'],
      'Ethereum': ['ETH', 'USDC', 'USDT', 'DAI', 'WBTC', 'UNI', 'LINK', 'AAVE'],
      'BNB Chain': ['BNB', 'BUSD', 'CAKE', 'XVS', 'BSW'],
      'Solana': ['SOL', 'USDC', 'SRM', 'RAY', 'ORCA'],
      'Polygon': ['MATIC', 'USDC', 'USDT', 'WETH', 'AAVE'],
      'Arbitrum': ['ETH', 'USDC', 'ARB', 'GMX', 'MAGIC'],
      'Optimism': ['ETH', 'OP', 'USDC', 'SNX', 'VELO'],
      'Fantom': ['FTM', 'USDC', 'BOO', 'SPIRIT', 'LQDR'],
      'Polkadot': ['DOT', 'KSM', 'GLMR', 'MOVR', 'PARA'],
      'Avalanche': ['AVAX', 'USDC', 'PNG', 'JOE', 'TIME']
    };
    const statuses = ['completed', 'pending', 'failed'];
    const statusWeights = [0.7, 0.2, 0.1]; // 70% completed, 20% pending, 10% failed

    const transactions = [];
    const now = new Date();

    for (let i = 0; i < 65; i++) {
      // Generate more realistic date distribution - more recent transactions, fewer older ones
      let daysAgo;
      if (i < 15) {
        daysAgo = Math.floor(Math.random() * 3); // Last 3 days - 15 transactions
      } else if (i < 30) {
        daysAgo = Math.floor(Math.random() * 7) + 3; // Last week - 15 transactions  
      } else if (i < 45) {
        daysAgo = Math.floor(Math.random() * 14) + 7; // Last 2 weeks - 15 transactions
      } else {
        daysAgo = Math.floor(Math.random() * 16) + 14; // Last month - 20 transactions
      }
      
      const hoursAgo = Math.floor(Math.random() * 24);
      const minutesAgo = Math.floor(Math.random() * 60);
      const secondsAgo = Math.floor(Math.random() * 60);
      const date = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000) - (minutesAgo * 60 * 1000) - (secondsAgo * 1000));

      // Select random networks
      const fromNetwork = networks[Math.floor(Math.random() * networks.length)];
      let toNetwork = networks[Math.floor(Math.random() * networks.length)];
      while (toNetwork === fromNetwork) {
        toNetwork = networks[Math.floor(Math.random() * networks.length)];
      }

      // Select random tokens
      const fromTokens = tokens[fromNetwork];
      const toTokens = tokens[toNetwork];
      const fromToken = fromTokens[Math.floor(Math.random() * fromTokens.length)];
      const toToken = toTokens[Math.floor(Math.random() * toTokens.length)];

      // Generate realistic amounts based on token type
      let baseAmount;
      const tokenPrices = {
        'ETH': 2300, 'BTC': 45000, 'WBTC': 45000, 'BNB': 310, 'SOL': 98, 'ADA': 0.45, 'MATIC': 0.85,
        'DOT': 6.5, 'AVAX': 28, 'FTM': 0.32, 'OP': 1.85, 'ARB': 1.1, 'USDC': 1, 'USDT': 1,
        'DAI': 1, 'BUSD': 1, 'UNI': 6.2, 'LINK': 14.5, 'AAVE': 95, 'CAKE': 2.1, 'XVS': 8.7,
        'SRM': 0.31, 'RAY': 0.18, 'ORCA': 0.85, 'WETH': 2300, 'GMX': 45, 'MAGIC': 1.2,
        'SNX': 2.8, 'VELO': 0.15, 'BOO': 2.3, 'SPIRIT': 0.008, 'LQDR': 12.5, 'KSM': 32,
        'GLMR': 0.25, 'MOVR': 6.8, 'PARA': 0.12, 'PNG': 0.18, 'JOE': 0.35, 'TIME': 8.9,
        'DJED': 1.0, 'SHEN': 0.45, 'MIN': 0.023, 'BSW': 0.075
      };
      
      const price = tokenPrices[fromToken] || Math.random() * 5 + 0.1;
      
      // Generate amounts that make sense for the token price
      if (price > 1000) { // High value tokens like BTC, WBTC
        baseAmount = Math.random() * 2 + 0.001;
      } else if (price > 100) { // Medium-high value tokens like ETH, BNB
        baseAmount = Math.random() * 20 + 0.1;
      } else if (price > 10) { // Medium value tokens
        baseAmount = Math.random() * 100 + 1;
      } else if (price > 1) { // Lower value tokens
        baseAmount = Math.random() * 1000 + 10;
      } else { // Very low value tokens
        baseAmount = Math.random() * 10000 + 100;
      }
      
      const fromAmount = baseAmount.toFixed(price > 100 ? 4 : (price > 1 ? 2 : 0));
      
      // More realistic exchange rates based on market conditions
      const exchangeRate = 0.95 + Math.random() * 0.1; // 0.95 to 1.05 (accounting for fees)
      const toTokenPrice = tokenPrices[toToken] || Math.random() * 5 + 0.1;
      const toBaseAmount = (parseFloat(fromAmount) * price * exchangeRate) / toTokenPrice;
      const toAmount = toBaseAmount.toFixed(toTokenPrice > 100 ? 4 : (toTokenPrice > 1 ? 2 : 0));

      // Select status based on weights
      const rand = Math.random();
      let status;
      if (rand < statusWeights[0]) status = statuses[0];
      else if (rand < statusWeights[0] + statusWeights[1]) status = statuses[1];
      else status = statuses[2];

      const value = (parseFloat(fromAmount) * price).toFixed(2);

      // Generate transaction hash based on network
      let txHash;
      if (fromNetwork === 'Cardano') {
        // Cardano transaction hash format
        txHash = Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      } else if (fromNetwork === 'Solana') {
        // Solana transaction signature format (base58)
        const base58chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        txHash = Array.from({length: 88}, () => base58chars[Math.floor(Math.random() * base58chars.length)]).join('');
      } else {
        // Ethereum-style hash for EVM chains
        txHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      }

      transactions.push({
        id: `BSW_${Math.random().toString(36).substr(2, 9)}`,
        date: date.toISOString().replace('T', ' ').split('.')[0],
        fromChain: fromNetwork,
        fromToken: fromToken,
        fromAmount: fromAmount,
        toChain: toNetwork,
        toToken: toToken,
        toAmount: toAmount,
        status: status,
        txHash: txHash,
        value: `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
      });
    }

    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Transaction history state - includes both historical and temporary transactions
  const [transactions, setTransactions] = useState<any[]>(() => {
    const historicalTxs = generateMockTransactions();
    return historicalTxs;
  });

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Generate appropriate address format based on wallet type
  const generateMockAddress = (wallet: string): string => {
    switch (wallet) {
      case 'eternl':
      case 'lace':
        // Cardano address format
        return 'addr1qxy677pvx4h4jh6xylj0jv23x5n5ywj6t8ql6zz4q5x9qr5rn0d6n7yr9h8j5k6l7m8n9p0q1r2s3t4u5v6w7x8y9z0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0';
      case 'metamask':
      case 'okx':
        // Ethereum address format
        return '0x' + Math.random().toString(16).substring(2, 42).padStart(40, '0');
      case 'subwallet':
        // Can be either format, default to Ethereum for demo
        return '0x' + Math.random().toString(16).substring(2, 42).padStart(40, '0');
      default:
        return '0x' + Math.random().toString(16).substring(2, 42).padStart(40, '0');
    }
  };

  const connectWallet = async (wallet: string) => {
    try {
      // Mock wallet connection - in real implementation, this would connect to actual wallets
      const walletNames = {
        'metamask': 'MetaMask',
        'subwallet': 'Sub-wallet',
        'okx': 'OKX Wallet',
        'eternl': 'Eternl',
        'lace': 'Lace'
      };

      // Mock connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Set appropriate address format and wallet type
      setAddress(generateMockAddress(wallet));
      setWalletType(walletNames[wallet] || wallet);
      setIsConnected(true);
      
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setWalletType(null);
  };

  // Transaction history functions
  const addTransaction = (transaction: any) => {
    const newTransaction = {
      ...transaction,
      id: `BSW_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString().replace('T', ' ').split('.')[0],
      status: 'pending',
      temporary: true // Mark as temporary transaction
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const clearTransactions = () => {
    // Only clear temporary transactions, keep historical ones
    setTransactions(prev => prev.filter(tx => !tx.temporary));
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'swap':
        return <SwapPage />; // Main swap type selection page
      case 'quote-swap':
      case 'indirect-swap':
        return <IndirectSwapPage />; // Indirect swap (get quote type)
      case 'direct-swap':
        return <SimpleSwapPage />; // Direct swap (regular swap type)
      case 'advanced-swap':
        return <SimpleSwapPage />; // Legacy route
      case 'history':
        return <TransactionHistory />;
      case 'liquidity':
        return <LiquidityPage />;
      case 'user-liquidity':
        return <UserLiquidityPage />;
      case 'deposit':
        return <DepositPage />;
      case 'status':
        return <StatusPage />;
      case 'developer':
        return <DeveloperPanel />;
      case 'error':
        return <ErrorPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <SwapPage />; // Default to swap selection page
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <NavigationContext.Provider value={{ currentPage, setCurrentPage, swapData, setSwapData }}>
        <WalletContext.Provider value={{ isConnected, address, walletType, connectWallet, disconnectWallet }}>
          <TransactionHistoryContext.Provider value={{ transactions, addTransaction, clearTransactions }}>
            <div className={isDark ? 'dark' : ''}>
              <div className="min-h-screen bg-background text-foreground">
                <Header />
                <main className="container mx-auto px-4 py-8 relative z-10">
                  {renderCurrentPage()}
                </main>
                <Footer />
                <Toaster 
                  theme={isDark ? 'dark' : 'light'}
                  className="toaster"
                  toastOptions={{
                    style: {
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    },
                  }}
                />
              </div>
            </div>
          </TransactionHistoryContext.Provider>
        </WalletContext.Provider>
      </NavigationContext.Provider>
    </ThemeContext.Provider>
  );
}