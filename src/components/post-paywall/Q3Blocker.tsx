import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PostPaywallLayout } from './PostPaywallLayout';
import { usePostPaywallStore, type BlockerAnswer } from '@/lib/postPaywallStore';

const OPTIONS: { key: Exclude<BlockerAnswer, null>; label: string }[] = [
  { key: 'not_tried', label: "I haven't really tried. It's been on the to-do list" },
  { key: 'other_priorities_win', label: "I've tried, but other priorities keep winning" },
  { key: 'dont_know_what_it_looks_like', label: "I'm not sure what \u201Cliving by it\u201D would actually look like" },
  { key: 'hard_right_now', label: 'Something in my life makes it genuinely hard right now' },
  { key: 'not_sure_want_it', label: "I'm not convinced I really want it" },
  { key: 'other', label: 'Other' },
];

export function Q3Blocker() {
  const navigate = useNavigate();
  const { state, update } = usePostPaywallStore();
  const [selected, setSelected] = useState<BlockerAnswer>(state.blocker_answer);
  const [custom, setCustom] = useState(state.blocker_custom_text);

  const gap = state.loudest_gap;
  const gapLabel = gap?.label ?? 'this value';

  const heading = gap?.isFallback
    ? <>What's been making it harder to make your top one chosen value —{' '}
        <span className="font-semibold text-primary">{gapLabel}</span>, part of your routine?</>
    : <>What's been making it harder to make your top one chosen value —{' '}
        <span className="font-semibold text-primary">{gapLabel}</span>, part of your routine?</>;

  const canContinue =
    selected !== null && (selected !== 'other' || custom.trim().length >= 3);

  const submit = () => {
    if (!canContinue) return;
    update({
      blocker_answer: selected,
      blocker_custom_text: selected === 'other' ? custom.trim() : '',
    });
    navigate('/post-paywall/q4');
  };

  return (
    <PostPaywallLayout step={3} backTo="/post-paywall/q2">
      <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
        {heading}
      </h1>
      <p className="text-sm text-muted-foreground">Pick whichever feels truest.</p>

      <div className="space-y-2.5">
        {OPTIONS.map(opt => {
          const isSel = selected === opt.key;
          return (
            <div key={opt.key}>
              <button
                onClick={() => setSelected(opt.key)}
                className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all duration-200 font-body text-base ${
                  isSel
                    ? 'border-primary bg-primary/5 text-foreground shadow-sm'
                    : 'border-border bg-card hover:border-primary/40 text-foreground/80 hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
              <AnimatePresence initial={false}>
                {opt.key === 'other' && isSel && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <input
                      autoFocus
                      type="text"
                      maxLength={200}
                      value={custom}
                      onChange={e => setCustom(e.target.value)}
                      placeholder="Tell us in your own words…"
                      className="mt-2.5 w-full px-4 py-3 rounded-lg border-2 border-border bg-card focus:border-primary focus:outline-none font-body text-base text-foreground"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <button
        onClick={submit}
        disabled={!canContinue}
        className={`w-full py-4 rounded-lg font-display font-medium text-base transition-all ${
          canContinue
            ? 'bg-primary text-primary-foreground hover:opacity-90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        Continue →
      </button>
    </PostPaywallLayout>
  );
}
