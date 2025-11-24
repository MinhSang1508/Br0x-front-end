import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useWallet, useTransactionHistory } from '../App';
import { Wallet, Filter, ExternalLink, ArrowRight, Calendar, Search, Trash2, RefreshCw, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { Input } from './ui/input';
import { getNetworkById, NetworkIcon } from './BlockchainData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import subwalletLogo from '../assets/cdf88002033f44055486f7dfa30e8e32dd79666b.png';
import laceLogo from '../assets/87e267b72fceea58e435c8d1b46f365b52a7e8c8.png';
import eternlLogo from '../assets/9bf46c8ae675c8d7f4c58af2e33a8c3dfd58a514.png';
import metamaskLogo from '../assets/5c18b223369775af8201db53a4dbe7680d52f4fd.png';
import okxLogo from '../assets/0836fcef9cfad78811d99a8c6666fe4455476a75.png';

export function TransactionHistory() {
  const { isConnected, connectWallet } = useWallet();
  const { transactions: allTransactions, clearTransactions } = useTransactionHistory();
  const [statusFilter, setStatusFilter] = useState('all');
  const [chainFilter, setChainFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [showTempOnly, setShowTempOnly] = useState(false);

  // Separate temporary transactions (from swaps) from historical ones
  const tempTransactions = allTransactions.filter(tx => tx.id.includes('BSW_') && tx.temporary === true);
  const historicalTransactions = allTransactions.filter(tx => !tx.temporary);

  const chains = [
    { value: 'all', label: 'All Chains' },
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'cardano', label: 'Cardano' },
    { value: 'bnb', label: 'BNB Chain' },
    { value: 'solana', label: 'Solana' },
    { value: 'polygon', label: 'Polygon' },
    { value: 'arbitrum', label: 'Arbitrum' },
    { value: 'optimism', label: 'Optimism' },
    { value: 'fantom', label: 'Fantom' },
    { value: 'polkadot', label: 'Polkadot' },
    { value: 'avalanche', label: 'Avalanche' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success-green/20 text-success-green border-success-green">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-warning-orange/20 text-warning-orange border-warning-orange">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-error-red/20 text-error-red border-error-red">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getChainIcon = (chain: string) => {
    const networkId = chain.toLowerCase().replace(' chain', '').replace(' ', '');
    const networkData = getNetworkById(networkId);
    
    if (networkData?.logoUrl) {
      return <NetworkIcon network={networkData} size="sm" />;
    }
    
    const icons = {
      'Ethereum': 'âŸ ',
      'Cardano': 'â‚³',
      'BNB Chain': 'ðŸŸ¡',
      'Solana': 'â—Ž',
      'Polygon': 'â¬Ÿ',
      'Arbitrum': 'ðŸ”µ',
      'Optimism': 'ðŸ”´',
      'Fantom': 'ðŸ‘»',
      'Polkadot': 'âš«',
      'Avalanche': 'ðŸ”ï¸',
    };
    return <span className="text-lg">{icons[chain] || 'ðŸ”—'}</span>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  // Use all transactions or filter to show only temporary ones
  const combinedTransactions = showTempOnly ? tempTransactions : allTransactions;

  const filteredTransactions = combinedTransactions.filter(tx => {
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    const matchesChain = chainFilter === 'all' || 
      tx.fromChain.toLowerCase().includes(chainFilter) || 
      tx.toChain.toLowerCase().includes(chainFilter);
    const matchesSearch = searchTerm === '' || 
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.fromToken.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.toToken.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesChain && matchesSearch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortConfig.key === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortConfig.direction === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    }
    if (sortConfig.key === 'value') {
      const valueA = parseFloat(a.value.replace('$', '').replace(',', ''));
      const valueB = parseFloat(b.value.replace('$', '').replace(',', ''));
      return sortConfig.direction === 'asc' ? valueA - valueB : valueB - valueA;
    }
    return 0;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc'
    });
  };

  const handleConnect = async (walletType: string) => {
    try {
      await connectWallet(walletType);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  // Calculate statistics
  const stats = {
    total: filteredTransactions.length,
    completed: filteredTransactions.filter(tx => tx.status === 'completed').length,
    pending: filteredTransactions.filter(tx => tx.status === 'pending').length,
    failed: filteredTransactions.filter(tx => tx.status === 'failed').length,
    totalValue: filteredTransactions.reduce((sum, tx) => {
      return sum + parseFloat(tx.value.replace('$', '').replace(',', ''));
    }, 0)
  };

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-text">Transaction History</h1>
          <p className="text-muted-foreground">
            View all your cross-chain swap transactions
          </p>
        </div>

        <Card className="card-glass border-white/10 max-w-md mx-auto">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground mb-6">
                Connect your wallet to view your transaction history and track your swaps.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => handleConnect('metamask')}
                className="w-full justify-start bg-white/5 hover:bg-white/10 border border-white/10"
                variant="outline"
              >
                <div className="w-6 h-6 mr-3 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                  <ImageWithFallback
                    src={metamaskLogo}
                    alt="MetaMask Logo"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                Connect MetaMask
              </Button>
              
              <Button
                onClick={() => handleConnect('subwallet')}
                className="w-full justify-start bg-white/5 hover:bg-white/10 border border-white/10"
                variant="outline"
              >
                <div className="w-6 h-6 mr-3 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                  <ImageWithFallback
                    src={subwalletLogo}
                    alt="Sub-wallet Logo"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                Connect Sub-wallet
              </Button>
              
              <Button
                onClick={() => handleConnect('okx')}
                className="w-full justify-start bg-white/5 hover:bg-white/10 border border-white/10"
                variant="outline"
              >
                <div className="w-6 h-6 mr-3 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                  <ImageWithFallback
                    src={okxLogo}
                    alt="OKX Wallet Logo"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                Connect OKX Wallet
              </Button>
              
              <Button
                onClick={() => handleConnect('eternl')}
                className="w-full justify-start bg-white/5 hover:bg-white/10 border border-white/10"
                variant="outline"
              >
                <div className="w-6 h-6 mr-3 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                  <ImageWithFallback
                    src={eternlLogo}
                    alt="Eternl Logo"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                Connect Eternl
              </Button>
              
              <Button
                onClick={() => handleConnect('lace')}
                className="w-full justify-start bg-white/5 hover:bg-white/10 border border-white/10"
                variant="outline"
              >
                <div className="w-6 h-6 mr-3 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                  <ImageWithFallback
                    src={laceLogo}
                    alt="Lace Logo"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                Connect Lace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 gradient-text">Transaction History</h1>
        <p className="text-muted-foreground">
          Track your cross-chain swap transactions
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="card-glass border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-electric-blue/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-electric-blue" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-success-green/20 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-success-green rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-semibold text-success-green">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-warning-orange/20 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-warning-orange" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-semibold text-warning-orange">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-error-red/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-error-red" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-semibold text-error-red">{stats.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Overview Notice */}
      <Card className="card-glass border-electric-blue/30 bg-electric-blue/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-5 h-5 text-electric-blue" />
              <div>
                <p className="font-medium">Transaction History Overview</p>
                <p className="text-sm text-muted-foreground">
                  {historicalTransactions.length} historical transactions â€¢ {tempTransactions.length} recent swap(s)
                  {tempTransactions.length > 0 && " (cleared on refresh)"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {tempTransactions.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTempOnly(!showTempOnly)}
                    className="border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
                  >
                    {showTempOnly ? 'Show All' : 'Recent Only'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearTransactions}
                    className="border-error-red/30 text-error-red hover:bg-error-red/10"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear Recent
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="card-glass border-white/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by transaction ID, token..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input-background border-white/10"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-input-background border-white/10">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={chainFilter} onValueChange={setChainFilter}>
                <SelectTrigger className="w-40 bg-input-background border-white/10">
                  <SelectValue placeholder="Chain" />
                </SelectTrigger>
                <SelectContent>
                  {chains.map((chain) => (
                    <SelectItem key={chain.value} value={chain.value}>
                      {chain.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="card-glass border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <div className="text-sm text-muted-foreground">
              {filteredTransactions.length} transactions
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {paginatedTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || chainFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'Your transaction history will appear here after you make swaps.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead 
                      className="cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort('date')}
                    >
                      Date
                      {sortConfig.key === 'date' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? 'â†‘' : 'â†“'}
                        </span>
                      )}
                    </TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort('value')}
                    >
                      Value
                      {sortConfig.key === 'value' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? 'â†‘' : 'â†“'}
                        </span>
                      )}
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.map((tx) => (
                    <TableRow key={tx.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(tx.date)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {tx.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getChainIcon(tx.fromChain)}
                          <div>
                            <div className="font-medium">{tx.fromAmount} {tx.fromToken}</div>
                            <div className="text-sm text-muted-foreground">{tx.fromChain}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          {getChainIcon(tx.toChain)}
                          <div>
                            <div className="font-medium">{tx.toAmount} {tx.toToken}</div>
                            <div className="text-sm text-muted-foreground">{tx.toChain}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(tx.status)}</TableCell>
                      <TableCell className="font-semibold">{tx.value}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`https://etherscan.io/tx/${tx.txHash}`, '_blank')}
                          className="hover:bg-white/10"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="border-white/10"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "bg-gradient-primary" : "border-white/10"}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="border-white/10"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
