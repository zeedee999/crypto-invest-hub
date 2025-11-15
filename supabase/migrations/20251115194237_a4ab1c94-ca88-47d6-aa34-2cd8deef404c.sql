-- Add admin policy for investment_plans so admins can see total investments
CREATE POLICY "Admins can view all investment plans"
ON investment_plans
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Create table for dynamic wallet addresses
CREATE TABLE IF NOT EXISTS crypto_wallet_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coin_name TEXT NOT NULL,
  coin_symbol TEXT NOT NULL,
  chain TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  qr_code_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE crypto_wallet_addresses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crypto_wallet_addresses
CREATE POLICY "Admins can view all wallet addresses"
ON crypto_wallet_addresses
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert wallet addresses"
ON crypto_wallet_addresses
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update wallet addresses"
ON crypto_wallet_addresses
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete wallet addresses"
ON crypto_wallet_addresses
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view active wallet addresses"
ON crypto_wallet_addresses
FOR SELECT
USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_crypto_wallet_addresses_updated_at
BEFORE UPDATE ON crypto_wallet_addresses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();