import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  initialName?: string;
  initialEmail?: string;
  onContinue: (name: string, email: string) => void;
}

export function NameEmailCapture({ initialName = '', initialEmail = '', onContinue }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  const submit = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) { setError(t('quiz.nameEmail.errors.name')); return; }
    if (!EMAIL_RE.test(trimmedEmail)) { setError(t('quiz.nameEmail.errors.email')); return; }
    onContinue(trimmedName, trimmedEmail);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
          {t('quiz.nameEmail.title')}
        </h1>
        <p className="text-sm text-muted-foreground italic">{t('quiz.nameEmail.subtitle')}</p>
      </div>

      <div className="space-y-3">
        <input
          ref={nameRef}
          type="text"
          maxLength={30}
          placeholder={t('quiz.nameEmail.namePlaceholder')}
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit(); }}
          className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card focus:border-primary focus:outline-none font-body text-base text-foreground"
        />
        <input
          type="email"
          maxLength={120}
          placeholder={t('quiz.nameEmail.emailPlaceholder')}
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit(); }}
          className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card focus:border-primary focus:outline-none font-body text-base text-foreground"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        onClick={submit}
        className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-display font-medium text-base hover:opacity-90 transition-opacity"
      >
        {t('common.actions.continueArrow')}
      </button>
    </div>
  );
}
