import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Loader2 } from 'lucide-react';
import { useCryptoWallets } from '@/hooks/useCryptoWallets';
import { toast } from 'sonner';

interface AddWalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const POPULAR_COINS = [
  { name: 'Bitcoin', symbol: 'BTC' },
  { name: 'Ethereum', symbol: 'ETH' },
  { name: 'Tether', symbol: 'USDT' },
  { name: 'USD Coin', symbol: 'USDC' },
  { name: 'BNB', symbol: 'BNB' },
  { name: 'Solana', symbol: 'SOL' },
  { name: 'Ripple', symbol: 'XRP' },
  { name: 'Cardano', symbol: 'ADA' },
];

const POPULAR_CHAINS = [
  'ERC20',
  'TRC20',
  'BEP20',
  'BEP2',
  'Native',
  'Polygon',
  'Arbitrum',
  'Optimism',
  'Avalanche',
];

export function AddWalletDialog({ open, onOpenChange }: AddWalletDialogProps) {
  const { createWallet, uploadQrCode, isCreating } = useCryptoWallets();
  const [coinName, setCoinName] = useState('');
  const [coinSymbol, setCoinSymbol] = useState('');
  const [chain, setChain] = useState('');
  const [customChain, setCustomChain] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCoinSelect = (value: string) => {
    const coin = POPULAR_COINS.find(c => c.symbol === value);
    if (coin) {
      setCoinName(coin.name);
      setCoinSymbol(coin.symbol);
    } else if (value === 'custom') {
      setCoinName('');
      setCoinSymbol('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setQrCodeFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setQrCodePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!coinName || !coinSymbol || !walletAddress) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedChain = chain === 'custom' ? customChain : chain;
    if (!selectedChain) {
      toast.error('Please select or enter a chain');
      return;
    }

    try {
      setUploading(true);
      let qrCodeUrl = null;

      // First create the wallet entry to get an ID
      const tempId = crypto.randomUUID();
      
      if (qrCodeFile) {
        qrCodeUrl = await uploadQrCode(qrCodeFile, tempId);
      }

      createWallet({
        coin_name: coinName,
        coin_symbol: coinSymbol.toUpperCase(),
        chain: selectedChain,
        wallet_address: walletAddress,
        qr_code_url: qrCodeUrl,
        is_active: true,
      });

      // Reset form
      setCoinName('');
      setCoinSymbol('');
      setChain('');
      setCustomChain('');
      setWalletAddress('');
      setQrCodeFile(null);
      setQrCodePreview('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding wallet:', error);
      toast.error('Failed to add wallet address');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Wallet Address</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="coin">Cryptocurrency</Label>
            <Select onValueChange={handleCoinSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select coin" />
              </SelectTrigger>
              <SelectContent>
                {POPULAR_COINS.map((coin) => (
                  <SelectItem key={coin.symbol} value={coin.symbol}>
                    {coin.name} ({coin.symbol})
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom...</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {coinSymbol === '' && coinName === '' && (
            <>
              <div>
                <Label htmlFor="customCoinName">Coin Name</Label>
                <Input
                  id="customCoinName"
                  value={coinName}
                  onChange={(e) => setCoinName(e.target.value)}
                  placeholder="Enter coin name"
                />
              </div>
              <div>
                <Label htmlFor="customCoinSymbol">Coin Symbol</Label>
                <Input
                  id="customCoinSymbol"
                  value={coinSymbol}
                  onChange={(e) => setCoinSymbol(e.target.value)}
                  placeholder="Enter coin symbol"
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="chain">Chain/Network</Label>
            <Select value={chain} onValueChange={setChain}>
              <SelectTrigger>
                <SelectValue placeholder="Select chain" />
              </SelectTrigger>
              <SelectContent>
                {POPULAR_CHAINS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom...</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {chain === 'custom' && (
            <div>
              <Label htmlFor="customChain">Custom Chain</Label>
              <Input
                id="customChain"
                value={customChain}
                onChange={(e) => setCustomChain(e.target.value)}
                placeholder="Enter chain name"
              />
            </div>
          )}

          <div>
            <Label htmlFor="address">Wallet Address</Label>
            <Input
              id="address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter wallet address"
            />
          </div>

          <div>
            <Label>QR Code (Optional)</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload QR Code
            </Button>
            {qrCodePreview && (
              <div className="mt-2">
                <img src={qrCodePreview} alt="QR Preview" className="w-32 h-32 object-contain border rounded" />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isCreating || uploading}>
            {isCreating || uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Wallet'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
