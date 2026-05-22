
CREATE TABLE public.report_contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  report_id text NOT NULL,
  report_url text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_report_contacts_email ON public.report_contacts(email);
CREATE INDEX idx_report_contacts_report_id ON public.report_contacts(report_id);

ALTER TABLE public.report_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit contact"
ON public.report_contacts
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(name)) >= 1 AND length(trim(name)) <= 100
  AND length(email) >= 3 AND length(email) <= 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(report_id) >= 1 AND length(report_id) <= 64
  AND length(report_url) >= 1 AND length(report_url) <= 500
);
