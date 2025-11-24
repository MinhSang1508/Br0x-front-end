import React from 'react';

// Import the provided crypto logos
import ethLogo from '../assets/6a172e76eea24ecd870d6f0b4d6b692c0d80acce.png';
import adaLogo from '../assets/dbd113afd3da7ae206139502102baf0856db17e7.png';
import bnbLogo from '../assets/c1a44d347e9cddd2da3c6f8f0c1a906523900caf.png';
import polygonLogo from '../assets/11f00a29f4e39fa1f20990c65951cba7755a62f9.png';
import solanaLogo from '../assets/8a23f41a85c7bff93aa82f203c8d8496753e5b30.png';
import arbitrumLogo from '../assets/56f7215ff5ff40ec406f45c63d30a34d0e4695eb.png';
import avalancheLogo from '../assets/9d1a324b2361c5fc0ea4fb5229b41d631ab1ed1a.png';
import polkadotLogo from '../assets/82076803a6052f48890cd950757a0088aa20ebc3.png';
import fantomLogo from '../assets/224b52da921ae675cc8e39f8b48f2819fcedf1a3.png';

export interface BlockchainNetwork {
  id: string;
  name: string;
  symbol: string;
  color: string;
  status: 'active' | 'planning';
  category: 'evm' | 'cardano' | 'solana' | 'polkadot' | 'other';
  explorerUrl: string;
  logoUrl?: string;
  description: string;
}

export const blockchainNetworks: BlockchainNetwork[] = [
  // Active Networks
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    color: '#0033AD',
    status: 'active',
    category: 'cardano',
    explorerUrl: 'https://cexplorer.io',
    logoUrl: adaLogo,
    description: 'Native blockchain with non-custodial swap support'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    color: '#627EEA',
    status: 'active',
    category: 'evm',
    explorerUrl: 'https://etherscan.io',
    logoUrl: ethLogo,
    description: 'Leading smart contract platform'
  },
  {
    id: 'bnb',
    name: 'BNB Chain',
    symbol: 'BNB',
    color: '#F3BA2F',
    status: 'active',
    category: 'evm',
    explorerUrl: 'https://bscscan.com',
    logoUrl: bnbLogo,
    description: 'Fast and low-cost EVM compatible chain'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    color: '#9945FF',
    status: 'active',
    category: 'solana',
    explorerUrl: 'https://explorer.solana.com',
    logoUrl: solanaLogo,
    description: 'High-performance blockchain for DeFi and NFTs'
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    color: '#8247E5',
    status: 'active',
    category: 'evm',
    explorerUrl: 'https://polygonscan.com',
    logoUrl: polygonLogo,
    description: 'Ethereum scaling solution with low fees'
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    symbol: 'ARB',
    color: '#28A0F0',
    status: 'active',
    category: 'evm',
    explorerUrl: 'https://arbiscan.io',
    logoUrl: arbitrumLogo,
    description: 'Ethereum Layer 2 scaling solution'
  },
  {
    id: 'optimism',
    name: 'Optimism',
    symbol: 'OP',
    color: '#FF0420',
    status: 'active',
    category: 'evm',
    explorerUrl: 'https://optimistic.etherscan.io',
    logoUrl: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png',
    description: 'Ethereum Layer 2 with optimistic rollups'
  },
  {
    id: 'fantom',
    name: 'Fantom',
    symbol: 'FTM',
    color: '#1969FF',
    status: 'active',
    category: 'evm',
    explorerUrl: 'https://ftmscan.com',
    logoUrl: fantomLogo,
    description: 'Fast and scalable DeFi ecosystem'
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    color: '#E6007A',
    status: 'active',
    category: 'polkadot',
    explorerUrl: 'https://polkadot.subscan.io',
    logoUrl: polkadotLogo,
    description: 'Interoperable multi-chain network'
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    color: '#E84118',
    status: 'active',
    category: 'evm',
    explorerUrl: 'https://snowtrace.io',
    logoUrl: avalancheLogo,
    description: 'High-performance blockchain with EVM compatibility'
  }
];

export const getNetworksByStatus = (status: 'active' | 'planning') => {
  return blockchainNetworks.filter(network => network.status === status);
};

export const getNetworkById = (id: string) => {
  return blockchainNetworks.find(network => network.id === id);
};

export const getNetworksByCategory = (category: string) => {
  return blockchainNetworks.filter(network => network.category === category);
};

// Network icons component
export const NetworkIcon: React.FC<{ 
  network: BlockchainNetwork; 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ network, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const iconSize = sizeClasses[size];

  if (network.logoUrl) {
    return (
      <div className={`${iconSize} rounded-full overflow-hidden ${className}`}>
        <img 
          src={network.logoUrl} 
          alt={`${network.name} logo`}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Fallback to colored circle with symbol
  return (
    <div 
      className={`${iconSize} rounded-full flex items-center justify-center text-white text-sm font-bold ${className}`}
      style={{ backgroundColor: network.color }}
    >
      {network.symbol.slice(0, 2)}
    </div>
  );
};

// Network status badge
export const NetworkStatusBadge: React.FC<{ status: 'active' | 'planning' }> = ({ status }) => {
  const statusConfig = {
    active: {
      text: 'Active',
      className: 'bg-success-green/10 text-success-green border-success-green/20'
    },
    planning: {
      text: 'Coming Soon',
      className: 'bg-warning-orange/10 text-warning-orange border-warning-orange/20'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      {config.text}
    </span>
  );
};
