import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { ArrowUpDown, Check, Zap, Clock, TrendingUp, AlertTriangle, Settings, RefreshCw, ExternalLink, Wallet, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useWallet, useTransactionHistory } from '../App';
import { getNetworkById, NetworkIcon } from './BlockchainData';

export function SimpleSwapPage() {
  const { isConnected, address } = useWallet();
  const { addTransaction } = useTransactionHistory();
  const [fromChain, setFromChain] = useState('cardano');
  const [toChain, setToChain] = useState('ethereum');
  const [fromToken, setFromToken] = useState('ADA');
  const [toToken, setToToken] = useState('ETH');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [selectedRouter, setSelectedRouter] = useState(0);
  const [slippage, setSlippage] = useState('1.0');
  const [isLoading, setIsLoading] = useState(false);
  const [priceImpact, setPriceImpact] = useState(0.5);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [customTokenModalOpen, setCustomTokenModalOpen] = useState(false);
  const [tokenInputType, setTokenInputType] = useState<'from' | 'to'>('from');
  const [customTokenInput, setCustomTokenInput] = useState('');
  const [customTokenSymbol, setCustomTokenSymbol] = useState('');
  const [customTokenName, setCustomTokenName] = useState('');

  // Updated chains to match active networks - same as IndirectSwapPage
  const chains = [
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', icon: '₳', addressPrefix: 'addr1', tokenFormat: 'Policy ID' },
    { id: 'bnb', name: 'BNB Chain', symbol: 'BNB', icon: '💛', addressPrefix: '0x', tokenFormat: 'Contract Address' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', icon: '◎', addressPrefix: '', tokenFormat: 'Token Address' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', icon: '⬟', addressPrefix: '0x', tokenFormat: 'Contract Address' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: '⟠', addressPrefix: '0x', tokenFormat: 'Contract Address' },
    { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', icon: '🔵', addressPrefix: '0x', tokenFormat: 'Contract Address' },
    { id: 'optimism', name: 'Optimism', symbol: 'OP', icon: '🔴', addressPrefix: '0x', tokenFormat: 'Contract Address' },
    { id: 'fantom', name: 'Fantom', symbol: 'FTM', icon: '👻', addressPrefix: '0x', tokenFormat: 'Contract Address' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', icon: '🟣', addressPrefix: '1', tokenFormat: 'Asset ID' },
    { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', icon: '🏔️', addressPrefix: '0x', tokenFormat: 'Contract Address' },
  ];

  // Helper function to get chain icon or network logo
  const getChainIcon = (chainId: string) => {
    const networkData = getNetworkById(chainId);
    if (networkData?.logoUrl) {
      return <NetworkIcon network={networkData} size="sm" />;
    }
    const chainData = getChainData(chainId);
    return <span className="text-lg">{chainData?.icon}</span>;
  };

  // Updated tokens to match IndirectSwapPage structure
  const tokens = {
    cardano: ['ADA', 'USDC', 'USDT', 'Other'],
    bnb: ['BNB', 'USDC', 'USDT', 'BUSD', 'Other'],
    solana: ['SOL', 'USDC', 'USDT', 'RAY', 'Other'],
    polygon: ['MATIC', 'USDC', 'USDT', 'WETH', 'Other'],
    ethereum: ['ETH', 'USDC', 'USDT', 'WBTC', 'Other'],
    arbitrum: ['ARB', 'ETH', 'USDC', 'USDT', 'Other'],
    optimism: ['OP', 'ETH', 'USDC', 'USDT', 'Other'],
    fantom: ['FTM', 'USDC', 'USDT', 'BOO', 'Other'],
    polkadot: ['DOT', 'USDC', 'USDT', 'Other'],
    avalanche: ['AVAX', 'USDC', 'USDT', 'WAVAX', 'Other'],
  };

  // Same customTokens structure as IndirectSwapPage
  const [customTokens, setCustomTokens] = useState({
    from: null,
    to: null
  });

  const routers = [
    {
      name: 'Best Price',
      logo: '🏆',
      price: '2,345.67 USDC',
      gasFeeDollars: '$12.34',
      gasFeeGwei: '45 gwei',
      liquidityScore: 'A+',
      scoreColor: 'text-success-green',
      estimatedTime: '~3 min',
      route: 'Direct',
    },
    {
      name: 'Fastest',
      logo: '⚡',
      price: '2,342.15 USDC',
      gasFeeDollars: '$15.67',
      gasFeeGwei: '52 gwei',
      liquidityScore: 'A',
      scoreColor: 'text-success-green',
      estimatedTime: '~1 min',
      route: 'Optimized Route',
    },
    {
      name: 'Lowest Gas',
      logo: '⛽',
      price: '2,340.23 USDC',
      gasFeeDollars: '$8.90',
      gasFeeGwei: '32 gwei',
      liquidityScore: 'B+',
      scoreColor: 'text-warning-orange',
      estimatedTime: '~5 min',
      route: 'Multi-hop',
    },
  ];

  useEffect(() => {
    // Pre-fill addresses if wallet is connected
    if (isConnected && address) {
      setOriginAddress(address);
      setDestinationAddress(address);
    }
  }, [isConnected, address]);

  const getChainData = (chainId: string) => {
    return chains.find(chain => chain.id === chainId);
  };

  const getTokensForChain = (chainId: string) => {
    return tokens[chainId] || [];
  };

  const handleCustomTokenSubmit = () => {
    if (!customTokenInput.trim() || !customTokenSymbol.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const customToken = {
      symbol: customTokenSymbol.toUpperCase(),
      name: customTokenName || customTokenSymbol,
      address: customTokenInput,
      isCustom: true
    };

    setCustomTokens(prev => ({
      ...prev,
      [tokenInputType]: customToken
    }));

    if (tokenInputType === 'from') {
      setFromToken(customToken.symbol);
    } else {
      setToToken(customToken.symbol);
    }

    setCustomTokenModalOpen(false);
    setCustomTokenInput('');
    setCustomTokenSymbol('');
    setCustomTokenName('');
    toast.success(`Custom token ${customToken.symbol} added successfully`);
  };

  const openCustomTokenModal = (type: 'from' | 'to') => {
    setTokenInputType(type);
    setCustomTokenModalOpen(true);
  };

  const handleTokenChange = (value: string, type: 'from' | 'to') => {
    if (value === 'Other') {
      openCustomTokenModal(type);
    } else {
      if (type === 'from') {
        setFromToken(value);
        setCustomTokens(prev => ({ ...prev, from: null }));
      } else {
        setToToken(value);
        setCustomTokens(prev => ({ ...prev, to: null }));
      }
    }
  };

  const getSelectedChain = (chainId: string) => {
    return chains.find(chain => chain.id === chainId);
  };

  const getTokenDisplayName = (token: string, type: 'from' | 'to') => {
    const customToken = customTokens[type];
    if (customToken && token === customToken.symbol) {
      return `${customToken.symbol} (Custom)`;
    }
    return token;
  };

  // Mock token pricing data
  const getTokenPrice = (tokenSymbol: string) => {
    const tokenPrices = {
      'ETH': 2400, 'BTC': 43000, 'WBTC': 43000, 'BNB': 310, 'SOL': 98, 'ADA': 0.45, 'MATIC': 0.85,
      'DOT': 6.5, 'AVAX': 28, 'FTM': 0.32, 'OP': 1.85, 'ARB': 1.1, 'USDC': 1, 'USDT': 1,
      'DAI': 1, 'BUSD': 1, 'UNI': 6.2, 'LINK': 14.5, 'AAVE': 95, 'CAKE': 2.1, 'XVS': 8.7,
      'SRM': 0.31, 'RAY': 0.18, 'ORCA': 0.85, 'WETH': 2400, 'GMX': 45, 'MAGIC': 1.2,
      'SNX': 2.8, 'VELO': 0.15, 'BOO': 2.3, 'SPIRIT': 0.008, 'LQDR': 12.5, 'KSM': 32,
      'GLMR': 0.25, 'MOVR': 6.8, 'PARA': 0.12, 'PNG': 0.18, 'JOE': 0.35, 'TIME': 8.9,
      'DJED': 1.0, 'SHEN': 0.45, 'MIN': 0.023, 'BSW': 0.075, 'WAVAX': 28
    };
    return tokenPrices[tokenSymbol] || 1; // Default to $1 for unknown tokens
  };

  const calculatePriceImpact = (amount: string) => {
    const numAmount = parseFloat(amount);
    if (numAmount > 1000) return 3.2;
    if (numAmount > 500) return 1.8;
    if (numAmount > 100) return 0.8;
    return 0.3;
  };

  const updateToAmount = (amount: string) => {
    if (!amount || isNaN(parseFloat(amount))) {
      setToAmount('');
      return;
    }
    
    const fromTokenPrice = getTokenPrice(fromToken);
    const toTokenPrice = getTokenPrice(toToken);
    
    if (fromTokenPrice && toTokenPrice) {
      // Calculate exchange rate accounting for fees (0.01% platform fee + ~0.3% bridge fee)
      const exchangeRate = fromTokenPrice / toTokenPrice;
      const feeMultiplier = 0.9969; // 0.31% total fees
      const result = (parseFloat(amount) * exchangeRate * feeMultiplier);
      
      // Format based on token value to show appropriate decimal places
      let formattedResult;
      if (result > 1000) {
        formattedResult = result.toFixed(2);
      } else if (result > 1) {
        formattedResult = result.toFixed(4);
      } else {
        formattedResult = result.toFixed(6);
      }
      
      setToAmount(formattedResult);
      setPriceImpact(calculatePriceImpact(amount));
    }
  };

  // Update calculations when tokens or chains change
  useEffect(() => {
    if (fromAmount && fromAmount !== '' && !isNaN(parseFloat(fromAmount))) {
      updateToAmount(fromAmount);
    } else {
      setToAmount('');
    }
  }, [fromChain, toChain, fromToken, toToken, fromAmount]);

  const handleFromAmountChange = (value: string) => {
    // Allow empty string or valid number inputs
    if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
      setFromAmount(value);
      updateToAmount(value);
    }
  };

  const swapChains = () => {
    const tempChain = fromChain;
    const tempToken = fromToken;
    const tempAddress = originAddress;
    
    setFromChain(toChain);
    setToChain(tempChain);
    setFromToken(toToken);
    setToToken(tempToken);
    setOriginAddress(destinationAddress);
    setDestinationAddress(tempAddress);
    
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    updateToAmount(toAmount);
  };

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!isConnected) {
      toast.error('Please connect your wallet to perform swaps');
      return;
    }

    setIsLoading(true);
    
    // Simulate swap process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a mock transaction hash
    const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66);
    
    // Calculate USD value for the transaction
    const fromTokenPrice = getTokenPrice(fromToken);
    const estimatedValue = fromAmount ? 
      `${(parseFloat(fromAmount) * fromTokenPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : 
      '$0.00';
    
    // Add transaction to temporary history
    const transactionData = {
      fromChain: getChainData(fromChain)?.name || fromChain,
      fromToken: fromToken,
      fromAmount: fromAmount,
      toChain: getChainData(toChain)?.name || toChain,
      toToken: toToken,
      toAmount: toAmount,
      txHash: mockTxHash,
      value: estimatedValue
    };
    
    addTransaction(transactionData);
    
    toast.success(`Successfully swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`, {
      description: `Transaction added to history. View in Transaction History page.`,
      action: {
        label: 'View History',
        onClick: () => {
          // This would navigate to history page
          window.location.hash = '#history';
        }
      }
    });
    
    setIsLoading(false);
    
    // Reset form
    setFromAmount('');
    setToAmount('');
  };

  const getPriceImpactColor = (impact: number) => {
    if (impact < 1) return 'price-impact-green';
    if (impact < 3) return 'price-impact-orange';
    return 'price-impact-red';
  };

  const getPriceImpactIcon = (impact: number) => {
    if (impact < 1) return <TrendingUp className="w-4 h-4" />;
    if (impact < 3) return <AlertTriangle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const getUSDValue = (amount: string, chainId: string, tokenSymbol: string) => {
    if (!amount || isNaN(parseFloat(amount))) return '';
    
    const tokenPrice = getTokenPrice(tokenSymbol);
    const value = parseFloat(amount) * tokenPrice;
    
    return `≈ ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 gradient-text">Direct Swap</h1>
        <p className="text-muted-foreground">
          Instant cross-chain swaps with wallet connection
        </p>
      </div>

      {/* Main Swap Card */}
      <Card className="card-glass border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Swap Configuration</CardTitle>
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <Switch 
                checked={advancedMode} 
                onCheckedChange={setAdvancedMode}
              />
              <span className="text-sm">Advanced</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* From Section */}
          <div className="space-y-4">
            <Label>From</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Network</Label>
                <Select value={fromChain} onValueChange={(value) => {
                  setFromChain(value);
                  // Reset token when chain changes
                  const availableTokens = getTokensForChain(value);
                  if (availableTokens.length > 0) {
                    setFromToken(availableTokens[0]);
                  }
                }}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue>
                      <div className="flex items-center space-x-2">
                        {getChainIcon(fromChain)}
                        <span>{getChainData(fromChain)?.name}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-glass border-white/10">
                    {chains.map(chain => (
                      <SelectItem key={chain.id} value={chain.id}>
                        <div className="flex items-center space-x-2">
                          {getChainIcon(chain.id)}
                          <span>{chain.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Token</Label>
                <Select value={fromToken} onValueChange={(value) => handleTokenChange(value, 'from')}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🪙</span>
                        <span>{getTokenDisplayName(fromToken, 'from')}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-glass border-white/10">
                    {getTokensForChain(fromChain).map(token => (
                      <SelectItem key={token} value={token}>
                        {token === 'Other' ? (
                          <div className="flex items-center space-x-2">
                            <Plus className="w-4 h-4" />
                            <span>Add Custom Token</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">🪙</span>
                            <span>{getTokenDisplayName(token, 'from')}</span>
                          </div>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Origin Address</Label>
              <div className="relative">
                <Input
                  placeholder={`0x00000000000000000000000000cc4facbd93bc28`}
                  value={originAddress}
                  onChange={(e) => setOriginAddress(e.target.value)}
                  className="bg-white/5 border-white/10 focus:border-primary font-mono text-sm pr-10"
                />
                {originAddress && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => window.open(`#`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Your {getChainData(fromChain)?.name} wallet address where funds will be sent from
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Amount</Label>
              <Input
                type="number"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                className="text-lg bg-white/5 border-white/10 focus:border-primary"
              />
              {fromAmount && (
                <div className="text-sm text-muted-foreground">
                  {getUSDValue(fromAmount, fromChain, fromToken)}
                </div>
              )}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              onClick={swapChains}
              variant="outline"
              size="sm"
              className="rounded-full border-white/20 hover:bg-white/10 hover:border-primary"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          {/* To Section */}
          <div className="space-y-4">
            <Label>To</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Network</Label>
                <Select value={toChain} onValueChange={(value) => {
                  setToChain(value);
                  // Reset token when chain changes
                  const availableTokens = getTokensForChain(value);
                  if (availableTokens.length > 0) {
                    setToToken(availableTokens[0]);
                  }
                }}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue>
                      <div className="flex items-center space-x-2">
                        {getChainIcon(toChain)}
                        <span>{getChainData(toChain)?.name}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-glass border-white/10">
                    {chains.filter(chain => chain.id !== fromChain).map(chain => (
                      <SelectItem key={chain.id} value={chain.id}>
                        <div className="flex items-center space-x-2">
                          {getChainIcon(chain.id)}
                          <span>{chain.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Token</Label>
                <Select value={toToken} onValueChange={(value) => handleTokenChange(value, 'to')}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🪙</span>
                        <span>{getTokenDisplayName(toToken, 'to')}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-glass border-white/10">
                    {getTokensForChain(toChain).map(token => (
                      <SelectItem key={token} value={token}>
                        {token === 'Other' ? (
                          <div className="flex items-center space-x-2">
                            <Plus className="w-4 h-4" />
                            <span>Add Custom Token</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">🪙</span>
                            <span>{getTokenDisplayName(token, 'to')}</span>
                          </div>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Destination Address</Label>
              <Input
                placeholder={`Enter ${getChainData(toChain)?.name} address where you want to receive tokens`}
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                className="bg-white/5 border-white/10 focus:border-primary font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Your {getChainData(toChain)?.name} wallet address where you want to receive the swapped tokens
              </p>
            </div>

            {toAmount && (
              <div className="space-y-2">
                <Label className="text-sm">You will receive</Label>
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="text-lg font-semibold text-primary">{toAmount} {toToken}</div>
                  <div className="text-sm text-muted-foreground">
                    {getUSDValue(toAmount, toChain, toToken)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Platform fee: 0.01% • Bridge fee: ~0.3%
                  </div>
                </div>
              </div>
            )}
          </div>

          {advancedMode && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs">Slippage Tolerance</Label>
                    <Select value={slippage} onValueChange={setSlippage}>
                      <SelectTrigger className="h-8 bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">0.5%</SelectItem>
                        <SelectItem value="1.0">1.0%</SelectItem>
                        <SelectItem value="2.0">2.0%</SelectItem>
                        <SelectItem value="5.0">5.0%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Max Gas Fee</Label>
                    <Input value="Auto" readOnly className="h-8 bg-white/5 border-white/10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Router Selection */}
      {fromAmount && toAmount && (
        <Card className="card-glass border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Label className="font-medium">Route Selection</Label>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {routers.map((router, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedRouter(index)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    selectedRouter === index
                      ? 'border-primary bg-primary/5 glow-effect'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{router.logo}</span>
                        <div>
                          <div className="font-medium text-sm">{router.name}</div>
                          <div className="text-xs text-muted-foreground">{router.route}</div>
                        </div>
                      </div>
                      {selectedRouter === index && (
                        <div className="ml-2">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">{toAmount} {toToken}</div>
                      <div className="text-xs text-muted-foreground">{router.gasFeeDollars}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <div className="flex items-center space-x-4">
                      <span className="text-muted-foreground">Gas: {router.gasFeeGwei}</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-muted-foreground">Score:</span>
                        <Badge variant="outline" className={`text-xs ${router.scoreColor} border-current`}>
                          {router.liquidityScore}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{router.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extra Info */}
      {fromAmount && toAmount && (
        <Card className="card-glass border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Price Impact:</span>
                <div className={`flex items-center space-x-1 ${getPriceImpactColor(priceImpact)}`}>
                  {getPriceImpactIcon(priceImpact)}
                  <span className="font-medium">{priceImpact.toFixed(2)}%</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Platform Fee: 0.01%
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warning for non-connected wallet */}
      {!isConnected && fromAmount && toAmount && (
        <Alert className="border-warning-orange/20 bg-warning-orange/10">
          <Wallet className="h-4 w-4" />
          <AlertDescription className="text-warning-orange">
            <strong>Wallet Connection Required:</strong> You need to connect your wallet to execute direct swaps.
          </AlertDescription>
        </Alert>
      )}

      {/* Swap Button */}
      <Button 
        onClick={handleSwap}
        disabled={!fromAmount || !toAmount || isLoading}
        className="w-full h-14 text-lg font-medium bg-gradient-primary hover-glow border-0 text-white"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Processing Swap...</span>
          </div>
        ) : !isConnected ? (
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span>Connect Wallet to Swap</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Execute Direct Swap</span>
          </div>
        )}
      </Button>

      {/* Info Banner */}
      <Card className="card-glass border-white/10">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              🔗 <strong>Direct Swap Technology:</strong> Instant execution with wallet connection
            </p>
            <p className="text-xs text-muted-foreground">
              Powered by advanced routing algorithms for optimal rates and speed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Custom Token Modal */}
      <Dialog open={customTokenModalOpen} onOpenChange={setCustomTokenModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Custom Token</DialogTitle>
            <DialogDescription>
              Add a custom token for {getSelectedChain(tokenInputType === 'from' ? fromChain : toChain)?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm">
                {getSelectedChain(tokenInputType === 'from' ? fromChain : toChain)?.tokenFormat} *
              </Label>
              <Textarea
                placeholder={
                  tokenInputType === 'from' && fromChain === 'cardano' 
                    ? 'Enter Cardano policy ID (e.g., d436...c7fd)'
                    : 'Enter contract address (e.g., 0x1234...abcd)'
                }
                value={customTokenInput}
                onChange={(e) => setCustomTokenInput(e.target.value)}
                className="min-h-[80px] font-mono text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm">Token Symbol *</Label>
                <Input
                  placeholder="e.g., USDC"
                  value={customTokenSymbol}
                  onChange={(e) => setCustomTokenSymbol(e.target.value.toUpperCase())}
                  maxLength={10}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Token Name</Label>
                <Input
                  placeholder="e.g., USD Coin"
                  value={customTokenName}
                  onChange={(e) => setCustomTokenName(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg">
              <AlertCircle className="w-4 h-4 mt-0.5 text-amber-500" />
              <div className="text-sm">
                <p className="font-medium">Important:</p>
                <p className="text-muted-foreground">
                  Make sure the {getSelectedChain(tokenInputType === 'from' ? fromChain : toChain)?.tokenFormat.toLowerCase()} is correct. 
                  Incorrect addresses may result in lost funds.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCustomTokenModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCustomTokenSubmit}
                disabled={!customTokenInput.trim() || !customTokenSymbol.trim()}
                className="flex-1"
              >
                Add Token
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}