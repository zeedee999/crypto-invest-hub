import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Loader2 } from 'lucide-react';

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
  
  const [uploadingBtc, setUploadingBtc] = useState(false);
  const [uploadingEth, setUploadingEth] = useState(false);
  const [uploadingUsdt, setUploadingUsdt] = useState(false);
  
  const btcInputRef = useRef<HTMLInputElement>(null);
  const ethInputRef = useRef<HTMLInputElement>(null);
  const usdtInputRef = useRef<HTMLInputElement>(null);

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

  const uploadQrCode = async (file: File, currency: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${currency}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError, data } = await supabase.storage
      .from('qr-codes')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('qr-codes')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    currency: 'btc' | 'eth' | 'usdt'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const setUploading = currency === 'btc' ? setUploadingBtc : 
                         currency === 'eth' ? setUploadingEth : 
                         setUploadingUsdt;
    
    const setQr = currency === 'btc' ? setBtcQr : 
                  currency === 'eth' ? setEthQr : 
                  setUsdtQr;

    try {
      setUploading(true);
      const url = await uploadQrCode(file, currency);
      setQr(url);
      toast.success('QR code uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload QR code');
    } finally {
      setUploading(false);
    }
  };

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
                <Label>QR Code</Label>
                <div className="space-y-2">
                  <input
                    ref={btcInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'btc')}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => btcInputRef.current?.click()}
                    disabled={uploadingBtc}
                  >
                    {uploadingBtc ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload QR Code
                      </>
                    )}
                  </Button>
                  {btcQr && (
                    <div className="mt-2">
                      <img src={btcQr} alt="BTC QR" className="w-32 h-32 object-contain border rounded" />
                    </div>
                  )}
                </div>
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
                <Label>QR Code</Label>
                <div className="space-y-2">
                  <input
                    ref={ethInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'eth')}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => ethInputRef.current?.click()}
                    disabled={uploadingEth}
                  >
                    {uploadingEth ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload QR Code
                      </>
                    )}
                  </Button>
                  {ethQr && (
                    <div className="mt-2">
                      <img src={ethQr} alt="ETH QR" className="w-32 h-32 object-contain border rounded" />
                    </div>
                  )}
                </div>
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
                <Label>QR Code</Label>
                <div className="space-y-2">
                  <input
                    ref={usdtInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'usdt')}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => usdtInputRef.current?.click()}
                    disabled={uploadingUsdt}
                  >
                    {uploadingUsdt ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload QR Code
                      </>
                    )}
                  </Button>
                  {usdtQr && (
                    <div className="mt-2">
                      <img src={usdtQr} alt="USDT QR" className="w-32 h-32 object-contain border rounded" />
                    </div>
                  )}
                </div>
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
