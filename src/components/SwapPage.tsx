import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useNavigation } from '../App';
import { 
  ArrowRight, 
  Quote, 
  Zap, 
  Clock, 
  Shield, 
  Info,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

export function SwapPage() {
  const { setCurrentPage } = useNavigation();
  const [selectedType, setSelectedType] = useState<'indirect' | 'direct' | null>(null);

  const swapTypes = [
    {
      id: 'indirect',
      title: 'Indirect Swap',
      subtitle: 'Quote-Based System',
      description: 'Get a quote first, then complete the swap through deposit instructions',
      icon: <Quote className="w-8 h-8" />,
      features: [
        'Get detailed quote with fixed rates',
        'Manual deposit from your wallet',
        'Real-time transaction tracking',
        'Higher security - no wallet connection required'
      ],
      pros: [
        'No wallet connection needed',
        'Fixed exchange rates',
        'Full transaction control',
        'Works with any wallet type'
      ],
      cons: [
        'Multi-step process',
        'Longer completion time',
        'Manual transaction required'
      ],
      estimatedTime: '5-15 minutes',
      complexity: 'Beginner Friendly',
      route: 'quote-swap',
      buttonText: 'Get Quote',
      badge: 'Recommended',
      badgeColor: 'bg-success-green'
    },
    {
      id: 'direct',
      title: 'Direct Swap',
      subtitle: 'Instant Exchange',
      description: 'Connect wallet and swap tokens directly with real-time execution',
      icon: <Zap className="w-8 h-8" />,
      features: [
        'Instant swap execution',
        'Real-time price updates',
        'Multiple routing options',
        'Automatic transaction handling'
      ],
      pros: [
        'Fast execution',
        'Real-time pricing',
        'Single-click swaps',
        'Advanced routing'
      ],
      cons: [
        'Requires wallet connection',
        'Subject to price slippage',
        'Gas fees required'
      ],
      estimatedTime: '1-3 minutes',
      complexity: 'Advanced',
      route: 'direct-swap',
      buttonText: 'Start Direct Swap',
      badge: 'Fast',
      badgeColor: 'bg-electric-blue'
    }
  ];

  const handleSwapTypeSelect = (type: 'indirect' | 'direct') => {
    if (type === 'indirect') {
      setCurrentPage('quote-swap');
    } else {
      setCurrentPage('direct-swap');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
          Choose Your Swap Type
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Select the swap method that best fits your needs.
        </p>
      </div>

      {/* Swap Type Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {swapTypes.map((type) => (
          <Card 
            key={type.id}
            className={`card-glass border-white/10 hover-glow cursor-pointer transition-all duration-300 ${
              selectedType === type.id ? 'ring-2 ring-primary glow-effect' : ''
            }`}
            onClick={() => setSelectedType(type.id)}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-16 h-16 rounded-xl ${type.badgeColor}/20 flex items-center justify-center`}>
                  {type.icon}
                </div>
                <Badge className={`${type.badgeColor}/20 text-white border-current`}>
                  {type.badge}
                </Badge>
              </div>
              <CardTitle className="text-2xl mb-2">{type.title}</CardTitle>
              <p className="text-primary font-medium">{type.subtitle}</p>
              <p className="text-muted-foreground text-sm mt-2">{type.description}</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Key Features */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-success-green" />
                  Key Features
                </h4>
                <ul className="space-y-2">
                  {type.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pros and Cons */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h5 className="font-medium text-sm mb-2 text-success-green">Advantages:</h5>
                  <ul className="space-y-1">
                    {type.pros.map((pro, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-center">
                        <CheckCircle className="w-3 h-3 mr-2 text-success-green flex-shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-2 text-warning-orange">Considerations:</h5>
                  <ul className="space-y-1">
                    {type.cons.map((con, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-center">
                        <AlertCircle className="w-3 h-3 mr-2 text-warning-orange flex-shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Est. Time</p>
                  <p className="text-sm font-medium">{type.estimatedTime}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Shield className="w-4 h-4 mr-1 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Complexity</p>
                  <p className="text-sm font-medium">{type.complexity}</p>
                </div>
              </div>

              <Button 
                onClick={() => handleSwapTypeSelect(type.id)}
                className={`w-full h-12 font-medium ${
                  type.id === 'indirect' 
                    ? 'bg-gradient-primary hover-glow border-0 text-white' 
                    : 'bg-gradient-secondary hover-glow border-0 text-white'
                }`}
              >
                {type.buttonText}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <Card className="card-glass border-white/10">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-info/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">About Bridgeless Cross-Chain Swaps</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Both swap types use Wanchain's innovative bridgeless technology, which eliminates the need for 
                wrapped tokens and reduces custody risks. Your assets remain secure throughout the entire process.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-green" />
                  <span>No wrapped tokens</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-green" />
                  <span>Non-custodial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-green" />
                  <span>Direct chain-to-chain</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-center">
        <div className="p-4 rounded-lg card-glass border-white/10">
          <div className="text-2xl font-bold gradient-text">9</div>
          <div className="text-xs text-muted-foreground">Active Networks</div>
        </div>
        <div className="p-4 rounded-lg card-glass border-white/10">
          <div className="text-2xl font-bold gradient-text">99.9%</div>
          <div className="text-xs text-muted-foreground">Success Rate</div>
        </div>
        <div className="p-4 rounded-lg card-glass border-white/10">
          <div className="text-2xl font-bold gradient-text">$2.4B+</div>
          <div className="text-xs text-muted-foreground">Volume Processed</div>
        </div>
        <div className="p-4 rounded-lg card-glass border-white/10">
          <div className="text-2xl font-bold gradient-text">450K+</div>
          <div className="text-xs text-muted-foreground">Transactions</div>
        </div>
      </div>
    </div>
  );
}