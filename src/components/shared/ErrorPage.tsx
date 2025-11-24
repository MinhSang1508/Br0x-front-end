import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { useNavigation } from '../App';
import { 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  MessageCircle, 
  Copy,
  ArrowLeft,
  HelpCircle,
  ExternalLink 
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ErrorPage() {
  const { swapData, setCurrentPage } = useNavigation();
  const [selectedError, setSelectedError] = useState('expired_quote');

  const errorTypes = {
    expired_quote: {
      title: 'Quote Expired',
      description: 'Your swap quote has expired and is no longer valid',
      severity: 'warning',
      icon: <Clock className="w-5 h-5" />,
      causes: [
        'Quote was valid for 10 minutes and has now expired',
        'Market conditions may have changed significantly',
        'Deposit was not made within the time window'
      ],
      solutions: [
        'Generate a new quote with current market rates',
        'Complete future swaps more quickly',
        'Consider using larger time windows for complex transactions'
      ],
      actions: ['new_quote', 'contact_support']
    },
    underpaid: {
      title: 'Insufficient Deposit Amount',
      description: 'The deposited amount is less than the required amount',
      severity: 'error',
      icon: <AlertTriangle className="w-5 h-5" />,
      causes: [
        'Sent amount is lower than the quoted amount',
        'Network fees were deducted from the sent amount',
        'Exchange rate changed between quote and deposit'
      ],
      solutions: [
        'Send additional funds to meet the minimum requirement',
        'Contact support for manual resolution',
        'Always send the exact amount specified in the quote'
      ],
      actions: ['top_up', 'contact_support', 'refund']
    },
    invalid_memo: {
      title: 'Missing or Invalid Memo',
      description: 'The transaction memo is missing or incorrectly formatted',
      severity: 'error',
      icon: <MessageCircle className="w-5 h-5" />,
      causes: [
        'Memo field was left empty',
        'Memo was typed incorrectly',
        'Wallet doesn\'t support memo fields'
      ],
      solutions: [
        'Send a new transaction with the correct memo',
        'Use a wallet that supports memo/note fields',
        'Contact support to manually link your transaction'
      ],
      actions: ['resend', 'contact_support', 'tutorial']
    },
    network_congestion: {
      title: 'Network Congestion',
      description: 'High network traffic is causing delays in processing',
      severity: 'info',
      icon: <RefreshCw className="w-5 h-5" />,
      causes: [
        'Source or destination network is experiencing high traffic',
        'Bridge validators are processing a high volume of transactions',
        'Gas prices are elevated causing delays'
      ],
      solutions: [
        'Wait for network conditions to improve',
        'Transaction will complete automatically once processed',
        'Check network status pages for updates'
      ],
      actions: ['wait', 'check_status', 'contact_support']
    }
  };

  const currentError = errorTypes[selectedError];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleAction = (action) => {
    switch (action) {
      case 'new_quote':
        setCurrentPage('swap');
        break;
      case 'contact_support':
        // Open support modal or redirect
        toast.info('Redirecting to support...');
        break;
      case 'check_status':
        setCurrentPage('status');
        break;
      case 'resend':
        setCurrentPage('deposit');
        break;
      default:
        toast.info(`Action: ${action}`);
    }
  };

  const copyQuoteId = () => {
    const quoteId = swapData?.id || 'BSW_example123';
    navigator.clipboard.writeText(quoteId);
    toast.success('Quote ID copied to clipboard');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Error Resolution Center</h1>
        <p className="text-muted-foreground">
          Resolve common issues and get help with your cross-chain swap
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Error Types Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Common Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(errorTypes).map(([key, error]) => (
                <button
                  key={key}
                  onClick={() => setSelectedError(key)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedError === key 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={getSeverityColor(error.severity).split(' ')[0]}>
                      {error.icon}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{error.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {error.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Error Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Error Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${getSeverityColor(currentError.severity)}`}>
                  {currentError.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{currentError.title}</h2>
                  <p className="text-muted-foreground mb-4">{currentError.description}</p>
                  <Badge variant={
                    currentError.severity === 'error' ? 'destructive' :
                    currentError.severity === 'warning' ? 'secondary' : 'default'
                  }>
                    {currentError.severity.charAt(0).toUpperCase() + currentError.severity.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Possible Causes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Possible Causes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentError.causes.map((cause, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2" />
                    <span className="text-sm">{cause}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Solutions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommended Solutions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                {currentError.solutions.map((solution, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2" />
                    <span className="text-sm">{solution}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {currentError.actions.map((action) => {
                  const actionConfig = {
                    new_quote: { label: 'Create New Quote', variant: 'default' },
                    contact_support: { label: 'Contact Support', variant: 'outline' },
                    check_status: { label: 'Check Status', variant: 'outline' },
                    wait: { label: 'Wait for Processing', variant: 'secondary' },
                    resend: { label: 'Resend Transaction', variant: 'default' },
                    top_up: { label: 'Send Additional Funds', variant: 'default' },
                    refund: { label: 'Request Refund', variant: 'outline' },
                    tutorial: { label: 'View Tutorial', variant: 'outline' }
                  };

                  const config = actionConfig[action] || { label: action, variant: 'outline' };
                  
                  return (
                    <Button
                      key={action}
                      variant={config.variant}
                      size="sm"
                      onClick={() => handleAction(action)}
                    >
                      {config.label}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Support Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <HelpCircle className="w-5 h-5" />
                <span>Need Additional Help?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <MessageCircle className="h-4 w-4" />
                <AlertDescription>
                  If the solutions above don't resolve your issue, please contact our support team with your Quote ID for personalized assistance.
                </AlertDescription>
              </Alert>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm text-muted-foreground">Your Quote ID</label>
                    <p className="font-mono text-sm">{swapData?.id || 'BSW_example123'}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={copyQuoteId}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <Button onClick={() => handleAction('contact_support')}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
                <Button variant="outline" onClick={() => setCurrentPage('home')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}