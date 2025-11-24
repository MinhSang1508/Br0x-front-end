import React from 'react';
import { Separator } from './ui/separator';
import { ExternalLink, Github, Twitter, MessageCircle, Shield, Zap, Lock } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/10 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold gradient-text">Bridgeless Swap</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Non-custodial cross-chain swaps powered by Cardano and Wanchain technology.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Shield className="w-3 h-3" />
                <span>Non-custodial</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Zap className="w-3 h-3" />
                <span>Fast swaps</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                <span>Secure</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h4 className="font-semibold">Products</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://br0x.vercel.app/" className="hover:text-primary transition-colors">
                  Direct Swap
                </a>
              </li>
              <li>
                <a href="https://br0x.vercel.app/" className="hover:text-primary transition-colors">
                  Quote-based Swap
                </a>
              </li>
              <li>
                <a href="https://br0x.vercel.app/" className="hover:text-primary transition-colors">
                  Liquidity Pools
                </a>
              </li>
              <li>
                <a href="https://br0x.vercel.app/" className="hover:text-primary transition-colors">
                  Transaction History
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://br0x.vercel.app/" className="hover:text-primary transition-colors flex items-center space-x-1">
                  <span>Documentation</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://br0x.vercel.app/" className="hover:text-primary transition-colors flex items-center space-x-1">
                  <span>API Reference</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://br0x.vercel.app/" className="hover:text-primary transition-colors flex items-center space-x-1">
                  <span>Developer Guide</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://br0x.vercel.app/" className="hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="font-semibold">Community</h4>
            <div className="flex space-x-4">
              <a 
                href="https://sang-4.gitbook.io/br0x" 
                className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://sang-4.gitbook.io/br0x" 
                className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors hover:text-primary"
                aria-label="Discord"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a 
                href="https://sang-4.gitbook.io/br0x" 
                className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors hover:text-primary"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Join our community for updates and support.</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-green rounded-full animate-pulse"></div>
                <span className="text-xs">24/7 Community Support</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
            <p>© {currentYear} Bridgeless Swap. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <a href="https://sang-4.gitbook.io/br0x" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="https://sang-4.gitbook.io/br0x" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="https://sang-4.gitbook.io/br0x" className="hover:text-primary transition-colors">
                Security
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Powered by</span>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <span className="text-lg">₳</span>
                <span>Cardano</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <span className="text-lg">🔗</span>
                <span>Wanchain</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}