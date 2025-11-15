import { useState } from 'react';
import { useCryptoWallets } from '@/hooks/useCryptoWallets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { AddWalletDialog } from './AddWalletDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function WalletAddressList() {
  const { wallets, isLoading, deleteWallet, updateWallet } = useCryptoWallets();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

  const handleDelete = () => {
    if (selectedWalletId) {
      deleteWallet(selectedWalletId);
      setDeleteDialogOpen(false);
      setSelectedWalletId(null);
    }
  };

  const toggleActive = (id: string, currentStatus: boolean) => {
    updateWallet({
      id,
      updates: { is_active: !currentStatus },
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Wallet Addresses</CardTitle>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Wallet
          </Button>
        </CardHeader>
        <CardContent>
          {!wallets || wallets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No wallet addresses configured. Click "Add Wallet" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">
                        {wallet.coin_name} ({wallet.coin_symbol})
                      </h4>
                      <Badge variant={wallet.is_active ? 'default' : 'secondary'}>
                        {wallet.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{wallet.chain}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono break-all">
                      {wallet.wallet_address}
                    </p>
                    {wallet.qr_code_url && (
                      <div className="mt-2">
                        <img
                          src={wallet.qr_code_url}
                          alt={`${wallet.coin_symbol} QR`}
                          className="w-24 h-24 object-contain border rounded"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleActive(wallet.id, wallet.is_active)}
                    >
                      {wallet.is_active ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setSelectedWalletId(wallet.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddWalletDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Wallet Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this wallet address? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
