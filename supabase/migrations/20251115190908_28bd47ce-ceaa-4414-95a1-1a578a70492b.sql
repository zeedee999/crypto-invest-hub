-- Create wallet_settings table for admin to configure deposit wallets
CREATE TABLE IF NOT EXISTS public.wallet_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  btc_address text,
  btc_qr text,
  eth_address text,
  eth_qr text,
  usdt_address text,
  usdt_qr text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wallet_settings ENABLE ROW LEVEL SECURITY;

-- Admins can view wallet settings
CREATE POLICY "Admins can view wallet settings"
  ON public.wallet_settings
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Admins can update wallet settings
CREATE POLICY "Admins can update wallet settings"
  ON public.wallet_settings
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- Admins can insert wallet settings
CREATE POLICY "Admins can insert wallet settings"
  ON public.wallet_settings
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Users can view wallet settings (for deposit page)
CREATE POLICY "Users can view wallet settings"
  ON public.wallet_settings
  FOR SELECT
  USING (true);

-- Add updated_at trigger
CREATE TRIGGER update_wallet_settings_updated_at
  BEFORE UPDATE ON public.wallet_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();