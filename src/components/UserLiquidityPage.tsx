import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { useWallet } from '../App';
import { TrendingUp, Droplets, Plus, Minus, ArrowUpDown, Zap, BarChart3, DollarSign, Calendar, Eye, EyeOff, Wallet, Coins, TrendingDown, Grid3X3, List } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getNetworkById, NetworkIcon } from './BlockchainData';
import subwalletLogo from '../assets/cdf88002033f44055486f7dfa30e8e32dd79666b.png';
import laceLogo from '../assets/87e267b72fceea58e435c8d1b46f365b52a7e8c8.png';
import eternlLogo from '../assets/9bf46c8ae675c8d7f4c58af2e33a8c3dfd58a514.png';
import metamaskLogo from '../assets/5c18b223369775af8201db53a4dbe7680d52f4fd.png';
import okxLogo from '../assets/0836fcef9cfad78811d99a8c6666fe4455476a75.png';

export function UserLiquidityPage() {
  const { isConnected, connectWallet } = useWallet();
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [removePercentage, setRemovePercentage] = useState(25);
  const [showBalances, setShowBalances] = useState(true);
  const [assetsView, setAssetsView] = useState<'list' | 'grid'>('list');
  const [liquidityView, setLiquidityView] = useState<'list' | 'grid'>('list');

  // Mock user wallet assets with proper network mapping
  const userAssets = [
    {
      id: 1,
      symbol: 'ETH',
      name: 'Ethereum',
      networkId: 'ethereum',
      balance: '2.456789',
      value: '$5,847.32',
      price: '$2,380.50',
      change24h: '+5.24%',
      changeValue: '+$289.45',
      isPositive: true
    },
    {
      id: 2,
      symbol: 'ADA',
      name: 'Cardano',
      networkId: 'cardano',
      balance: '12,567.89',
      value: '$4,523.67',
      price: '$0.36',
      change24h: '+2.18%',
      changeValue: '+$96.75',
      isPositive: true
    },
    {
      id: 3,
      symbol: 'SOL',
      name: 'Solana',
      networkId: 'solana',
      balance: '45.234',
      value: '$3,987.45',
      price: '$88.20',
      change24h: '-1.45%',
      changeValue: '-$58.92',
      isPositive: false
    },
    {
      id: 4,
      symbol: 'BNB',
      name: 'BNB',
      networkId: 'bnb',
      balance: '8.9876',
      value: '$2,456.78',
      price: '$273.45',
      change24h: '+3.67%',
      changeValue: '+$87.23',
      isPositive: true
    },
    {
      id: 5,
      symbol: 'USDC',
      name: 'USD Coin',
      networkId: 'ethereum',
      balance: '1,845.67',
      value: '$1,845.67',
      price: '$1.00',
      change24h: '+0.01%',
      changeValue: '+$0.18',
      isPositive: true
    },
    {
      id: 6,
      symbol: 'MATIC',
      name: 'Polygon',
      networkId: 'polygon',
      balance: '2,567.89',
      value: '$1,234.56',
      price: '$0.48',
      change24h: '-2.34%',
      changeValue: '-$29.45',
      isPositive: false
    },
    {
      id: 7,
      symbol: 'DOT',
      name: 'Polkadot',
      networkId: 'polkadot',
      balance: '145.67',
      value: '$987.23',
      price: '$6.78',
      change24h: '+1.89%',
      changeValue: '+$18.34',
      isPositive: true
    },
    {
      id: 8,
      symbol: 'USDT',
      name: 'Tether',
      networkId: 'ethereum',
      balance: '756.45',
      value: '$756.45',
      price: '$1.00',
      change24h: '0.00%',
      changeValue: '+$0.00',
      isPositive: true
    },
    {
      id: 9,
      symbol: 'AVAX',
      name: 'Avalanche',
      networkId: 'avalanche',
      balance: '67.89',
      value: '$1,567.23',
      price: '$23.09',
      change24h: '+4.12%',
      changeValue: '+$62.13',
      isPositive: true
    },
    {
      id: 10,
      symbol: 'FTM',
      name: 'Fantom',
      networkId: 'fantom',
      balance: '3,456.78',
      value: '$845.34',
      price: '$0.24',
      change24h: '-3.21%',
      changeValue: '-$28.11',
      isPositive: false
    },
    {
      id: 11,
      symbol: 'ARB',
      name: 'Arbitrum',
      networkId: 'arbitrum',
      balance: '1,234.56',
      value: '$678.90',
      price: '$0.55',
      change24h: '+2.67%',
      changeValue: '+$17.69',
      isPositive: true
    }
  ];

  // User's liquidity positions with network mapping
  const userPositions = [
    {
      id: 1,
      tokenA: { symbol: 'ETH', networkId: 'ethereum', balance: '2.45' },
      tokenB: { symbol: 'USDC', networkId: 'ethereum', balance: '5,234.67' },
      poolShare: '0.034%',
      currentValue: '$8,456.78',
      initialValue: '$7,890.00',
      pnl: '+$566.78',
      pnlPercentage: '+7.18%',
      apr: 15.4,
      feesEarned: '$124.56',
      timeInPool: '14 days',
      lastAdded: '2024-12-15'
    },
    {
      id: 2,
      tokenA: { symbol: 'ADA', networkId: 'cardano', balance: '8,567.89' },
      tokenB: { symbol: 'USDT', networkId: 'ethereum', balance: '3,789.45' },
      poolShare: '0.067%',
      currentValue: '$3,789.45',
      initialValue: '$3,200.00',
      pnl: '+$589.45',
      pnlPercentage: '+18.42%',
      apr: 22.8,
      feesEarned: '$78.90',
      timeInPool: '21 days',
      lastAdded: '2024-12-08'
    },
    {
      id: 3,
      tokenA: { symbol: 'SOL', networkId: 'solana', balance: '12.34' },
      tokenB: { symbol: 'USDC', networkId: 'ethereum', balance: '1,456.23' },
      poolShare: '0.012%',
      currentValue: '$1,456.23',
      initialValue: '$1,600.00',
      pnl: '-$143.77',
      pnlPercentage: '-8.99%',
      apr: 18.9,
      feesEarned: '$45.67',
      timeInPool: '7 days',
      lastAdded: '2024-12-22'
    },
    {
      id: 4,
      tokenA: { symbol: 'MATIC', networkId: 'polygon', balance: '4,567.89' },
      tokenB: { symbol: 'ETH', networkId: 'ethereum', balance: '1.75' },
      poolShare: '0.089%',
      currentValue: '$7,234.56',
      initialValue: '$6,800.00',
      pnl: '+$434.56',
      pnlPercentage: '+6.39%',
      apr: 12.3,
      feesEarned: '$56.78',
      timeInPool: '28 days',
      lastAdded: '2024-12-01'
    },
    {
      id: 5,
      tokenA: { symbol: 'DOT', networkId: 'polkadot', balance: '234.56' },
      tokenB: { symbol: 'USDC', networkId: 'ethereum', balance: '987.65' },
      poolShare: '0.023%',
      currentValue: '$2,345.67',
      initialValue: '$2,100.00',
      pnl: '+$245.67',
      pnlPercentage: '+11.70%',
      apr: 19.2,
      feesEarned: '$34.12',
      timeInPool: '18 days',
      lastAdded: '2024-12-11'
    },
    {
      id: 6,
      tokenA: { symbol: 'AVAX', networkId: 'avalanche', balance: '89.12' },
      tokenB: { symbol: 'USDT', networkId: 'ethereum', balance: '1,234.56' },
      poolShare: '0.045%',
      currentValue: '$3,456.78',
      initialValue: '$3,200.00',
      pnl: '+$256.78',
      pnlPercentage: '+8.02%',
      apr: 14.7,
      feesEarned: '$42.89',
      timeInPool: '25 days',
      lastAdded: '2024-12-04'
    }
  ];

  const assetStats = {
    totalValue: userAssets.reduce((sum, asset) => 
      sum + parseFloat(asset.value.replace(/[$,]/g, '')), 0
    ),
    total24hChange: userAssets.reduce((sum, asset) => {
      const change = parseFloat(asset.changeValue.replace(/[+$,]/g, ''));
      return sum + (asset.changeValue.startsWith('-') ? -change : change);
    }, 0),
    totalAssets: userAssets.length,
    positiveAssets: userAssets.filter(asset => asset.isPositive).length
  };

  const liquidityStats = {
    totalValue: userPositions.reduce((sum, pos) => 
      sum + parseFloat(pos.currentValue.replace(/[$,]/g, '')), 0
    ),
    totalPnL: userPositions.reduce((sum, pos) => {
      const pnl = parseFloat(pos.pnl.replace(/[+$,]/g, ''));
      return sum + (pos.pnl.startsWith('-') ? -pnl : pnl);
    }, 0),
    totalFeesEarned: userPositions.reduce((sum, pos) => 
      sum + parseFloat(pos.feesEarned.replace(/[$,]/g, '')), 0
    ),
    averageAPR: userPositions.reduce((sum, pos) => sum + pos.apr, 0) / userPositions.length,
    activePositions: userPositions.length
  };

  const overallStats = {
    totalPortfolioValue: assetStats.totalValue + liquidityStats.totalValue,
    totalPnL: assetStats.total24hChange + liquidityStats.totalPnL
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const getPnLColor = (pnl: string | number) => {
    const numValue = typeof pnl === 'string' ? 
      (pnl.startsWith('+') || pnl.startsWith('-') ? pnl : `+${pnl}`) : 
      pnl;
    
    if (typeof numValue === 'string' && numValue.startsWith('+')) return 'text-success-green';
    if (typeof numValue === 'string' && numValue.startsWith('-')) return 'text-error-red';
    if (typeof numValue === 'number' && numValue > 0) return 'text-success-green';
    if (typeof numValue === 'number' && numValue < 0) return 'text-error-red';
    return 'text-muted-foreground';
  };

  const getAPRColor = (apr: number) => {
    if (apr >= 20) return 'text-success-green';
    if (apr >= 15) return 'text-warning-orange';
    return 'text-muted-foreground';
  };

  const getTokenIcon = (networkId: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    const network = getNetworkById(networkId);
    if (network) {
      return <NetworkIcon network={network} size={size} />;
    }
    // Fallback
    return (
      <div className={`${size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8'} bg-gradient-primary rounded-full flex items-center justify-center`}>
        <span className="text-white text-sm font-bold">?</span>
      </div>
    );
  };

  const handleRemoveLiquidity = (position) => {
    setSelectedPosition(position);
    setIsRemoveModalOpen(true);
  };

  const submitRemoveLiquidity = () => {
    toast.success(`Removed ${removePercentage}% of liquidity from ${selectedPosition.tokenA.symbol}-${selectedPosition.tokenB.symbol} position`);
    setIsRemoveModalOpen(false);
    setRemovePercentage(25);
  };

  const handleConnect = async (walletType: string) => {
    try {
      await connectWallet(walletType);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-text">Portfolio</h1>
          <p className="text-muted-foreground">
            Track your assets and liquidity positions
          </p>
        </div>

        <Card className="card-glass border-white/10 max-w-md mx-auto">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground mb-6">
                Connect your wallet to view your portfolio, assets, and liquidity positions.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => handleConnect('metamask')}
                className="w-full justify-start bg-white/5 hover:bg-white/10 border border-white/10"
                variant="outline"
              >
                <div className="w-6 h-6 mr-3 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                  <ImageWithFallback
                    src={metamaskLogo}
                    alt="MetaMask Logo"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                Connect MetaMask
              </Button>
              
              <Button
                onClick={() => handleConnect('subwallet')}
                className="w-full justify-start bg-white/5 hover:bg-white/10 border border-white/10"
                variant="outline"
              >
                <div className="w-6 h-6 mr-3 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                  <ImageWithFallback
                    src={subwalletLogo}
                    alt="Sub-wallet Logo"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                Connect Sub-wallet
              </Button>
              
              <Button
                onClick={() => handleConnect('okx')}
                className="w-full justify-start bg-white/5 hover:bg-white/10 border border-white/10"
                variant="outline"
              >
                <div className="w-6 h-6 mr-3 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                  <ImageWithFallback
                    src={okxLogo}
                    alt="OKX Wallet Logo"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                Connect OKX Wallet
              </Button>
              
              <Button
                onClick={() => handleConnect('eternl')}
                className="w-full justify-start bg-white/5 hover:bg-white/10 border border-white/10"
                variant="outline"
              >
                <div className="w-6 h-6 mr-3 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                  <ImageWithFallback
                    src={eternlLogo}
                    alt="Eternl Logo"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                Connect Eternl
              </Button>
              
              <Button
                onClick={() => handleConnect('lace')}
                className="w-full justify-start bg-white/5 hover:bg-white/10 border border-white/10"
                variant="outline"
              >
                <div className="w-6 h-6 mr-3 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                  <ImageWithFallback
                    src={laceLogo}
                    alt="Lace Logo"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                Connect Lace
              </Button>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Secure & Non-custodial:</strong> Your wallet stays in your control. 
                We only read your balance and transaction data to provide portfolio insights.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 gradient-text">Portfolio</h1>
          <p className="text-muted-foreground">
            Your complete crypto portfolio overview
          </p>
        </div>
        <Button
          onClick={() => setShowBalances(!showBalances)}
          variant="outline"
          className="border-white/20 hover:bg-white/10"
        >
          {showBalances ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
          {showBalances ? 'Hide' : 'Show'} Balances
        </Button>
      </div>

      {/* Portfolio Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-glass border-white/10 md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                <p className="text-4xl font-bold">
                  {showBalances ? formatCurrency(overallStats.totalPortfolioValue) : '****'}
                </p>
                <div className={`text-sm ${getPnLColor(overallStats.totalPnL)}`}>
                  {showBalances ? `${overallStats.totalPnL >= 0 ? '+' : ''}${formatCurrency(Math.abs(overallStats.totalPnL))} (24h)` : '****'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                overallStats.totalPnL >= 0 ? 'bg-success-green/20' : 'bg-error-red/20'
              }`}>
                {overallStats.totalPnL >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-success-green" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-error-red" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">24h Change</p>
                <p className={`text-xl font-bold ${getPnLColor(overallStats.totalPnL)}`}>
                  {showBalances ? `${overallStats.totalPnL >= 0 ? '+' : ''}${((overallStats.totalPnL / overallStats.totalPortfolioValue) * 100).toFixed(2)}%` : '****'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Your Assets Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-secondary rounded-full flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Your Assets</h2>
              <p className="text-sm text-muted-foreground">
                {assetStats.totalAssets} tokens â€¢ {showBalances ? formatCurrency(assetStats.totalValue) : '****'} total value
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={assetsView === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAssetsView('list')}
              className={assetsView === 'list' ? 'bg-gradient-primary border-0 text-white' : 'border-white/20 hover:bg-white/10'}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={assetsView === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAssetsView('grid')}
              className={assetsView === 'grid' ? 'bg-gradient-primary border-0 text-white' : 'border-white/20 hover:bg-white/10'}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Assets Display */}
        {assetsView === 'list' ? (
          <Card className="card-glass border-white/10">
            <CardContent className="p-0">
              <div className="space-y-0">
                {userAssets.map((asset, index) => (
                  <div key={asset.id} className={`p-4 ${index !== userAssets.length - 1 ? 'border-b border-white/10' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getTokenIcon(asset.networkId)}
                        <div>
                          <h3 className="font-semibold">{asset.symbol}</h3>
                          <p className="text-sm text-muted-foreground">{asset.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {showBalances ? asset.value : '****'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {showBalances ? `${asset.balance} ${asset.symbol}` : '****'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{asset.price}</p>
                        <div className={`text-sm ${getPnLColor(asset.changeValue)}`}>
                          {showBalances ? asset.change24h : '****'}
                        </div>
                      </div>
                      <Badge className={`${getPnLColor(asset.change24h)} border-current bg-transparent`}>
                        {showBalances ? asset.changeValue : '****'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {userAssets.map((asset) => (
              <Card key={asset.id} className="card-glass border-white/10 hover-glow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getTokenIcon(asset.networkId)}
                      <div>
                        <h3 className="font-semibold">{asset.symbol}</h3>
                        <p className="text-xs text-muted-foreground">{asset.name}</p>
                      </div>
                    </div>
                    <Badge className={`${getPnLColor(asset.change24h)} border-current bg-transparent text-xs`}>
                      {asset.change24h}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Balance</span>
                      <span className="font-medium">
                        {showBalances ? asset.balance : '****'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Value</span>
                      <span className="font-bold">
                        {showBalances ? asset.value : '****'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">24h</span>
                      <span className={`text-sm font-medium ${getPnLColor(asset.changeValue)}`}>
                        {showBalances ? asset.changeValue : '****'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Your Liquidity Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/20 border border-white/10 rounded-full flex items-center justify-center">
              <Droplets className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Your Liquidity</h2>
              <p className="text-sm text-muted-foreground">
                {liquidityStats.activePositions} positions â€¢ {showBalances ? formatCurrency(liquidityStats.totalValue) : '****'} total value
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={liquidityView === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLiquidityView('list')}
              className={liquidityView === 'list' ? 'bg-gradient-primary border-0 text-white' : 'border-white/20 hover:bg-white/10'}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={liquidityView === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLiquidityView('grid')}
              className={liquidityView === 'grid' ? 'bg-gradient-primary border-0 text-white' : 'border-white/20 hover:bg-white/10'}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Liquidity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-glass border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Liquidity Value</p>
                  <p className="text-2xl font-bold">
                    {showBalances ? formatCurrency(liquidityStats.totalValue) : '****'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  liquidityStats.totalPnL >= 0 ? 'bg-success-green/20' : 'bg-error-red/20'
                }`}>
                  <TrendingUp className={`w-6 h-6 ${
                    liquidityStats.totalPnL >= 0 ? 'text-success-green' : 'text-error-red'
                  }`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total P&L</p>
                  <p className={`text-2xl font-bold ${getPnLColor(liquidityStats.totalPnL >= 0 ? '+' : '-')}`}>
                    {showBalances ? `${liquidityStats.totalPnL >= 0 ? '+' : ''}${formatCurrency(Math.abs(liquidityStats.totalPnL))}` : '****'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fees Earned</p>
                  <p className="text-2xl font-bold text-success-green">
                    {showBalances ? formatCurrency(liquidityStats.totalFeesEarned) : '****'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent/20 border border-white/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg APR</p>
                  <p className="text-2xl font-bold text-warning-orange">
                    {liquidityStats.averageAPR.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liquidity Positions Display */}
        {liquidityView === 'list' ? (
          <Card className="card-glass border-white/10">
            <CardContent className="p-0">
              <div className="space-y-0">
                {userPositions.map((position, index) => (
                  <div key={position.id} className={`p-6 ${index !== userPositions.length - 1 ? 'border-b border-white/10' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center -space-x-2">
                          {getTokenIcon(position.tokenA.networkId, 'md')}
                          {getTokenIcon(position.tokenB.networkId, 'md')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {position.tokenA.symbol}/{position.tokenB.symbol}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Pool Share: {position.poolShare} â€¢ {position.timeInPool}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          {showBalances ? position.currentValue : '****'}
                        </p>
                        <p className={`text-sm ${getPnLColor(position.pnl)}`}>
                          {showBalances ? `${position.pnl} (${position.pnlPercentage})` : '****'}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getAPRColor(position.apr)} border-current bg-transparent`}>
                          {position.apr}% APR
                        </Badge>
                        <p className="text-sm text-success-green mt-1">
                          {showBalances ? position.feesEarned : '****'} fees
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleRemoveLiquidity(position)}
                          variant="outline"
                          className="border-white/20 hover:bg-white/10"
                          size="sm"
                        >
                          <Minus className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                        <Button
                          className="bg-gradient-primary hover-glow border-0 text-white"
                          size="sm"
                        >
                          <ArrowUpDown className="w-4 h-4 mr-1" />
                          Rebalance
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userPositions.map((position) => (
              <Card key={position.id} className="card-glass border-white/10 hover-glow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center -space-x-2">
                        {getTokenIcon(position.tokenA.networkId)}
                        {getTokenIcon(position.tokenB.networkId)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {position.tokenA.symbol}/{position.tokenB.symbol}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Pool Share: {position.poolShare}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getAPRColor(position.apr)} border-current bg-transparent`}>
                      {position.apr}% APR
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Position Value */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Value</p>
                      <p className="text-xl font-bold">
                        {showBalances ? position.currentValue : '****'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">P&L</p>
                      <p className={`text-xl font-bold ${getPnLColor(position.pnl)}`}>
                        {showBalances ? position.pnl : '****'}
                      </p>
                      <p className={`text-xs ${getPnLColor(position.pnl)}`}>
                        {showBalances ? position.pnlPercentage : '****'}
                      </p>
                    </div>
                  </div>

                  {/* Token Balances */}
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-sm text-muted-foreground mb-3">Your Tokens</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getTokenIcon(position.tokenA.networkId, 'sm')}
                          <span className="text-sm">{position.tokenA.symbol}</span>
                        </div>
                        <span className="font-medium">
                          {showBalances ? position.tokenA.balance : '****'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getTokenIcon(position.tokenB.networkId, 'sm')}
                          <span className="text-sm">{position.tokenB.symbol}</span>
                        </div>
                        <span className="font-medium">
                          {showBalances ? position.tokenB.balance : '****'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-muted-foreground">Fees Earned</p>
                      <p className="font-medium text-success-green">
                        {showBalances ? position.feesEarned : '****'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Time in Pool</p>
                      <p className="font-medium">{position.timeInPool}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button
                      onClick={() => handleRemoveLiquidity(position)}
                      variant="outline"
                      className="flex-1 border-white/20 hover:bg-white/10"
                      size="sm"
                    >
                      <Minus className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-primary hover-glow border-0 text-white"
                      size="sm"
                    >
                      <ArrowUpDown className="w-4 h-4 mr-1" />
                      Rebalance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Remove Liquidity Modal */}
      <Dialog open={isRemoveModalOpen} onOpenChange={setIsRemoveModalOpen}>
        <DialogContent className="sm:max-w-md backdrop-blur-glass border-white/10">
          <DialogHeader>
            <DialogTitle className="gradient-text">Remove Liquidity</DialogTitle>
            <DialogDescription>
              Remove liquidity from your {selectedPosition?.tokenA.symbol}/{selectedPosition?.tokenB.symbol} position
            </DialogDescription>
          </DialogHeader>
          
          {selectedPosition && (
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{removePercentage}%</p>
                  <p className="text-sm text-muted-foreground">of your position</p>
                </div>

                <div className="space-y-3">
                  <div className="flex space-x-2">
                    {[25, 50, 75, 100].map((percentage) => (
                      <Button
                        key={percentage}
                        variant={removePercentage === percentage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setRemovePercentage(percentage)}
                        className={removePercentage === percentage 
                          ? "bg-gradient-primary border-0 text-white" 
                          : "border-white/20 hover:bg-white/10"
                        }
                      >
                        {percentage}%
                      </Button>
                    ))}
                  </div>

                  <Input
                    type="range"
                    min="1"
                    max="100"
                    value={removePercentage}
                    onChange={(e) => setRemovePercentage(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="p-4 bg-white/5 rounded-lg space-y-3">
                  <p className="font-medium">You will receive:</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getTokenIcon(selectedPosition.tokenA.networkId, 'sm')}
                        <span>{selectedPosition.tokenA.symbol}</span>
                      </div>
                      <span className="font-medium">
                        {(parseFloat(selectedPosition.tokenA.balance.replace(/,/g, '')) * removePercentage / 100).toFixed(4)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getTokenIcon(selectedPosition.tokenB.networkId, 'sm')}
                        <span>{selectedPosition.tokenB.symbol}</span>
                      </div>
                      <span className="font-medium">
                        {(parseFloat(selectedPosition.tokenB.balance.replace(/,/g, '')) * removePercentage / 100).toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsRemoveModalOpen(false)}
                  className="flex-1 border-white/20"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={submitRemoveLiquidity}
                  className="flex-1 bg-gradient-primary hover-glow border-0 text-white"
                >
                  Remove Liquidity
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
