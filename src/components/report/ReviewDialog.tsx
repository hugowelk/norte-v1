import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { track } from '@/lib/analytics';

interface Props { reportId?: string; }

export function ReviewDialog({ reportId }: Props) {
  const { t } = useTranslation();
  const ratings = t('report.review.ratings', { returnObjects: true }) as string[];
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const reset = () => { setRating(0); setHover(0); setFeedback(''); setDone(false); };

  const handleSubmit = async () => {
    if (rating < 1) { toast.error(t('report.review.pickStar')); return; }
    setSubmitting(true);
    const { error } = await supabase.from('report_reviews').insert({
      report_id: reportId ?? null, rating, feedback: feedback.trim() || null,
    });
    setSubmitting(false);
    if (error) { toast.error(t('report.review.submitError')); return; }
    track('report_review_submitted', { report_id: reportId, rating });
    setDone(true);
    setTimeout(() => { setOpen(false); reset(); }, 1600);
  };

  return (
    <>
      <button type="button" onClick={() => { reset(); setOpen(true); }} className="font-sans text-sm text-primary underline underline-offset-4 hover:opacity-80 transition-opacity">
        {t('report.review.open')}
      </button>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
        <DialogContent className="sm:max-w-[480px]">
          {done ? (
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-accent/15 text-accent flex items-center justify-center">
                <Star size={22} fill="currentColor" strokeWidth={0} />
              </div>
              <p className="font-display text-[22px] text-primary">{t('report.review.thankYou')}</p>
              <p className="font-sans text-sm text-muted-foreground">{t('report.review.thankYouBody')}</p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-[22px] md:text-[24px] leading-tight text-primary">
                  {t('report.review.title')}
                </DialogTitle>
                <DialogDescription className="font-sans text-[15px] text-muted-foreground pt-1">
                  {t('report.review.subtitle')}
                </DialogDescription>
              </DialogHeader>

              <div className="py-2">
                <div className="flex items-center justify-center gap-2 py-3">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const active = (hover || rating) >= n;
                    return (
                      <button key={n} type="button" onClick={() => setRating(n)} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} className="p-1.5 transition-transform hover:scale-110" aria-label={`${n}`}>
                        <Star size={32} className={active ? 'text-accent' : 'text-muted-foreground/40'} fill={active ? 'currentColor' : 'none'} strokeWidth={1.5} />
                      </button>
                    );
                  })}
                </div>
                {rating > 0 && (
                  <p className="text-center text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
                    {ratings[rating - 1]}
                  </p>
                )}

                <label className="block font-sans text-sm text-foreground mt-4 mb-2">
                  {t('report.review.feedbackLabel')} <span className="text-muted-foreground">{t('report.review.optional')}</span>
                </label>
                <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder={t('report.review.feedbackPlaceholder')} rows={4} className="resize-none" maxLength={1000} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => setOpen(false)}>{t('common.actions.cancel')}</Button>
                <Button onClick={handleSubmit} disabled={submitting || rating < 1}>
                  {submitting ? t('report.review.submitting') : t('common.actions.submit')}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
