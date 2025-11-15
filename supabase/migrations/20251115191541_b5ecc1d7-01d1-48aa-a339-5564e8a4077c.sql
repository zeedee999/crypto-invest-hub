-- Create storage bucket for QR codes
INSERT INTO storage.buckets (id, name, public)
VALUES ('qr-codes', 'qr-codes', true);

-- Allow admins to upload QR codes
CREATE POLICY "Admins can upload QR codes"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'qr-codes' AND
  has_role(auth.uid(), 'admin')
);

-- Allow admins to update QR codes
CREATE POLICY "Admins can update QR codes"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'qr-codes' AND
  has_role(auth.uid(), 'admin')
);

-- Allow admins to delete QR codes
CREATE POLICY "Admins can delete QR codes"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'qr-codes' AND
  has_role(auth.uid(), 'admin')
);

-- Allow public read access to QR codes
CREATE POLICY "QR codes are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'qr-codes');