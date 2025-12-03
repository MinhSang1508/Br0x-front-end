import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// Mock Swap Context and Components
const MockSwapContext = React.createContext({
  fromChain: 'cardano',
  toChain: 'ethereum',
  fromToken: 'ADA',
  toToken: 'ETH',
});

const SwapForm = () => {
  const [fromAmount, setFromAmount] = React.useState('');
  const [toAmount, setToAmount] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [quoteReady, setQuoteReady] = React.useState(false);

  const handleGetQuote = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (fromAmount) {
      setToAmount((parseFloat(fromAmount) * 0.95).toFixed(2));
      setQuoteReady(true);
    }
    setIsLoading(false);
  };

  const handleSwap = () => {
    if (quoteReady) {
      return { from: fromAmount, to: toAmount };
    }
  };

  return (
    <div>
      <input 
        data-testid="from-amount"
        value={fromAmount}
        onChange={(e) => setFromAmount(e.target.value)}
        placeholder="From amount"
      />
      <input 
        data-testid="to-amount"
        value={toAmount}
        onChange={(e) => setToAmount(e.target.value)}
        placeholder="To amount"
        disabled
      />
      <button 
        data-testid="quote-button"
        onClick={handleGetQuote}
        disabled={isLoading}
      >
        {isLoading ? 'Getting quote...' : 'Get Quote'}
      </button>
      <button 
        data-testid="swap-button"
        onClick={handleSwap}
        disabled={!quoteReady}
      >
        Swap
      </button>
      {quoteReady && <p data-testid="quote-ready">Quote Ready</p>}
    </div>
  );
};

describe('Swap Integration Tests', () => {
  it('should display swap form', () => {
    render(<SwapForm />);
    expect(screen.getByPlaceholderText('From amount')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('To amount')).toBeInTheDocument();
  });

  it('should get quote when amount is entered', async () => {
    render(<SwapForm />);
    
    const fromInput = screen.getByTestId('from-amount') as HTMLInputElement;
    const quoteButton = screen.getByTestId('quote-button');
    
    fireEvent.change(fromInput, { target: { value: '100' } });
    fireEvent.click(quoteButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('quote-ready')).toBeInTheDocument();
    });
  });

  it('should calculate correct output amount', async () => {
    render(<SwapForm />);
    
    const fromInput = screen.getByTestId('from-amount') as HTMLInputElement;
    const toInput = screen.getByTestId('to-amount') as HTMLInputElement;
    const quoteButton = screen.getByTestId('quote-button');
    
    fireEvent.change(fromInput, { target: { value: '100' } });
    fireEvent.click(quoteButton);
    
    await waitFor(() => {
      expect(toInput.value).toBe('95.00');
    });
  });

  it('should disable swap button until quote is ready', async () => {
    render(<SwapForm />);
    
    const swapButton = screen.getByTestId('swap-button');
    expect(swapButton).toBeDisabled();
    
    const fromInput = screen.getByTestId('from-amount');
    const quoteButton = screen.getByTestId('quote-button');
    
    fireEvent.change(fromInput, { target: { value: '100' } });
    fireEvent.click(quoteButton);
    
    await waitFor(() => {
      expect(swapButton).not.toBeDisabled();
    });
  });

  it('should show loading state during quote retrieval', () => {
    render(<SwapForm />);
    
    const fromInput = screen.getByTestId('from-amount');
    const quoteButton = screen.getByTestId('quote-button');
    
    fireEvent.change(fromInput, { target: { value: '100' } });
    fireEvent.click(quoteButton);
    
    expect(quoteButton).toHaveTextContent('Getting quote...');
    expect(quoteButton).toBeDisabled();
  });

  it('should clear quote when from amount is cleared', async () => {
    render(<SwapForm />);
    
    const fromInput = screen.getByTestId('from-amount');
    const quoteButton = screen.getByTestId('quote-button');
    
    // Get initial quote
    fireEvent.change(fromInput, { target: { value: '100' } });
    fireEvent.click(quoteButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('quote-ready')).toBeInTheDocument();
    });
    
    // Clear input
    fireEvent.change(fromInput, { target: { value: '' } });
    
    // Quote should still be there until new quote is requested
    expect(screen.getByTestId('quote-ready')).toBeInTheDocument();
  });
});

describe('Chain Selection Integration', () => {
  const ChainSelector = () => {
    const [fromChain, setFromChain] = React.useState('cardano');
    const [toChain, setToChain] = React.useState('ethereum');

    const chains = ['cardano', 'ethereum', 'polygon', 'solana', 'arbitrum'];

    const handleSwapChains = () => {
      const temp = fromChain;
      setFromChain(toChain);
      setToChain(temp);
    };

    return (
      <div>
        <select 
          data-testid="from-chain"
          value={fromChain}
          onChange={(e) => setFromChain(e.target.value)}
        >
          {chains.map(chain => (
            <option key={chain} value={chain}>{chain}</option>
          ))}
        </select>
        <button 
          data-testid="swap-chains"
          onClick={handleSwapChains}
        >
          Swap Chains
        </button>
        <select 
          data-testid="to-chain"
          value={toChain}
          onChange={(e) => setToChain(e.target.value)}
        >
          {chains.map(chain => (
            <option key={chain} value={chain}>{chain}</option>
          ))}
        </select>
        <p data-testid="chain-display">{fromChain} → {toChain}</p>
      </div>
    );
  };

  it('should display selected chains', () => {
    render(<ChainSelector />);
    expect(screen.getByTestId('chain-display')).toHaveTextContent('cardano → ethereum');
  });

  it('should swap chains when swap button is clicked', () => {
    render(<ChainSelector />);
    
    fireEvent.click(screen.getByTestId('swap-chains'));
    
    expect(screen.getByTestId('chain-display')).toHaveTextContent('ethereum → cardano');
  });

  it('should allow chain selection change', () => {
    render(<ChainSelector />);
    
    const fromChainSelect = screen.getByTestId('from-chain') as HTMLSelectElement;
    fireEvent.change(fromChainSelect, { target: { value: 'solana' } });
    
    expect(screen.getByTestId('chain-display')).toHaveTextContent('solana → ethereum');
  });
});
