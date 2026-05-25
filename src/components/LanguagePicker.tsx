import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AVAILABLE_LOCALES, LANG_LABELS, setLang } from '@/i18n';
import { useLang } from '@/i18n/useLang';

interface Props {
  variant?: 'footer' | 'inline';
}

export function LanguagePicker({ variant = 'footer' }: Props) {
  const { lang } = useLang();

  // Hide the picker entirely if only one language is shipped & complete.
  if (AVAILABLE_LOCALES.length < 2) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={
          variant === 'footer'
            ? 'inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-display'
            : 'inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors'
        }
        aria-label="Language"
      >
        <Globe size={14} strokeWidth={1.75} />
        <span>{LANG_LABELS[lang] ?? lang}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {AVAILABLE_LOCALES.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => setLang(locale.code)}
            className={locale.code === lang ? 'font-medium text-foreground' : ''}
          >
            {locale.nativeLabel}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
