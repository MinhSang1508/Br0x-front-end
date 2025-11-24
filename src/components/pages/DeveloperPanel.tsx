import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useNavigation } from '../App';
import { Copy, Download, ExternalLink, Code, Database, Network } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function DeveloperPanel() {
  const { swapData } = useNavigation();
  const [activeTab, setActiveTab] = useState('overview');

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const exportData = () => {
    const exportData = {
      swapData,
      transactionTrace: mockTransactionTrace,
      wanchainMessage: mockWanchainMessage,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swap-${swapData?.id || 'export'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Swap data exported successfully');
  };

  // Mock data for developer panel
  const mockTransactionTrace = {
    sourceChain: {
      network: 'cardano-mainnet',
      txHash: '0x' + Math.random().toString(16).substr(2, 64),
      blockHeight: 8234567,
      confirmations: 12,
      gasUsed: '0',
      fee: '0.17 ADA'
    },
    wanchainBridge: {
      messageId: 'WC_' + Math.random().toString(36).substr(2, 12),
      sourceValidator: '0x' + Math.random().toString(16).substr(2, 40),
      destinationValidator: '0x' + Math.random().toString(16).substr(2, 40),
      crossChainFee: '0.001 ETH',
      processingTime: '45 seconds'
    },
    destinationChain: {
      network: 'ethereum-mainnet',
      txHash: '0x' + Math.random().toString(16).substr(2, 64),
      blockHeight: 18234567,
      confirmations: 24,
      gasUsed: '180,000',
      gasPrice: '25 gwei'
    }
  };

  const mockWanchainMessage = {
    version: '1.0',
    messageType: 'CROSS_CHAIN_SWAP',
    sourceChain: 'cardano',
    destinationChain: 'ethereum',
    payload: {
      sourceAmount: '100.0',
      sourceToken: 'ADA',
      destinationToken: 'ETH',
      destinationAddress: '0xabcd1234...',
      swapParams: {
        slippage: '1.0',
        deadline: 1643723400,
        routerAddress: '0x1234abcd...'
      }
    },
    signatures: [
      {
        validator: '0x' + Math.random().toString(16).substr(2, 40),
        signature: '0x' + Math.random().toString(16).substr(2, 130)
      }
    ]
  };

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api/v1/quote/:quoteId',
      description: 'Get quote details and status',
      example: `curl -X GET "https://api.bridgeswap.io/v1/quote/${swapData?.id || 'BSW_example123'}"`
    },
    {
      method: 'POST',
      endpoint: '/api/v1/quote',
      description: 'Create new swap quote',
      example: `curl -X POST "https://api.bridgeswap.io/v1/quote" \\
  -H "Content-Type: application/json" \\
  -d '{"fromChain":"cardano","toChain":"ethereum","fromToken":"ADA","toToken":"ETH","amount":"100"}'`
    },
    {
      method: 'GET',
      endpoint: '/api/v1/status/:quoteId',
      description: 'Get real-time swap status',
      example: `curl -X GET "https://api.bridgeswap.io/v1/status/${swapData?.id || 'BSW_example123'}"`
    }
  ];

  const networkConfig = {
    cardano: {
      networkId: 'mainnet',
      rpcEndpoint: 'https://cardano-mainnet.blockfrost.io/api/v0',
      explorerUrl: 'https://cardanoscan.io',
      wanchainValidatorSet: '0x' + Math.random().toString(16).substr(2, 40),
      supportedTokens: ['ADA', 'USDC', 'USDT']
    },
    ethereum: {
      networkId: '1',
      rpcEndpoint: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
      explorerUrl: 'https://etherscan.io',
      wanchainValidatorSet: '0x' + Math.random().toString(16).substr(2, 40),
      supportedTokens: ['ETH', 'USDC', 'USDT', 'WBTC']
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Developer Panel</h1>
        <p className="text-muted-foreground">
          Advanced tools and technical details for developers and power users
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trace">Transaction Trace</TabsTrigger>
          <TabsTrigger value="wanchain">Wanchain Bridge</TabsTrigger>
          <TabsTrigger value="api">API & SDK</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Swap Details */}
            {swapData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="w-5 h-5" />
                    <span>Current Swap</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <pre className="text-xs">
                      {JSON.stringify(swapData, null, 2)}
                    </pre>
                  </ScrollArea>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(JSON.stringify(swapData, null, 2), 'Swap data')}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={exportData}>
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Network Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Network className="w-5 h-5" />
                  <span>Network Config</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <pre className="text-xs">
                    {JSON.stringify(networkConfig, null, 2)}
                  </pre>
                </ScrollArea>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => copyToClipboard(JSON.stringify(networkConfig, null, 2), 'Network config')}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Config
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold">6</div>
                <div className="text-sm text-muted-foreground">Supported Chains</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm text-muted-foreground">Supported Tokens</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-muted-foreground">Bridge Uptime</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold">3.2s</div>
                <div className="text-sm text-muted-foreground">Avg Quote Time</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trace" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Full Transaction Trace</CardTitle>
              <p className="text-sm text-muted-foreground">
                Complete trace of your cross-chain transaction across all networks
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Source Chain */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center space-x-2">
                      <Badge variant="outline">Source</Badge>
                      <span>Cardano Network</span>
                    </h3>
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-muted-foreground">Transaction Hash</label>
                      <p className="font-mono">{mockTransactionTrace.sourceChain.txHash}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Block Height</label>
                      <p>{mockTransactionTrace.sourceChain.blockHeight.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Confirmations</label>
                      <p>{mockTransactionTrace.sourceChain.confirmations}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Network Fee</label>
                      <p>{mockTransactionTrace.sourceChain.fee}</p>
                    </div>
                  </div>
                </div>

                {/* Wanchain Bridge */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center space-x-2">
                      <Badge variant="outline">Bridge</Badge>
                      <span>Wanchain Infrastructure</span>
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-muted-foreground">Message ID</label>
                      <p className="font-mono">{mockTransactionTrace.wanchainBridge.messageId}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Processing Time</label>
                      <p>{mockTransactionTrace.wanchainBridge.processingTime}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Source Validator</label>
                      <p className="font-mono text-xs">{mockTransactionTrace.wanchainBridge.sourceValidator}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Cross-Chain Fee</label>
                      <p>{mockTransactionTrace.wanchainBridge.crossChainFee}</p>
                    </div>
                  </div>
                </div>

                {/* Destination Chain */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center space-x-2">
                      <Badge variant="outline">Destination</Badge>
                      <span>Ethereum Network</span>
                    </h3>
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-muted-foreground">Transaction Hash</label>
                      <p className="font-mono">{mockTransactionTrace.destinationChain.txHash}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Block Height</label>
                      <p>{mockTransactionTrace.destinationChain.blockHeight.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Gas Used</label>
                      <p>{mockTransactionTrace.destinationChain.gasUsed}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Gas Price</label>
                      <p>{mockTransactionTrace.destinationChain.gasPrice}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => copyToClipboard(JSON.stringify(mockTransactionTrace, null, 2), 'Transaction trace')}
                className="mt-4"
                variant="outline"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Full Trace
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wanchain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wanchain Bridge Message</CardTitle>
              <p className="text-sm text-muted-foreground">
                Raw cross-chain message payload and validator signatures
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 mb-4">
                <pre className="text-xs bg-muted p-4 rounded">
                  {JSON.stringify(mockWanchainMessage, null, 2)}
                </pre>
              </ScrollArea>
              
              <div className="flex gap-4">
                <Button 
                  variant="outline"
                  onClick={() => copyToClipboard(JSON.stringify(mockWanchainMessage, null, 2), 'Wanchain message')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Message
                </Button>
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Wanscan
                </Button>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Message Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-muted-foreground">Message Type</label>
                    <p>{mockWanchainMessage.messageType}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Version</label>
                    <p>{mockWanchainMessage.version}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Source Chain</label>
                    <p className="capitalize">{mockWanchainMessage.sourceChain}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Destination Chain</label>
                    <p className="capitalize">{mockWanchainMessage.destinationChain}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="w-5 h-5" />
                <span>API Endpoints</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                RESTful API endpoints for integrating with BridgeSwap
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={endpoint.method === 'GET' ? 'default' : 'secondary'}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm">{endpoint.endpoint}</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{endpoint.description}</p>
                    <div className="bg-muted p-3 rounded text-xs">
                      <pre>{endpoint.example}</pre>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => copyToClipboard(endpoint.example, 'cURL example')}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy cURL
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SDK Information */}
          <Card>
            <CardHeader>
              <CardTitle>SDK & Libraries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">JavaScript SDK</h3>
                  <pre className="text-xs bg-muted p-2 rounded mb-2">npm install @bridgeswap/sdk</pre>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Documentation
                  </Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Python SDK</h3>
                  <pre className="text-xs bg-muted p-2 rounded mb-2">pip install bridgeswap</pre>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Documentation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}