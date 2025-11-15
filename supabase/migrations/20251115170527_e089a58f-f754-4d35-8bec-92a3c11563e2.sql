-- Add RLS policies for admins to access user data

-- Profiles: Allow admins to view and update all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- User Balances: Allow admins to view and update all balances
CREATE POLICY "Admins can view all balances"
ON public.user_balances
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all balances"
ON public.user_balances
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Transactions: Allow admins to view and update all transactions
CREATE POLICY "Admins can view all transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all transactions"
ON public.transactions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Wallets: Allow admins to view and update all wallets
CREATE POLICY "Admins can view all wallets"
ON public.wallets
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all wallets"
ON public.wallets
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));