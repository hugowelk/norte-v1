# Fix scenario counter to say "of 15"

The trade-off question header currently reads `{index + 1} of 13`. It should read `{index + 1} of 15` to match the actual 15-scenario set.

## Change
- `src/components/quiz/TradeoffScenario.tsx`: replace the hardcoded `13` with `15` (or, better, derive from `SCENARIOS.length` for safety).
