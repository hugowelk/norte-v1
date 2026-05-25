// Helpers to get translated copy for values and scenarios.
// Structural data (icons, weights, keys, maxScore) stays in values.ts / algorithm.ts.

import type { TFunction } from 'i18next';
import { VALUES, type ValueKey } from '@/lib/values';
import type { Scenario } from '@/lib/algorithm';

export function tValueLabel(t: TFunction, key: ValueKey): string {
  return t(`values.${key}.label`);
}
export function tValueLabelLower(t: TFunction, key: ValueKey): string {
  return t(`values.${key}.labelLower`);
}
export function tValueDescription(t: TFunction, key: ValueKey): string {
  return t(`values.${key}.description`);
}
export function tValueLongDescription(t: TFunction, key: ValueKey): string {
  return t(`values.${key}.longDescription`);
}
export function tValueExplanation(t: TFunction, key: ValueKey) {
  return {
    definition: t(`values.${key}.definition`),
    pattern: t(`values.${key}.pattern`),
    cost: t(`values.${key}.cost`),
    themes: t(`values.${key}.themes`, { returnObjects: true }) as string[],
  };
}

export function tScenarioPrompt(t: TFunction, scenario: Scenario): string {
  return t(`quiz.scenarios.${scenario.id}.prompt`);
}
export function tScenarioOption(t: TFunction, scenario: Scenario, which: 'A' | 'B'): string {
  return t(`quiz.scenarios.${scenario.id}.option${which}`);
}
export function tScenarioTransition(t: TFunction, scenario: Scenario): string | undefined {
  if (!scenario.transitionAfter) return undefined;
  return t(`quiz.scenarios.${scenario.id}.transitionAfter`, { defaultValue: scenario.transitionAfter });
}

export function tOrdinal(t: TFunction, n: number): string {
  return t(`ordinals.${n}`, { defaultValue: `${n}` });
}

// First sentence of definition, for compact secondary cards.
export function getValueOneLinerI18n(t: TFunction, key: ValueKey): string {
  const def = t(`values.${key}.definition`);
  const m = def.match(/^[^.]+\./);
  return m ? m[0] : def;
}

export { VALUES };
