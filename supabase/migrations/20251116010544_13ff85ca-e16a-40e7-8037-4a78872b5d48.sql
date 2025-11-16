-- Add chat_enabled column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS chat_enabled boolean DEFAULT true;

-- Update existing profiles to have chat enabled by default
UPDATE public.profiles 
SET chat_enabled = true 
WHERE chat_enabled IS NULL;