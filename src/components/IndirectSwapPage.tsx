import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { useNavigation, useWallet, useTransactionHistory } from '../App';
import { ArrowUpDown, Clock, Copy, Settings, RefreshCw, Wallet, Plus, ExternalLink, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getNetworkById, NetworkIcon } from './BlockchainData';

export function IndirectSwapPage() {
  const { setCurrentPage, setSwapData } = useNavigation();
  const { isConnected, address } = useWallet();
  const { addTransaction } = useTransactionHistory();
  const [fromChain, setFromChain] = useState('cardano');
  const [toChain, setToChain] = useState('ethereum');
  const [fromToken, setFromToken] = useState('ADA');
  const [toToken, setToToken] = useState('ETH');
  const [amount, setAmount] = useState('');
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [advancedMode, setAdvancedMode] = useState(false);
  const [customTokenModalOpen, setCustomTokenModalOpen] = useState(false);
  const [tokenInputType, setTokenInputType] = useState<'from' | 'to'>('from');
  const [customTokenInput, setCustomTokenInput] = useState('');
  const [customTokenSymbol, setCustomTokenSymbol] = useState('');
  const [customTokenName, setCustomTokenName] = useState('');

  // Updated chains to match active networks
  const chains = [
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', addressPrefix: 'addr1', tokenFormat: 'Policy ID' },
    { id: 'bnb', name: 'BNB Chain', symbol: 'BNB', addressPrefix: '0x', tokenFormat: 'Contract Address' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', addressPrefix: '', tokenFormat: 'Token Address' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', addressPrefix: '0x', tokenFormat: 'Contract Address' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', addressPrefix: '0x', tokenFormat: 'Contract Address' },
    { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', addressPrefix: '0x', tokenFormat: 'Contract Address' },
    { id: 'optimism', name: 'Optimism', symbol: 'OP', addressPrefix: '0x', tokenFormat: 'Contract Address' },
    { id: 'fantom', name: 'Fantom', symbol: 'FTM', addressPrefix: '0x', tokenFormat: 'Contract Address' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', addressPrefix: '1', tokenFormat: 'Asset ID' },
    { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', addressPrefix: '0x', tokenFormat: 'Contract Address' },
  ];

  // Helper function to get chain icon with network logo support
  const getChainIcon = (chainId: string) => {
    const networkData = getNetworkById(chainId);
    if (networkData?.logoUrl) {
      return <NetworkIcon network={networkData} size="sm" />;
    }
    // Fallback to text-based icons for other chains
    const chainSymbols = {
      'solana': '◎',
      'polygon': '⬟', 
      'arbitrum': '🔵',
      'optimism': '🔴',
      'fantom': '👻',
      'polkadot': '🟣'
    };
    return <span className="text-lg">{chainSymbols[chainId] || '🪙'}</span>;
  };

  const tokens = {
    cardano: ['ADA', 'MINS', 'USDT', 'Other'],
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

  const [customTokens, setCustomTokens] = useState({
    from: null,
    to: null
  });

  useEffect(() => {
    let interval;
    if (quote && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quote, timeLeft]);

  useEffect(() => {
    // Pre-fill origin address if wallet is connected
    if (isConnected && address) {
      setOriginAddress(address);
    }
  }, [isConnected, address]);

  const swapChains = () => {
    const tempChain = fromChain;
    const tempToken = fromToken;
    const tempAddress = originAddress;
    const tempCustomToken = customTokens.from;
    
    setFromChain(toChain);
    setToChain(tempChain);
    setFromToken(toToken);
    setToToken(tempToken);
    setOriginAddress(destinationAddress);
    setDestinationAddress(tempAddress);
    setCustomTokens({
      from: customTokens.to,
      to: tempCustomToken
    });
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

  const generateMockAddress = (chainId: string) => {
    const chain = getSelectedChain(chainId);
    if (!chain) return '';

    switch (chainId) {
      case 'cardano':
        return 'addr1qxy677pvx4h4jh6xylj0jv23x5n5ywj6t8ql6zz4q5x9qr5rn0d6n7yr9h';
      case 'solana':
        return 'So11111111111111111111111111111111111111112';
      case 'polkadot':
        return '1FRMM8PEiWXYax7rpS6X4XZX1aAAxSWx1CrKTyrVYhV24fg';
      default:
        return '0x' + Math.random().toString(16).substr(2, 40);
    }
  };

  const generateQuote = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!originAddress.trim()) {
      toast.error('Please enter origin address');
      return;
    }

    if (!destinationAddress.trim()) {
      toast.error('Please enter destination address');
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const platformFeeRate = 0.0001; // 0.01% platform fee
    const baseAmount = parseFloat(amount);
    const platformFee = baseAmount * platformFeeRate;
    const amountAfterFee = baseAmount - platformFee;
    const expectedAmount = (amountAfterFee * 0.95 * Math.random() + amountAfterFee * 0.9);
    
    const mockQuote = {
      id: 'BSW_' + Math.random().toString(36).substr(2, 9),
      fromAmount: amount,
      fromToken: customTokens.from ? customTokens.from.symbol : fromToken,
      fromChain,
      toToken: customTokens.to ? customTokens.to.symbol : toToken,
      toChain,
      expectedAmount: expectedAmount.toFixed(6),
      rate: `1 ${customTokens.from ? customTokens.from.symbol : fromToken} = ${(expectedAmount / baseAmount).toFixed(6)} ${customTokens.to ? customTokens.to.symbol : toToken}`,
      depositAddress: generateMockAddress(fromChain),
      memo: 'BSW_' + Math.random().toString(36).substr(2, 6),
      originAddress,
      destinationAddress,
      fee: '0.3%',
      platformFee: '0.01%',
      platformFeeAmount: platformFee.toFixed(6),
      estimatedTime: '3-5 minutes',
      customTokens
    };

    // Calculate USD value for the transaction
    const estimatedValue = baseAmount ? 
      `${(baseAmount * 2000).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : 
      '$0.00';
    
    // Add transaction to temporary history
    const transactionData = {
      fromChain: getSelectedChain(fromChain)?.name || fromChain,
      fromToken: customTokens.from ? customTokens.from.symbol : fromToken,
      fromAmount: amount,
      toChain: getSelectedChain(toChain)?.name || toChain,
      toToken: customTokens.to ? customTokens.to.symbol : toToken,
      toAmount: expectedAmount.toFixed(6),
      txHash: '0x' + Math.random().toString(16).substring(2, 66),
      value: estimatedValue
    };
    
    addTransaction(transactionData);

    setQuote(mockQuote);
    setTimeLeft(600);
    setLoading(false);
    
    toast.success('Quote generated successfully!', {
      description: 'Transaction added to history. Proceed to deposit to complete the swap.',
    });
  };

  const copyDepositInfo = () => {
    const info = `Address: ${quote.depositAddress}\nMemo: ${quote.memo}\nAmount: ${quote.fromAmount} ${quote.fromToken}`;
    navigator.clipboard.writeText(info);
    toast.success('Deposit information copied to clipboard');
  };

  const proceedToDeposit = () => {
    setSwapData(quote);
    setCurrentPage('deposit');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTokenDisplayName = (token: string, type: 'from' | 'to') => {
    const customToken = customTokens[type];
    if (customToken && token === customToken.symbol) {
      return `${customToken.symbol} (Custom)`;
    }
    return token;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Create Swap Quote</h1>
        <p className="text-muted-foreground">
          Enter swap details to get a real-time quote with deposit instructions
        </p>
        {!isConnected && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Wallet className="w-4 h-4" />
              <span className="text-sm">Connect your wallet to auto-fill addresses</span>
            </div>
          </div>
        )}
      </div>

      <Card>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Network</Label>
                <Select value={fromChain} onValueChange={setFromChain}>
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center space-x-2">
                        {getChainIcon(fromChain)}
                        <span>{getSelectedChain(fromChain)?.name}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {chains.map(chain => (
                      <SelectItem key={chain.id} value={chain.id}>
                        <div className="flex items-center space-x-2">
                          {getChainIcon(chain.id)}
                          <span>{chain.name} ({chain.symbol})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Token</Label>
                <Select value={fromToken} onValueChange={(value) => handleTokenChange(value, 'from')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens[fromChain]?.map(token => (
                      <SelectItem key={token} value={token}>
                        {token === 'Other' ? (
                          <div className="flex items-center space-x-2">
                            <Plus className="w-4 h-4" />
                            <span>Add Custom Token</span>
                          </div>
                        ) : (
                          getTokenDisplayName(token, 'from')
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
                  placeholder={`Enter ${getSelectedChain(fromChain)?.name} address`}
                  value={originAddress}
                  onChange={(e) => setOriginAddress(e.target.value)}
                  className="pr-10"
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
                Your {getSelectedChain(fromChain)?.name} wallet address where funds will be sent from
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Amount</Label>
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
              />
            </div>
          </div>

          {/* Estimated Receive Display */}
          {amount && parseFloat(amount) > 0 && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-4 pb-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Estimated Receive</Label>
                  <div className="text-lg font-semibold text-primary">
                    {(() => {
                      const platformFeeRate = 0.0001; // 0.01%
                      const baseAmount = parseFloat(amount);
                      const platformFee = baseAmount * platformFeeRate;
                      const amountAfterFee = baseAmount - platformFee;
                      const estimatedAmount = amountAfterFee * 0.925; // Rough estimate
                      return `${estimatedAmount.toFixed(6)} ${customTokens.to ? customTokens.to.symbol : toToken}`;
                    })()}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span>Platform Fee (0.01%): </span>
                      <span>{(parseFloat(amount) * 0.0001).toFixed(6)} {customTokens.from ? customTokens.from.symbol : fromToken}</span>
                    </div>
                    <div>
                      <span>Bridge Fee: ~0.3%</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    * Final amount may vary based on market conditions and slippage
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button variant="outline" size="sm" onClick={swapChains}>
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          {/* To Section */}
          <div className="space-y-4">
            <Label>To</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Network</Label>
                <Select value={toChain} onValueChange={setToChain}>
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center space-x-2">
                        {getChainIcon(toChain)}
                        <span>{getSelectedChain(toChain)?.name}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {chains.map(chain => (
                      <SelectItem key={chain.id} value={chain.id}>
                        <div className="flex items-center space-x-2">
                          {getChainIcon(chain.id)}
                          <span>{chain.name} ({chain.symbol})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Token</Label>
                <Select value={toToken} onValueChange={(value) => handleTokenChange(value, 'to')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens[toChain]?.map(token => (
                      <SelectItem key={token} value={token}>
                        {token === 'Other' ? (
                          <div className="flex items-center space-x-2">
                            <Plus className="w-4 h-4" />
                            <span>Add Custom Token</span>
                          </div>
                        ) : (
                          getTokenDisplayName(token, 'to')
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
                placeholder={`Enter ${getSelectedChain(toChain)?.name} address where you want to receive tokens`}
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your {getSelectedChain(toChain)?.name} wallet address where you want to receive the swapped tokens
              </p>
            </div>
          </div>

          {advancedMode && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs">Slippage Tolerance</Label>
                    <Input value="1%" readOnly />
                  </div>
                  <div>
                    <Label className="text-xs">Max Gas Fee</Label>
                    <Input value="Auto" readOnly />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button 
            onClick={generateQuote} 
            disabled={loading || !amount || !originAddress || !destinationAddress} 
            className="w-full"
            size="lg"
          >
            {loading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
            Get Quote
          </Button>
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

      {/* Quote Result */}
      {quote && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Swap Quote</CardTitle>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <Badge variant={timeLeft < 60 ? 'destructive' : 'default'}>
                  {formatTime(timeLeft)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">Quote ID</Label>
                <p className="font-mono">{quote.id}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Exchange Rate</Label>
                <p>{quote.rate}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">You Send</Label>
                <p className="font-semibold">{quote.fromAmount} {quote.fromToken}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">You Receive (Est.)</Label>
                <p className="font-semibold text-green-600">{quote.expectedAmount} {quote.toToken}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Platform Fee</Label>
                <p>{quote.fee}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Estimated Time</Label>
                <p>{quote.estimatedTime}</p>
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <Label className="text-sm font-semibold">Addresses</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                  <Label className="text-xs text-muted-foreground">Origin Address</Label>
                  <p className="font-mono text-sm break-all">{quote.originAddress}</p>
                </div>
                <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                  <Label className="text-xs text-muted-foreground">Destination Address</Label>
                  <p className="font-mono text-sm break-all">{quote.destinationAddress}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <Label className="text-sm font-semibold">Deposit Instructions</Label>
              <div className="mt-2 space-y-2 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">Deposit Address</Label>
                  <p className="font-mono text-sm break-all">{quote.depositAddress}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Memo/Note</Label>
                  <p className="font-mono text-sm">{quote.memo}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={copyDepositInfo} variant="outline" className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy Deposit Info
              </Button>
              <Button onClick={proceedToDeposit} className="flex-1">
                Continue to Deposit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}