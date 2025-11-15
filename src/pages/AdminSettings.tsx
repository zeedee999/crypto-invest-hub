import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

export default function AdminSettings() {
  const { isAdmin, isLoading } = useUserRole();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [btcAddress, setBtcAddress] = useState('');
  const [btcQr, setBtcQr] = useState('');
  const [ethAddress, setEthAddress] = useState('');
  const [ethQr, setEthQr] = useState('');
  const [usdtAddress, setUsdtAddress] = useState('');
  const [usdtQr, setUsdtQr] = useState('');

  const { data: settings } = useQuery({
    queryKey: ['wallet-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallet_settings')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  useEffect(() => {
    if (settings) {
      setBtcAddress(settings.btc_address || '');
      setBtcQr(settings.btc_qr || '');
      setEthAddress(settings.eth_address || '');
      setEthQr(settings.eth_qr || '');
      setUsdtAddress(settings.usdt_address || '');
      setUsdtQr(settings.usdt_qr || '');
    }
  }, [settings]);

  const saveSettings = useMutation({
    mutationFn: async () => {
      const settingsData = {
        btc_address: btcAddress,
        btc_qr: btcQr,
        eth_address: ethAddress,
        eth_qr: ethQr,
        usdt_address: usdtAddress,
        usdt_qr: usdtQr,
      };

      if (settings) {
        const { error } = await supabase
          .from('wallet_settings')
          .update(settingsData)
          .eq('id', settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('wallet_settings')
          .insert(settingsData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet-settings'] });
      toast.success('Settings saved successfully');
    },
    onError: () => {
      toast.error('Failed to save settings');
    },
  });

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Wallet Settings</h1>
          <p className="text-muted-foreground">Configure wallet addresses and QR codes for deposits</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Bitcoin (BTC)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="btcAddress">Wallet Address</Label>
                <Input
                  id="btcAddress"
                  value={btcAddress}
                  onChange={(e) => setBtcAddress(e.target.value)}
                  placeholder="Enter BTC wallet address"
                />
              </div>
              <div>
                <Label htmlFor="btcQr">QR Code URL</Label>
                <Input
                  id="btcQr"
                  value={btcQr}
                  onChange={(e) => setBtcQr(e.target.value)}
                  placeholder="Enter QR code image URL"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ethereum (ETH)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ethAddress">Wallet Address</Label>
                <Input
                  id="ethAddress"
                  value={ethAddress}
                  onChange={(e) => setEthAddress(e.target.value)}
                  placeholder="Enter ETH wallet address"
                />
              </div>
              <div>
                <Label htmlFor="ethQr">QR Code URL</Label>
                <Input
                  id="ethQr"
                  value={ethQr}
                  onChange={(e) => setEthQr(e.target.value)}
                  placeholder="Enter QR code image URL"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tether (USDT)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="usdtAddress">Wallet Address</Label>
                <Input
                  id="usdtAddress"
                  value={usdtAddress}
                  onChange={(e) => setUsdtAddress(e.target.value)}
                  placeholder="Enter USDT wallet address"
                />
              </div>
              <div>
                <Label htmlFor="usdtQr">QR Code URL</Label>
                <Input
                  id="usdtQr"
                  value={usdtQr}
                  onChange={(e) => setUsdtQr(e.target.value)}
                  placeholder="Enter QR code image URL"
                />
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={() => saveSettings.mutate()}
            disabled={saveSettings.isPending}
            className="w-full"
          >
            Save All Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
