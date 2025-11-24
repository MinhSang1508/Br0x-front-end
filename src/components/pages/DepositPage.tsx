import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { useNavigation } from '../App';
import { Copy, AlertTriangle, CheckCircle, Clock, ArrowRight, Wallet, Eye, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function DepositPage() {
  const { swapData, setCurrentPage } = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);

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

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const proceedToStatus = () => {
    setCurrentPage('status');
  };

  const steps = [
    {
      number: 1,
      title: 'Open Your Wallet',
      description: 'Access your wallet application (hardware or software wallet)',
      icon: <Wallet className="w-6 h-6" />,
      details: [
        'Open your preferred wallet application',
        'Ensure you have sufficient balance',
        'Make sure you\'re on the correct network'
      ]
    },
    {
      number: 2,
      title: 'Prepare Transaction',
      description: 'Set up the transaction with the exact details provided',
      icon: <Eye className="w-6 h-6" />,
      details: [
        'Copy the deposit address below',
        'Set the exact amount specified',
        'Include the memo/note if required'
      ]
    },
    {
      number: 3,
      title: 'Send Transaction',
      description: 'Execute the transaction from your wallet',
      icon: <Send className="w-6 h-6" />,
      details: [
        'Double-check all transaction details',
        'Send the exact amount - no more, no less',
        'Wait for transaction confirmation'
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Complete Your Deposit</h1>
        <p className="text-muted-foreground">
          Follow these steps to complete your cross-chain swap
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.number ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <div className="ml-2 hidden sm:block">
                  <div className={`text-sm ${currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Current Step Details */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              {steps[currentStep - 1].icon}
            </div>
            <div>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {steps[currentStep - 1].details.map((detail, index) => (
              <li key={index} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span className="text-sm">{detail}</span>
              </li>
            ))}
          </ul>
          
          {currentStep < steps.length && (
            <Button 
              onClick={() => setCurrentStep(currentStep + 1)}
              className="mt-4"
              variant="outline"
            >
              Next Step
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Swap Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Swap Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Quote ID</label>
                <div className="flex items-center space-x-2">
                  <code className="text-sm bg-muted px-2 py-1 rounded">{swapData.id}</code>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyToClipboard(swapData.id, 'Quote ID')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">You're Swapping</label>
                <p className="font-semibold">
                  {swapData.fromAmount} {swapData.fromToken} → {swapData.expectedAmount} {swapData.toToken}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Route</label>
                <p className="font-semibold capitalize">
                  {swapData.fromChain} → {swapData.toChain}
                </p>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Estimated Time</label>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{swapData.estimatedTime}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deposit Instructions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Deposit Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Send the exact amount from your personal wallet. 
              DO NOT send from exchanges or use different amounts.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold">Deposit Address</label>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(swapData.depositAddress, 'Deposit address')}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
              <code className="text-sm bg-muted p-2 rounded block break-all">
                {swapData.depositAddress}
              </code>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold">Amount to Send</label>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(swapData.fromAmount, 'Amount')}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="text-lg font-mono bg-muted p-2 rounded">
                {swapData.fromAmount} {swapData.fromToken}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold">Memo/Note</label>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(swapData.memo, 'Memo')}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
              <code className="text-sm bg-muted p-2 rounded block">
                {swapData.memo}
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                Include this memo in your transaction if your wallet supports it
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={() => {
                const info = `Address: ${swapData.depositAddress}\nAmount: ${swapData.fromAmount} ${swapData.fromToken}\nMemo: ${swapData.memo}`;
                copyToClipboard(info, 'All deposit information');
              }}
              variant="outline" 
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy All Info
            </Button>
            <Button onClick={proceedToStatus} className="flex-1">
              I've Sent the Transaction
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Safety Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span>Always double-check the deposit address before sending</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span>Send the exact amount specified - overpayments cannot be refunded</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span>Include the memo if your wallet supports it</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span>Never send from exchange wallets - use your personal wallet only</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}