import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserBalance } from '@/hooks/useUserBalance';

const assets = [
  { symbol: 'BTC', name: 'Bitcoin', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
  { symbol: 'ETH', name: 'Ethereum', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' },
  { symbol: 'USDT', name: 'Tether (ERC20)', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' },
  { symbol: 'BNB', name: 'BNB', address: 'bnb1a1zp1ep5qgefi2dmpttftl5slmv7divfna' },
];

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepositDialog({ open, onOpenChange }: DepositDialogProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { updateBalance, balance } = useUserBalance();
  const [selectedAsset, setSelectedAsset] = useState('');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const currentAsset = assets.find(a => a.symbol === selectedAsset);

  const copyAddress = () => {
    if (currentAsset) {
      navigator.clipboard.writeText(currentAsset.address);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const depositMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAsset || !amount) {
        throw new Error('Please fill in all fields');
      }

      const asset = assets.find(a => a.symbol === selectedAsset);
      if (!asset) throw new Error('Invalid asset');

      // Check if wallet exists
      let { data: wallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user?.id)
        .eq('asset_symbol', asset.symbol)
        .single();

      // Create wallet if it doesn't exist
      if (!wallet) {
        const { data: newWallet, error: createError } = await supabase
          .from('wallets')
          .insert({
            user_id: user?.id,
            asset_symbol: asset.symbol,
            asset_name: asset.name,
            balance: Number(amount),
            wallet_address: asset.address,
          })
          .select()
          .single();

        if (createError) throw createError;
        wallet = newWallet;
      } else {
        // Update existing wallet
        await supabase
          .from('wallets')
          .update({ balance: Number(wallet.balance) + Number(amount) })
          .eq('id', wallet.id);
      }

      // Update user's deposit balance
      const currentDepositBalance = balance ? Number(balance.deposit_balance) : 0;
      updateBalance({
        deposit_balance: currentDepositBalance + Number(amount),
      });

      // Create transaction record
      await supabase.from('transactions').insert({
        user_id: user?.id,
        type: 'deposit',
        amount: Number(amount),
        asset_symbol: asset.symbol,
        status: 'completed',
      });

      queryClient.invalidateQueries({ queryKey: ['wallets', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['user-balance', user?.id] });
    },
    onSuccess: () => {
      toast.success('Deposit confirmed!');
      onOpenChange(false);
      setSelectedAsset('');
      setAmount('');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit Crypto</DialogTitle>
          <DialogDescription>
            Select an asset and scan the QR code or copy the address
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Select Asset</Label>
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
            <>
              <div className="flex justify-center p-6 bg-white rounded-lg">
                <QRCode value={currentAsset.address} size={200} />
              </div>

              <div>
                <Label>Wallet Address</Label>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-muted rounded-lg text-sm font-mono break-all">
                    {currentAsset.address}
                  </div>
                  <Button size="icon" variant="outline" onClick={copyAddress}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label>Amount (for simulation)</Label>
                <Input
                  type="number"
                  step="0.00000001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount deposited"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  In production, this would be automatic after network confirmation
                </p>
              </div>

              <Button 
                onClick={() => depositMutation.mutate()} 
                className="w-full"
                disabled={!amount || depositMutation.isPending}
              >
                {depositMutation.isPending ? 'Confirming...' : 'Confirm Deposit'}
              </Button>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>⚠️ Important:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Only send {currentAsset.name} to this address</li>
                  <li>Minimum deposit: 0.0001 {currentAsset.symbol}</li>
                  <li>Deposits are credited after network confirmations</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}