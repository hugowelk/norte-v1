CREATE TABLE public.report_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id TEXT,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.report_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a review"
ON public.report_reviews
FOR INSERT
WITH CHECK (true);

CREATE INDEX idx_report_reviews_report_id ON public.report_reviews(report_id);