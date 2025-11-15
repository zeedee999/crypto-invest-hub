-- Add RLS policy to allow users to update their own wallets
CREATE POLICY "Users can update own wallets"
ON public.wallets
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);