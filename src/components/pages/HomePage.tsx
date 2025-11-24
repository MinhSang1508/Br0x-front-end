import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useNavigation } from '../App';
import { ArrowRight, Shield, Zap, Globe, CheckCircle } from 'lucide-react';
import { getNetworksByStatus, NetworkIcon, NetworkStatusBadge } from './BlockchainData';

export function HomePage() {
  const { setCurrentPage } = useNavigation();

  const activeNetworks = getNetworksByStatus('active');
  const planningNetworks = [
    { 
      id: 'avalanche', 
      name: 'Avalanche', 
      symbol: 'AVAX', 
      color: '#E84142', 
      status: 'planning' as const,
      category: 'evm' as const,
      explorerUrl: 'https://snowtrace.io',
      description: 'Fast, low-cost, eco-friendly blockchain platform'
    },
    { 
      id: 'cosmos', 
      name: 'Cosmos', 
      symbol: 'ATOM', 
      color: '#2E3148', 
      status: 'planning' as const,
      category: 'other' as const,
      explorerUrl: 'https://www.mintscan.io',
      description: 'Internet of blockchains ecosystem'
    },
    { 
      id: 'near', 
      name: 'Near Protocol', 
      symbol: 'NEAR', 
      color: '#00C08B', 
      status: 'planning' as const,
      category: 'other' as const,
      explorerUrl: 'https://explorer.near.org',
      description: 'Developer-friendly blockchain platform'
    },
    { 
      id: 'aptos', 
      name: 'Aptos', 
      symbol: 'APT', 
      color: '#00D4AA', 
      status: 'planning' as const,
      category: 'other' as const,
      explorerUrl: 'https://explorer.aptoslabs.com',
      description: 'Scalable Layer 1 blockchain'
    },
    { 
      id: 'sui', 
      name: 'Sui', 
      symbol: 'SUI', 
      color: '#4DA2FF', 
      status: 'planning' as const,
      category: 'other' as const,
      explorerUrl: 'https://explorer.sui.io',
      description: 'High-performance programmable blockchain'
    },
    { 
      id: 'injective', 
      name: 'Injective', 
      symbol: 'INJ', 
      color: '#00D4E7', 
      status: 'planning' as const,
      category: 'other' as const,
      explorerUrl: 'https://explorer.injective.network',
      description: 'Interoperable DeFi blockchain'
    }
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Non-Custodial',
      description: 'Pioneering Cardano\'s first bridgeless swap, enabling direct, trustless cross-chain trading of native assets to every major blockchain'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Bridgeless',
      description: 'No wrapped tokens or intermediary bridges. Direct cross-chain swaps via Wanchain.'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Multi-Chain',
      description: 'Swap between major blockchains seamlessly with competitive rates.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
          Bridgeless Cross-Chain Swaps
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Pioneering Cardano's first bridgeless swap, enabling direct,  
          trustless cross-chain trading of native assets to every major blockchain.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            onClick={() => setCurrentPage('swap')}
            className="text-lg px-8 py-6 bg-gradient-primary hover-glow border-0 text-white"
          >
            Start a Swap
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => setCurrentPage('developer')}
            className="text-lg px-8 py-6 border-white/20 hover:bg-white/10"
          >
            Developer Tools
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success-green" />
            <span>Audited Smart Contracts</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success-green" />
            <span>No KYC Required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success-green" />
            <span>Open Source</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <Card key={index} className="text-center card-glass border-white/10 hover-glow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Supported Networks */}
      <Card className="mb-8 card-glass border-white/10">
        <CardHeader className="text-center">
          <CardTitle>Supported Networks</CardTitle>
          <p className="text-muted-foreground">
            Swap tokens across these major blockchain networks
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Networks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Active Networks</h3>
                <Badge className="bg-success-green/20 text-success-green border-success-green">
                  {activeNetworks.length} Networks
                </Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activeNetworks.map((network) => (
                  <div key={network.id} className="flex flex-col items-center p-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                    <NetworkIcon network={network} size="md" className="mb-2" />
                    <span className="font-medium text-sm text-center">{network.name}</span>
                    <NetworkStatusBadge status={network.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Planning Networks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Coming Soon</h3>
                <Badge className="bg-warning-orange/20 text-warning-orange border-warning-orange">
                  {planningNetworks.length} Networks
                </Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {planningNetworks.map((network) => (
                  <div key={network.id} className="flex flex-col items-center p-3 border border-white/10 rounded-lg opacity-60 hover:opacity-80 transition-opacity">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-2"
                      style={{ backgroundColor: network.color }}
                    >
                      {network.symbol.slice(0, 2)}
                    </div>
                    <span className="font-medium text-sm text-center">{network.name}</span>
                    <NetworkStatusBadge status={network.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              More networks will be added based on community demand and technical feasibility.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-8 mt-16 text-center">
        <div className="p-6 rounded-lg card-glass border-white/10">
          <div className="text-3xl font-bold gradient-text">$2.4B+</div>
          <div className="text-muted-foreground">Total Volume</div>
        </div>
        <div className="p-6 rounded-lg card-glass border-white/10">
          <div className="text-3xl font-bold gradient-text">450K+</div>
          <div className="text-muted-foreground">Transactions</div>
        </div>
        <div className="p-6 rounded-lg card-glass border-white/10">
          <div className="text-3xl font-bold gradient-text">{activeNetworks.length}</div>
          <div className="text-muted-foreground">Active Chains</div>
        </div>
        <div className="p-6 rounded-lg card-glass border-white/10">
          <div className="text-3xl font-bold gradient-text">99.9%</div>
          <div className="text-muted-foreground">Success Rate</div>
        </div>
      </div>
    </div>
  );
}