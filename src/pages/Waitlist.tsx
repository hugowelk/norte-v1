import { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useDocumentMeta } from '@/lib/useDocumentMeta';


const schema = z.object({
  name: z.string().trim().min(1, 'Add your name').max(100, 'Too long'),
  email: z.string().trim().email('Use a valid email').max(255),
});

const Waitlist = () => {
  useDocumentMeta([
    { name: 'description', content: 'Norte reveals the values that guide your decisions. Join the waitlist for early access.' },
  ]);
  if (typeof document !== 'undefined') document.title = 'Norte — Join the waitlist';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = schema.safeParse({ name, email });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setStatus('loading');
    const { error: dbError } = await supabase
      .from('waitlist')
      .insert({ name: parsed.data.name, email: parsed.data.email.toLowerCase() });

    if (dbError) {
      if (dbError.code === '23505') {
        setStatus('success');
        return;
      }
      setStatus('error');
      setError("Something didn't work. Try again in a moment.");
      return;
    }
    setStatus('success');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-5 border-b border-border/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-foreground">
            <Compass className="h-5 w-5 text-accent" strokeWidth={1.75} aria-hidden="true" />
            <span className="font-display font-semibold text-lg tracking-tight">Norte</span>
          </a>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden flex items-center px-4 py-20 md:py-28">
          {/* Subtle animated background waves */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0 opacity-[0.18]">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1440 600"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none" strokeLinecap="round">
                <path className="wave-line wave-line-1" stroke="hsl(var(--sage))" strokeWidth="1.2"
                  d="M-200,300 C200,220 400,380 720,300 C1040,220 1240,380 1640,300" />
                <path className="wave-line wave-line-2" stroke="hsl(var(--terracotta))" strokeWidth="1"
                  d="M-200,360 C220,280 420,440 720,360 C1020,280 1220,440 1640,360" />
                <path className="wave-line wave-line-3" stroke="hsl(var(--sage))" strokeWidth="0.8"
                  d="M-200,240 C240,160 440,320 720,240 C1000,160 1200,320 1640,240" />
                <path className="wave-line wave-line-4" stroke="hsl(var(--accent))" strokeWidth="0.8"
                  d="M-200,420 C260,340 460,500 720,420 C980,340 1180,500 1640,420" />
              </g>
            </svg>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-2xl mx-auto w-full text-center space-y-10"
          >


            <p className="text-xs font-display uppercase tracking-widest text-accent">Launching soon</p>

            <h1 className="text-4xl md:text-6xl font-display font-semibold text-foreground leading-[1.05] tracking-tight">
              Your real values aren't what you say. They're what you choose when something's at stake.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Norte uses 15 trade-off scenarios to reveal the values that guide your decisions. Methodology grounded in ACT.
            </p>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4"
              >
                <p className="text-2xl font-display text-foreground">You're on the list.</p>
                <p className="text-muted-foreground font-body mt-3">We'll be in touch when Norte opens.</p>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="pt-4 space-y-3 max-w-md mx-auto text-left">
                <div>
                  <label htmlFor="name" className="sr-only">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    maxLength={100}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    autoComplete="email"
                    maxLength={255}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive font-body">{error}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full px-10 py-4 bg-primary text-primary-foreground rounded-xl font-display font-semibold text-lg hover:opacity-90 transition-opacity shadow-md disabled:opacity-60"
                  whileHover={{ scale: status === 'loading' ? 1 : 1.01 }}
                  whileTap={{ scale: status === 'loading' ? 1 : 0.99 }}
                >
                  {status === 'loading' ? 'Joining…' : 'Join the waitlist'}
                </motion.button>

                <p className="text-xs text-muted-foreground font-body text-center pt-2">
                  No spam. One email when we open access.
                </p>
              </form>
            )}
          </motion.div>
        </section>

        <section className="border-t border-border/60 px-4 py-20 md:py-28 bg-muted/30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto w-full space-y-8"
          >
            <p className="text-xs font-display uppercase tracking-widest text-accent text-center">Why Norte</p>

            <h2 className="text-3xl md:text-5xl font-display font-semibold text-foreground leading-[1.1] tracking-tight text-center">
              Losing your direction is heavier than it looks.
            </h2>

            <div className="space-y-5 text-lg text-muted-foreground font-body leading-relaxed">
              <p>
                Most people don't struggle because they lack ambition. They struggle because they can't name what they're aiming for. The days fill up, the choices pile on, and the sense of a clear north quietly fades.
              </p>
              <p>
                That gap between how you're living and what actually matters to you shows up as tension. As restlessness. As the low anxiety that sits underneath good days and bad ones, and slowly wears on your mental health.
              </p>
              <p className="text-foreground">
                Norte is here to help you find that north again. To turn vague pressure into something you can see, name, and move toward, with less noise and more ease.
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="px-6 py-6 border-t border-border/60">
        <p className="max-w-6xl mx-auto text-xs text-muted-foreground font-body">© Norte</p>
      </footer>
    </div>
  );
};

export default Waitlist;
