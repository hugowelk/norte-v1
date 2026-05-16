import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function ReportNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-6">
        <h1 className="font-display text-3xl text-foreground">This report doesn't exist</h1>
        <p className="text-muted-foreground">
          The link you followed may be wrong, or the report may have been removed.
        </p>
        <Button asChild size="lg">
          <Link to="/">Take Norte yourself →</Link>
        </Button>
      </div>
    </div>
  );
}
