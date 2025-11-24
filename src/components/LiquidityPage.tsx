import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { TrendingUp, Droplets, Plus, Minus, ArrowUpDown, Zap, BarChart3, DollarSign, Wallet, Waves, Grid3X3, List, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useWallet } from '../App';
import { getNetworkById, NetworkIcon } from './BlockchainData';

export function LiquidityPage() {
  const { isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState('pools'); // 'pools' or 'user'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [tokenAAmount, setTokenAAmount] = useState('');
  const [tokenBAmount, setTokenBAmount] = useState('');
  const [removePercentage, setRemovePercentage] = useState(25);
  const [showBalances, setShowBalances] = useState(true);
  const [liquidityView, setLiquidityView] = useState<'list' | 'grid'>('list');

  const liquidityPools = [
    {
      id: 1,
      tokenA: { symbol: 'ETH', networkId: 'ethereum', amount: '45.6' },
      tokenB: { symbol: 'USDC', networkId: 'ethereum', amount: '107,234' },
      totalLiquidity: '$251,456,789',
      volume24h: '$12,345,678',
      apr: 15.4,
      userShare: '0.034%',
      userValue: '$8,456.78',
      fees24h: '$124.56'
    },
    {
      id: 2,
      tokenA: { symbol: 'ADA', networkId: 'cardano', amount: '125,678' },
      tokenB: { symbol: 'USDT', networkId: 'ethereum', amount: '56,789' },
      totalLiquidity: '$56,789,123',
      volume24h: '$3,456,789',
      apr: 22.8,
      userShare: '0.067%',
      userValue: '$3,789.45',
      fees24h: '$78.90'
    },
    {
      id: 3,
      tokenA: { symbol: 'SOL', networkId: 'solana', amount: '1,234' },
      tokenB: { symbol: 'USDC', networkId: 'ethereum', amount: '121,876' },
      totalLiquidity: '$121,876,543',
      volume24h: '$8,765,432',
      apr: 18.9,
      userShare: '0.012%',
      userValue: '$1,456.23',
      fees24h: '$45.67'
    },
    {
      id: 4,
      tokenA: { symbol: 'MATIC', networkId: 'polygon', amount: '89,567' },
      tokenB: { symbol: 'ETH', networkId: 'ethereum', amount: '34.7' },
      totalLiquidity: '$81,234,567',
      volume24h: '$4,567,890',
      apr: 12.3,
      userShare: '0.089%',
      userValue: '$7,234.56',
      fees24h: '$56.78'
    },
    {
      id: 5,
      tokenA: { symbol: 'BNB', networkId: 'bnb', amount: '678' },
      tokenB: { symbol: 'BUSD', networkId: 'ethereum', amount: '189,456' },
      totalLiquidity: '$189,456,789',
      volume24h: '$9,876,543',
      apr: 9.7,
      userShare: '0.023%',
      userValue: '$4,356.78',
      fees24h: '$43.21'
    },
    {
      id: 6,
      tokenA: { symbol: 'DOT', networkId: 'polkadot', amount: '12,345' },
      tokenB: { symbol: 'USDC', networkId: 'ethereum', amount: '67,890' },
      totalLiquidity: '$67,890,123',
      volume24h: '$2,345,678',
      apr: 16.8,
      userShare: '0.045%',
      userValue: '$3,056.78',
      fees24h: '$28.90'
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

  const totalStats = {
    totalLiquidity: liquidityPools.reduce((sum, pool) => 
      sum + parseFloat(pool.totalLiquidity.replace(/[$,]/g, '')), 0
    ),
    averageAPR: liquidityPools.reduce((sum, pool) => sum + pool.apr, 0) / liquidityPools.length,
    totalPools: liquidityPools.length,
    userTotalValue: liquidityPools.reduce((sum, pool) => 
      sum + parseFloat(pool.userValue.replace(/[$,]/g, '')), 0
    )
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

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const getAPRColor = (apr: number) => {
    if (apr >= 20) return 'text-success-green';
    if (apr >= 15) return 'text-warning-orange';
    return 'text-muted-foreground';
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

  const handleAddLiquidity = (pool) => {
    setSelectedPool(pool);
    setIsAddModalOpen(true);
  };

  const handleRemoveLiquidity = (poolOrPosition, isPosition = false) => {
    if (isPosition) {
      setSelectedPosition(poolOrPosition);
    } else {
      setSelectedPool(poolOrPosition);
    }
    setIsRemoveModalOpen(true);
  };

  const submitAddLiquidity = () => {
    if (!tokenAAmount || !tokenBAmount) {
      toast.error('Please enter amounts for both tokens');
      return;
    }
    
    toast.success(`Added liquidity: ${tokenAAmount} ${selectedPool.tokenA.symbol} + ${tokenBAmount} ${selectedPool.tokenB.symbol}`);
    setIsAddModalOpen(false);
    setTokenAAmount('');
    setTokenBAmount('');
  };

  const submitRemoveLiquidity = () => {
    const item = selectedPosition || selectedPool;
    const isPosition = !!selectedPosition;
    
    if (isPosition) {
      toast.success(`Removed ${removePercentage}% of liquidity from ${item.tokenA.symbol}-${item.tokenB.symbol} position`);
    } else {
      toast.success(`Removed ${removePercentage}% of liquidity from ${item.tokenA.symbol}-${item.tokenB.symbol} pool`);
    }
    
    setIsRemoveModalOpen(false);
    setRemovePercentage(25);
    setSelectedPosition(null);
    setSelectedPool(null);
  };

  const calculateTokenBAmount = (amountA: string) => {
    if (!selectedPool || !amountA) return '';
    
    const ratio = parseFloat(selectedPool.tokenB.amount.replace(/,/g, '')) / 
                  parseFloat(selectedPool.tokenA.amount.replace(/,/g, ''));
    const calculatedB = parseFloat(amountA) * ratio;
    return calculatedB.toFixed(6);
  };

  const handleTokenAChange = (value: string) => {
    setTokenAAmount(value);
    setTokenBAmount(calculateTokenBAmount(value));
  };

  const renderLiquidityPools = () => (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 gradient-text">Liquidity Pools</h1>
        <p className="text-muted-foreground">
          Provide liquidity and earn rewards from trading fees
        </p>
      </div>

      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="card-glass border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Liquidity</p>
                <p className="text-2xl font-bold">{formatCurrency(totalStats.totalLiquidity)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average APR</p>
                <p className="text-2xl font-bold text-success-green">{totalStats.averageAPR.toFixed(1)}%</p>
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
                <p className="text-sm text-muted-foreground">Active Pools</p>
                <p className="text-2xl font-bold">{totalStats.totalPools}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent/20 border border-white/10 rounded-full flex items-center justify-center">
                <Droplets className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Liquidity</p>
                <p className="text-2xl font-bold">{formatCurrency(totalStats.userTotalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pool Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {liquidityPools.map((pool) => (
          <Card key={pool.id} className="card-glass border-white/10 hover-glow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center -space-x-2">
                    <div className="border-2 border-background z-10">
                      {getTokenIcon(pool.tokenA.networkId)}
                    </div>
                    <div className="border-2 border-background">
                      {getTokenIcon(pool.tokenB.networkId)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {pool.tokenA.symbol}/{pool.tokenB.symbol}
                    </h3>
                  </div>
                </div>
                <Badge className={`${getAPRColor(pool.apr)} border-current bg-transparent`}>
                  {pool.apr}% APR
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Liquidity</p>
                  <p className="font-semibold">{pool.totalLiquidity}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">24h Volume</p>
                  <p className="font-semibold">{pool.volume24h}</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Your Share</p>
                    <p className="font-semibold">{pool.userShare}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Your Value</p>
                    <p className="font-semibold text-primary">{pool.userValue}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">24h Fees Earned: 
                    <span className="text-success-green ml-1">{pool.fees24h}</span>
                  </p>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  onClick={() => handleAddLiquidity(pool)}
                  className="flex-1 bg-gradient-primary hover-glow border-0 text-white"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
                <Button
                  onClick={() => handleRemoveLiquidity(pool)}
                  variant="outline"
                  className="flex-1 border-white/20 hover:bg-white/10"
                  size="sm"
                >
                  <Minus className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );

  const renderUserLiquidity = () => (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 gradient-text">Your Liquidity</h1>
          <p className="text-muted-foreground">
            Track and manage your liquidity positions
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowBalances(!showBalances)}
            variant="outline"
            className="border-white/20 hover:bg-white/10"
          >
            {showBalances ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showBalances ? 'Hide' : 'Show'} Balances
          </Button>
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
      </div>

      {/* Liquidity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                          Pool Share: {position.poolShare} • {position.timeInPool}
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
                        onClick={() => handleRemoveLiquidity(position, true)}
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
                    onClick={() => handleRemoveLiquidity(position, true)}
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
    </>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <Card className="card-glass border-white/10 sticky top-8">
            <CardHeader className="pb-4">
              <CardTitle className="gradient-text">Liquidity Hub</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={activeTab === 'pools' ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  activeTab === 'pools' 
                    ? 'bg-gradient-primary text-white border-0' 
                    : 'hover:bg-white/10 text-foreground'
                }`}
                onClick={() => setActiveTab('pools')}
              >
                <Waves className="w-4 h-4 mr-2" />
                Liquidity Pools
              </Button>
              <Button
                variant={activeTab === 'user' ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  activeTab === 'user' 
                    ? 'bg-gradient-primary text-white border-0' 
                    : 'hover:bg-white/10 text-foreground'
                }`}
                onClick={() => setActiveTab('user')}
                disabled={!isConnected}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Your Liquidity
                {!isConnected && <span className="ml-auto text-xs opacity-50">Connect</span>}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {activeTab === 'pools' ? renderLiquidityPools() : renderUserLiquidity()}
        </div>
      </div>

      {/* Add Liquidity Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md backdrop-blur-glass border-white/10">
          <DialogHeader>
            <DialogTitle className="gradient-text">Add Liquidity</DialogTitle>
            <DialogDescription>
              Add liquidity to the {selectedPool?.tokenA.symbol}/{selectedPool?.tokenB.symbol} pool
            </DialogDescription>
          </DialogHeader>
          
          {selectedPool && (
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">
                    {selectedPool.tokenA.symbol} Amount
                  </Label>
                  <div className="flex items-center space-x-2">
                    {getTokenIcon(selectedPool.tokenA.networkId, 'sm')}
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={tokenAAmount}
                      onChange={(e) => handleTokenAChange(e.target.value)}
                      className="flex-1 bg-white/5 border-white/10"
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">
                    {selectedPool.tokenB.symbol} Amount
                  </Label>
                  <div className="flex items-center space-x-2">
                    {getTokenIcon(selectedPool.tokenB.networkId, 'sm')}
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={tokenBAmount}
                      readOnly
                      className="flex-1 bg-white/5 border-white/10 text-muted-foreground"
                    />
                  </div>
                </div>
              </div>

              {tokenAAmount && tokenBAmount && (
                <div className="p-4 bg-white/5 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pool Share:</span>
                    <span>0.00{Math.floor(Math.random() * 99)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. APR:</span>
                    <span className="text-success-green">{selectedPool.apr}%</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 border-white/20"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={submitAddLiquidity}
                  className="flex-1 bg-gradient-primary hover-glow border-0 text-white"
                  disabled={!tokenAAmount || !tokenBAmount}
                >
                  Add Liquidity
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Remove Liquidity Modal */}
      <Dialog open={isRemoveModalOpen} onOpenChange={setIsRemoveModalOpen}>
        <DialogContent className="sm:max-w-md backdrop-blur-glass border-white/10">
          <DialogHeader>
            <DialogTitle className="gradient-text">Remove Liquidity</DialogTitle>
            <DialogDescription>
              Remove liquidity from {selectedPosition ? 'your' : 'the'} {(selectedPosition || selectedPool)?.tokenA.symbol}/{(selectedPosition || selectedPool)?.tokenB.symbol} {selectedPosition ? 'position' : 'pool'}
            </DialogDescription>
          </DialogHeader>
          
          {(selectedPosition || selectedPool) && (
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{removePercentage}%</p>
                  <p className="text-sm text-muted-foreground">of your {selectedPosition ? 'position' : 'liquidity'}</p>
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
                        {getTokenIcon((selectedPosition || selectedPool).tokenA.networkId, 'sm')}
                        <span>{(selectedPosition || selectedPool).tokenA.symbol}</span>
                      </div>
                      <span className="font-medium">
                        {selectedPosition ? 
                          (parseFloat(selectedPosition.tokenA.balance.replace(/,/g, '')) * removePercentage / 100).toFixed(4) :
                          (parseFloat(selectedPool.tokenA.amount.replace(/,/g, '')) * removePercentage / 100).toFixed(4)
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getTokenIcon((selectedPosition || selectedPool).tokenB.networkId, 'sm')}
                        <span>{(selectedPosition || selectedPool).tokenB.symbol}</span>
                      </div>
                      <span className="font-medium">
                        {selectedPosition ? 
                          (parseFloat(selectedPosition.tokenB.balance.replace(/,/g, '')) * removePercentage / 100).toFixed(4) :
                          (parseFloat(selectedPool.tokenB.amount.replace(/,/g, '')) * removePercentage / 100).toFixed(4)
                        }
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