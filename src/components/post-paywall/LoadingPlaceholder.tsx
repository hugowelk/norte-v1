import { PostPaywallLayout } from './PostPaywallLayout';

export function LoadingPlaceholder() {
  return (
    <PostPaywallLayout step={4}>
      <h1 className="text-2xl md:text-3xl font-display font-semibold text-foreground leading-tight">
        Generation will happen here.
      </h1>
      <p className="text-base text-muted-foreground">
        The loading screen and AI report generation are coming in the next prompt.
      </p>
    </PostPaywallLayout>
  );
}
