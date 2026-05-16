import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostPaywallLayout } from './PostPaywallLayout';
import { usePostPaywallStore } from '@/lib/postPaywallStore';

export function Q1Name() {
  const navigate = useNavigate();
  const { state, update } = usePostPaywallStore();
  const [value, setValue] = useState(state.name);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { ref.current?.focus(); }, []);

  const submit = (name: string) => {
    update({ name });
    navigate('/post-paywall/q2');
  };

  return (
    <PostPaywallLayout step={1}>
      <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
        What should we call you in your report?
      </h1>
      <p className="text-sm text-muted-foreground italic">
        Optional. Just your first name, or whatever you'd like to be called.
      </p>

      <input
        ref={ref}
        type="text"
        maxLength={30}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') submit(value.trim()); }}
        className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card focus:border-primary focus:outline-none font-body text-base text-foreground"
      />

      <button
        onClick={() => submit('')}
        className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline font-display"
      >
        Skip
      </button>

      <button
        onClick={() => submit(value.trim())}
        className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-display font-medium text-base hover:opacity-90 transition-opacity"
      >
        Continue →
      </button>
    </PostPaywallLayout>
  );
}
