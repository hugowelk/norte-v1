import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LANG_LABELS, SUPPORTED_LANGS, setLang } from '@/i18n';
import { useLang } from '@/i18n/useLang';

interface Props {
  variant?: 'footer' | 'inline';
}

export function LanguagePicker({ variant = 'footer' }: Props) {
  const { lang } = useLang();

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
        <span>{LANG_LABELS[lang]}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {SUPPORTED_LANGS.map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLang(code)}
            className={code === lang ? 'font-medium text-foreground' : ''}
          >
            {LANG_LABELS[code]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
