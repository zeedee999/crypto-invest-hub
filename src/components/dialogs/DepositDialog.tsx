import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDownLeft, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';

const assets = [
  { symbol: 'BTC', name: 'Bitcoin', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
  { symbol: 'ETH', name: 'Ethereum', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' },
  { symbol: 'USDT', name: 'Tether (ERC20)', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' },
];

export function DepositDialog() {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const currentAsset = assets.find(a => a.symbol === selectedAsset);

  const copyAddress = () => {
    if (currentAsset) {
      navigator.clipboard.writeText(currentAsset.address);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-auto flex-col gap-2 py-4">
            <ArrowDownLeft className="h-4 w-4 mr-2" />
            <span className="text-sm">Deposit</span>
          </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit Crypto</DialogTitle>
          <DialogDescription>
            Select an asset and scan the QR code or copy the address
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Asset</label>
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger>
                <SelectValue placeholder="Choose cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={asset.symbol} value={asset.symbol}>
                    {asset.name} ({asset.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentAsset && (
            <div className="space-y-4">
              <div className="flex justify-center p-6 bg-white rounded-lg">
                <QRCode value={currentAsset.address} size={200} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Wallet Address</label>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-muted rounded-lg text-sm font-mono break-all">
                    {currentAsset.address}
                  </div>
                  <Button size="icon" variant="outline" onClick={copyAddress}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>⚠️ Important:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Only send {currentAsset.name} to this address</li>
                  <li>Minimum deposit: 0.0001 {currentAsset.symbol}</li>
                  <li>Deposits are credited after network confirmations</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}