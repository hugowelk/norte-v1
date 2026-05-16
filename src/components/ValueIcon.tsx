import { getValueByKey, type ValueKey } from '@/lib/values';
import { cn } from '@/lib/utils';

interface Props {
  value: ValueKey;
  size?: number;
  className?: string;
}

export function ValueIcon({ value, size = 20, className }: Props) {
  const v = getValueByKey(value);
  const Icon = v.icon;
  return <Icon size={size} className={cn('text-accent', className)} strokeWidth={1.75} />;
}
