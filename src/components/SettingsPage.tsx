import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { 
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Sun, 
  Palette, 
  Volume2, 
  VolumeX, 
  AlertCircle,
  Save,
  RotateCcw,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { useTheme } from '../App';
import { toast } from 'sonner@2.0.3';

export function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const [language, setLanguage] = useState('english');
  const [currency, setCurrency] = useState('usd');
  const [notifications, setNotifications] = useState({
    swapComplete: true,
    priceAlerts: false,
    systemUpdates: true,
    marketing: false
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [slippageTolerance, setSlippageTolerance] = useState('1.0');
  const [gasPrice, setGasPrice] = useState('auto');
  const [autoApprove, setAutoApprove] = useState(false);
  const [expertMode, setExpertMode] = useState(false);
  const [showWarnings, setShowWarnings] = useState(true);

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Español' },
    { value: 'french', label: 'Français' },
    { value: 'german', label: 'Deutsch' },
    { value: 'chinese', label: '中文' },
    { value: 'japanese', label: '日本語' },
    { value: 'korean', label: '한국어' },
    { value: 'portuguese', label: 'Português' }
  ];

  const currencies = [
    { value: 'usd', label: 'USD ($)', symbol: '$' },
    { value: 'eur', label: 'EUR (€)', symbol: '€' },
    { value: 'gbp', label: 'GBP (£)', symbol: '£' },
    { value: 'jpy', label: 'JPY (¥)', symbol: '¥' },
    { value: 'btc', label: 'BTC (₿)', symbol: '₿' },
    { value: 'eth', label: 'ETH (Ξ)', symbol: 'Ξ' }
  ];

  const handleSaveSettings = () => {
    // Simulate saving settings
    toast.success('Settings saved successfully');
  };

  const handleResetSettings = () => {
    setLanguage('english');
    setCurrency('usd');
    setNotifications({
      swapComplete: true,
      priceAlerts: false,
      systemUpdates: true,
      marketing: false
    });
    setSoundEnabled(true);
    setSlippageTolerance('1.0');
    setGasPrice('auto');
    setAutoApprove(false);
    setExpertMode(false);
    setShowWarnings(true);
    toast.success('Settings reset to defaults');
  };

  const handleExportSettings = () => {
    const settings = {
      language,
      currency,
      notifications,
      soundEnabled,
      slippageTolerance,
      gasPrice,
      autoApprove,
      expertMode,
      showWarnings,
      theme: isDark ? 'dark' : 'light'
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bridgeless-swap-settings.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Settings exported successfully');
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string);
        
        // Apply imported settings
        if (settings.language) setLanguage(settings.language);
        if (settings.currency) setCurrency(settings.currency);
        if (settings.notifications) setNotifications(settings.notifications);
        if (typeof settings.soundEnabled === 'boolean') setSoundEnabled(settings.soundEnabled);
        if (settings.slippageTolerance) setSlippageTolerance(settings.slippageTolerance);
        if (settings.gasPrice) setGasPrice(settings.gasPrice);
        if (typeof settings.autoApprove === 'boolean') setAutoApprove(settings.autoApprove);
        if (typeof settings.expertMode === 'boolean') setExpertMode(settings.expertMode);
        if (typeof settings.showWarnings === 'boolean') setShowWarnings(settings.showWarnings);
        
        toast.success('Settings imported successfully');
      } catch (error) {
        toast.error('Failed to import settings: Invalid file format');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all local data? This action cannot be undone.')) {
      // Simulate clearing local data
      localStorage.clear();
      sessionStorage.clear();
      toast.success('Local data cleared successfully');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        <p className="text-muted-foreground">
          Customize your Bridgeless Swap experience
        </p>
      </div>

      <div className="grid gap-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5" />
              <span>Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Choose between light and dark mode
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="flex items-center space-x-2"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </Button>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(curr => (
                      <SelectItem key={curr.value} value={curr.value}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Swap Completion</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your swaps are completed
                  </p>
                </div>
                <Switch
                  checked={notifications.swapComplete}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, swapComplete: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Price Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts for significant price changes
                  </p>
                </div>
                <Switch
                  checked={notifications.priceAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, priceAlerts: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>System Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Important platform updates and maintenance notices
                  </p>
                </div>
                <Switch
                  checked={notifications.systemUpdates}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, systemUpdates: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Marketing</Label>
                  <p className="text-sm text-muted-foreground">
                    Promotional content and feature announcements
                  </p>
                </div>
                <Switch
                  checked={notifications.marketing}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, marketing: checked }))
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Sound Effects</Label>
                <p className="text-sm text-muted-foreground">
                  Play sounds for notifications and actions
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center space-x-2"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{soundEnabled ? 'Enabled' : 'Disabled'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trading */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Trading Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Slippage Tolerance</Label>
                <Select value={slippageTolerance} onValueChange={setSlippageTolerance}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.1">0.1%</SelectItem>
                    <SelectItem value="0.5">0.5%</SelectItem>
                    <SelectItem value="1.0">1.0%</SelectItem>
                    <SelectItem value="2.0">2.0%</SelectItem>
                    <SelectItem value="5.0">5.0%</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Gas Price Strategy</Label>
                <Select value={gasPrice} onValueChange={setGasPrice}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="slow">Slow</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center space-x-2">
                    <span>Expert Mode</span>
                    <Badge variant="destructive" className="text-xs">Advanced</Badge>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable advanced features and bypass confirmation dialogs
                  </p>
                </div>
                <Switch
                  checked={expertMode}
                  onCheckedChange={setExpertMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-approve Tokens</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve tokens for faster trading
                  </p>
                </div>
                <Switch
                  checked={autoApprove}
                  onCheckedChange={setAutoApprove}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show Warnings</Label>
                  <p className="text-sm text-muted-foreground">
                    Display risk warnings and safety reminders
                  </p>
                </div>
                <Switch
                  checked={showWarnings}
                  onCheckedChange={setShowWarnings}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Security & Privacy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your private keys and sensitive data are never stored on our servers. 
                All transactions are processed directly through your connected wallet.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Help improve the platform by sharing anonymous usage data
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Error Reporting</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically report errors to help us fix issues faster
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Data Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                onClick={handleExportSettings}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Settings</span>
              </Button>

              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportSettings}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button 
                  variant="outline"
                  className="w-full flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import Settings</span>
                </Button>
              </div>

              <Button 
                variant="destructive" 
                onClick={handleClearData}
                className="flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Data</span>
              </Button>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Clear Data</strong> will remove all locally stored preferences, 
                transaction history, and cached data. This action cannot be undone.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button 
                variant="outline" 
                onClick={handleResetSettings}
                className="flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Defaults</span>
              </Button>
              <Button 
                onClick={handleSaveSettings}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}