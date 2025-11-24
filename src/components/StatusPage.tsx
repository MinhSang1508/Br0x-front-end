import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useNavigation } from '../App';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw, 
  Copy,
  Eye,
  ArrowRight 
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function StatusPage() {
  const { swapData, setCurrentPage } = useNavigation();
  const [currentStatus, setCurrentStatus] = useState('deposit_pending');
  const [progress, setProgress] = useState(25);
  const [transactionHashes, setTransactionHashes] = useState({
    source: null,
    destination: null
  });

  if (!swapData) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h2>No swap data found</h2>
        <Button onClick={() => setCurrentPage('swap')} className="mt-4">
          Create New Swap
        </Button>
      </div>
    );
  }

  // Simulate status updates
  useEffect(() => {
    const statusFlow = [
      { status: 'deposit_pending', progress: 25, delay: 0 },
      { status: 'deposit_confirmed', progress: 40, delay: 5000 },
      { status: 'cross_chain_pending', progress: 65, delay: 10000 },
      { status: 'destination_pending', progress: 85, delay: 15000 },
      { status: 'completed', progress: 100, delay: 20000 }
    ];

    statusFlow.forEach(({ status, progress: newProgress, delay }) => {
      setTimeout(() => {
        setCurrentStatus(status);
        setProgress(newProgress);
        
        if (status === 'deposit_confirmed') {
          setTransactionHashes(prev => ({ ...prev, source: '0x' + Math.random().toString(16).substr(2, 64) }));
        }
        if (status === 'completed') {
          setTransactionHashes(prev => ({ ...prev, destination: '0x' + Math.random().toString(16).substr(2, 64) }));
        }
      }, delay);
    });
  }, []);

  const statusSteps = [
    {
      id: 'quote_created',
      title: 'Quote Created',
      description: 'Swap quote generated and deposit address created',
      icon: <CheckCircle className="w-5 h-5" />,
      status: 'completed'
    },
    {
      id: 'deposit_pending',
      title: 'Waiting for Deposit',
      description: 'Monitoring blockchain for your deposit transaction',
      icon: currentStatus === 'deposit_pending' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />,
      status: currentStatus === 'deposit_pending' ? 'active' : 'completed'
    },
    {
      id: 'deposit_confirmed',
      title: 'Deposit Confirmed',
      description: 'Your deposit has been detected and confirmed on the source chain',
      icon: currentStatus === 'deposit_confirmed' ? <RefreshCw className="w-5 h-5 animate-spin" /> : 
            ['cross_chain_pending', 'destination_pending', 'completed'].includes(currentStatus) ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />,
      status: currentStatus === 'deposit_confirmed' ? 'active' : 
              ['cross_chain_pending', 'destination_pending', 'completed'].includes(currentStatus) ? 'completed' : 'pending'
    },
    {
      id: 'cross_chain_pending',
      title: 'Cross-Chain Message',
      description: 'Processing cross-chain communication via Wanchain bridge',
      icon: currentStatus === 'cross_chain_pending' ? <RefreshCw className="w-5 h-5 animate-spin" /> : 
            ['destination_pending', 'completed'].includes(currentStatus) ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />,
      status: currentStatus === 'cross_chain_pending' ? 'active' : 
              ['destination_pending', 'completed'].includes(currentStatus) ? 'completed' : 'pending'
    },
    {
      id: 'destination_pending',
      title: 'Destination Swap',
      description: 'Executing swap on destination chain',
      icon: currentStatus === 'destination_pending' ? <RefreshCw className="w-5 h-5 animate-spin" /> : 
            currentStatus === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />,
      status: currentStatus === 'destination_pending' ? 'active' : 
              currentStatus === 'completed' ? 'completed' : 'pending'
    },
    {
      id: 'completed',
      title: 'Swap Completed',
      description: 'Tokens successfully delivered to your destination address',
      icon: currentStatus === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />,
      status: currentStatus === 'completed' ? 'completed' : 'pending'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'active': return 'text-blue-600';
      case 'pending': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 border-green-200';
      case 'active': return 'bg-blue-100 border-blue-200';
      case 'pending': return 'bg-muted border-border';
      default: return 'bg-muted border-border';
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const openBlockExplorer = (hash, chain) => {
    // Mock explorer URLs
    const explorers = {
      cardano: 'https://cexplorer.io/tx',
      ethereum: 'https://etherscan.io/tx/',
      bnb: 'https://bscscan.com/tx/',
      polygon: 'https://polygonscan.com/tx/'
    };
    window.open(explorers[chain] + hash, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Swap Status</h1>
        <p className="text-muted-foreground">
          Track your cross-chain swap in real-time
        </p>
      </div>

      {/* Progress Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-center space-x-4">
              <Badge variant={currentStatus === 'completed' ? 'default' : 'secondary'}>
                {currentStatus === 'completed' ? 'Completed' : 'In Progress'}
              </Badge>
              {currentStatus !== 'completed' && (
                <span className="text-sm text-muted-foreground">
                  Estimated time remaining: 2-4 minutes
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Swap Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Quote ID</p>
              <p className="font-mono text-sm">{swapData.id}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Swapping</p>
              <p className="font-semibold">{swapData.fromAmount} {swapData.fromToken}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Receiving</p>
              <p className="font-semibold text-green-600">{swapData.expectedAmount} {swapData.toToken}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Steps */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Transaction Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusSteps.map((step, index) => (
              <div key={step.id} className={`p-4 rounded-lg border ${getStatusBg(step.status)}`}>
                <div className="flex items-start space-x-4">
                  <div className={`${getStatusColor(step.status)} mt-0.5`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${getStatusColor(step.status)}`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>
                    {step.status === 'active' && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                          <span className="text-xs text-blue-600">Processing...</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {step.status === 'completed' && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Done
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Hashes */}
      {(transactionHashes.source || transactionHashes.destination) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transactionHashes.source && (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Source Transaction</p>
                  <p className="text-xs text-muted-foreground">
                    {swapData.fromChain.charAt(0).toUpperCase() + swapData.fromChain.slice(1)} Network
                  </p>
                  <p className="font-mono text-xs mt-1">{transactionHashes.source}</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(transactionHashes.source, 'Transaction hash')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => openBlockExplorer(transactionHashes.source, swapData.fromChain)}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {transactionHashes.destination && (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Destination Transaction</p>
                  <p className="text-xs text-muted-foreground">
                    {swapData.toChain.charAt(0).toUpperCase() + swapData.toChain.slice(1)} Network
                  </p>
                  <p className="font-mono text-xs mt-1">{transactionHashes.destination}</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(transactionHashes.destination, 'Transaction hash')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => openBlockExplorer(transactionHashes.destination, swapData.toChain)}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button 
          onClick={() => setCurrentPage('developer')} 
          variant="outline" 
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Technical Details
        </Button>
        <Button 
          onClick={() => setCurrentPage('swap')} 
          className="flex-1"
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          Start New Swap
        </Button>
      </div>

      {/* Help */}
      {currentStatus !== 'completed' && (
        <Card className="mt-6">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-sm">Need Help?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  If your swap is taking longer than expected, please contact support with your Quote ID: <code>{swapData.id}</code>
                </p>
                <Button variant="link" className="px-0 mt-2 h-auto">
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}