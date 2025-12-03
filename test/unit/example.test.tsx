import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// Mock component for testing
const SimpleButton = ({ label, onClick }: { label: string; onClick?: () => void }) => (
  <button onClick={onClick}>{label}</button>
);

const InputField = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <input 
    value={value} 
    onChange={(e) => onChange(e.target.value)} 
    placeholder={placeholder}
    data-testid="input-field"
  />
);

describe('SimpleButton Component', () => {
  it('should render button with label', () => {
    render(<SimpleButton label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<SimpleButton label="Click" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('should handle multiple clicks', () => {
    const handleClick = vi.fn();
    render(<SimpleButton label="Click" onClick={handleClick} />);
    
    const button = screen.getByText('Click');
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(3);
  });
});

describe('InputField Component', () => {
  it('should render input field', () => {
    render(<InputField value="" onChange={() => {}} placeholder="Enter text" />);
    expect(screen.getByTestId('input-field')).toBeInTheDocument();
  });

  it('should display placeholder text', () => {
    render(<InputField value="" onChange={() => {}} placeholder="Type here" />);
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('should update value on change', async () => {
    let inputValue = '';
    const handleChange = (value: string) => {
      inputValue = value;
    };

    render(<InputField value={inputValue} onChange={handleChange} />);
    
    const input = screen.getByTestId('input-field') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test input' } });
    
    await waitFor(() => {
      expect(input.value).toBe('test input');
    });
  });

  it('should handle multiple character inputs', async () => {
    let inputValue = '';
    const handleChange = (value: string) => {
      inputValue = value;
    };

    render(<InputField value={inputValue} onChange={handleChange} />);
    
    const input = screen.getByTestId('input-field') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.change(input, { target: { value: 'abc' } });
    
    await waitFor(() => {
      expect(input.value).toBe('abc');
    });
  });
});

describe('Form Integration', () => {
  const FormComponent = () => {
    const [value, setValue] = React.useState('');
    const [submitted, setSubmitted] = React.useState(false);

    const handleSubmit = () => {
      if (value.trim()) {
        setSubmitted(true);
      }
    };

    return (
      <div>
        <InputField value={value} onChange={setValue} placeholder="Enter name" />
        <SimpleButton label="Submit" onClick={handleSubmit} />
        {submitted && <p>Submitted: {value}</p>}
      </div>
    );
  };

  it('should submit form when input has value', async () => {
    render(<FormComponent />);
    
    const input = screen.getByPlaceholderText('Enter name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'John' } });
    fireEvent.click(screen.getByText('Submit'));
    
    await waitFor(() => {
      expect(screen.getByText('Submitted: John')).toBeInTheDocument();
    });
  });

  it('should not submit form when input is empty', async () => {
    render(<FormComponent />);
    fireEvent.click(screen.getByText('Submit'));
    
    expect(screen.queryByText(/Submitted:/)).not.toBeInTheDocument();
  });
});
