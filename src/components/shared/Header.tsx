import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useNavigation, useWallet, useTheme, useTransactionHistory } from '../App';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Menu, X, Sun, Moon, Settings, BookOpen } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';
import projectLogo from '../assets/dda65dde8e41be93a081a6066169244e68c1cbd3.png';
import subwalletLogo from '../assets/cdf88002033f44055486f7dfa30e8e32dd79666b.png';
import laceLogo from '../assets/87e267b72fceea58e435c8d1b46f365b52a7e8c8.png';
import eternlLogo from '../assets/9bf46c8ae675c8d7f4c58af2e33a8c3dfd58a514.png';
import metamaskLogo from '../assets/5c18b223369775af8201db53a4dbe7680d52f4fd.png';
import okxLogo from '../assets/0836fcef9cfad78811d99a8c6666fe4455476a75.png';

export function Header() {
  const { currentPage, setCurrentPage } = useNavigation();
  const { isConnected, address, walletType, connectWallet, disconnectWallet } = useWallet();
  const { isDark, toggleTheme } = useTheme();
  const { transactions } = useTransactionHistory();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'swap', label: 'Swap', href: '#' },
    { id: 'history', label: 'History', href: '#' },
    { id: 'liquidity', label: 'Liquidity', href: '#' },
    { id: 'user-liquidity', label: 'Portfolio', href: '#' },
  ];

  const walletOptions = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Connect using MetaMask wallet',
      icon: 'M',
      iconBg: 'bg-orange-500',
      type: 'evm',
      logoSrc: metamaskLogo
    },
    {
      id: 'subwallet',
      name: 'Sub-wallet',
      description: 'Multi-chain wallet extension',
      icon: 'S',
      iconBg: 'bg-blue-500',
      type: 'multi',
      logoSrc: subwalletLogo
    },
    {
      id: 'okx',
      name: 'OKX Wallet',
      description: 'OKX Wallet extension',
      icon: 'O',
      iconBg: 'bg-black',
      type: 'multi',
      logoSrc: okxLogo
    },
    {
      id: 'eternl',
      name: 'Eternl',
      description: 'Cardano native wallet',
      icon: 'E',
      iconBg: 'bg-blue-600',
      type: 'cardano',
      logoSrc: eternlLogo
    },
    {
      id: 'lace',
      name: 'Lace',
      description: 'Cardano light wallet',
      icon: 'L',
      iconBg: 'bg-purple-600',
      type: 'cardano',
      logoSrc: laceLogo
    }
  ];

  const WalletIcon = ({ wallet, size = 'w-8 h-8' }) => {
    if (wallet.logoSrc) {
      return (
        <div className={`${size} rounded-full overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0`}>
          <ImageWithFallback
            src={wallet.logoSrc}
            alt={`${wallet.name} logo`}
            className={`${size} object-contain`}
          />
        </div>
      );
    }
    return (
      <div className={`${size} ${wallet.iconBg} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
        {wallet.icon}
      </div>
    );
  };

  const handleConnect = async (walletId: string) => {
    try {
      await connectWallet(walletId);
      setIsWalletModalOpen(false);
      const wallet = walletOptions.find(w => w.id === walletId);
      toast.success(`Connected to ${wallet?.name}`);
    } catch (error) {
      toast.error('Failed to connect wallet');
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    }
  };

  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleNavigation = (pageId: string) => {
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false);
  };

  const handleDocsClick = () => {
    window.open('https://sang-4.gitbook.io/br0x/about-br0x-swap/intros', '_blank', 'noopener,noreferrer');
  };

  const getExplorerUrl = (address: string, walletType: string) => {
    // Return appropriate explorer URL based on wallet type
    switch (walletType?.toLowerCase()) {
      case 'eternl':
      case 'lace':
        return `https://cexplorer.io/tx/${address}`;
      case 'metamask':
      case 'okx wallet':
        return `https://etherscan.io/address/${address}`;
      default:
        return `https://etherscan.io/address/${address}`;
    }
  };

  const getWalletIcon = (walletType: string) => {
    const wallet = walletOptions.find(w => w.name.toLowerCase() === walletType?.toLowerCase());
    return wallet || walletOptions[0]; // fallback to first wallet
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-glass border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => handleNavigation('home')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <ImageWithFallback
                  src={projectLogo}
                  alt="Br0x Swap Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="gradient-text text-xl font-bold tracking-tight">
                Br0x Swap
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 hover:text-primary ${
                  currentPage === item.id 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Docs Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDocsClick}
              className="hidden md:flex p-2 rounded-lg hover:bg-white/10 transition-colors items-center space-x-2"
              title="Documentation"
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">Docs</span>
            </Button>

            {/* Theme Switch Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Settings Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('settings')}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Wallet Connection */}
            {!isConnected ? (
              <DropdownMenu open={isWalletModalOpen} onOpenChange={setIsWalletModalOpen}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="bg-gradient-primary hover-glow border-0 text-white font-medium"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 backdrop-blur-glass border-white/10" align="end">
                  <div className="p-3">
                    <h3 className="font-medium mb-3">Connect a Wallet</h3>
                    <div className="space-y-2">
                      {walletOptions.map((wallet) => (
                        <Button
                          key={wallet.id}
                          onClick={() => handleConnect(wallet.id)}
                          variant="ghost"
                          className="w-full justify-start hover:bg-white/10 h-auto p-3"
                        >
                          <div className="flex items-center space-x-3 w-full">
                            <WalletIcon wallet={wallet} />
                            <div className="flex-1 text-left">
                              <div className="font-medium text-sm">{wallet.name}</div>
                              <div className="text-xs text-muted-foreground">{wallet.description}</div>
                            </div>
                            {wallet.type === 'cardano' && (
                              <Badge variant="outline" className="text-xs border-blue-200 text-blue-600">
                                Cardano
                              </Badge>
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong>Note:</strong> Cardano wallets (Eternl, Lace) are recommended for ADA swaps. 
                        EVM wallets work for Ethereum, BNB, Polygon, and other EVM chains.
                      </p>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-white/10">
                    <WalletIcon wallet={getWalletIcon(walletType)} />
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium">{walletType}</div>
                      <div className="text-xs text-muted-foreground">{truncateAddress(address!)}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 backdrop-blur-glass border-white/10" align="end">
                  <div className="p-3">
                    <div className="flex items-center space-x-3 mb-3">
                      <WalletIcon wallet={getWalletIcon(walletType)} />
                      <div>
                        <div className="font-medium">{walletType}</div>
                        <div className="text-sm text-muted-foreground font-mono">{truncateAddress(address!)}</div>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={copyAddress} className="hover:bg-white/10">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Address
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => window.open(getExplorerUrl(address!, walletType!), '_blank')}
                      className="hover:bg-white/10"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Explorer
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={disconnectWallet} className="hover:bg-white/10 text-red-400">
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === item.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="grid grid-cols-3 gap-2 px-3 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDocsClick}
                  className="flex items-center justify-center space-x-1 hover:bg-white/10"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Docs</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="flex items-center justify-center space-x-1 hover:bg-white/10"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{isDark ? 'Light' : 'Dark'}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation('settings')}
                  className="flex items-center justify-center space-x-1 hover:bg-white/10"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
