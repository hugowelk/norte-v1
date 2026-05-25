import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  createdAts: string[];
}

const DAYS = 7;

export const ReportsChart = ({ createdAts }: Props) => {
  const data = useMemo(() => {
    const days: { key: string; label: string; count: number }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString(undefined, { weekday: "short", day: "numeric" });
      days.push({ key, label, count: 0 });
    }
    const idx = new Map(days.map((d, i) => [d.key, i]));
    for (const ts of createdAts) {
      const k = new Date(ts).toISOString().slice(0, 10);
      const i = idx.get(k);
      if (i !== undefined) days[i].count += 1;
    }
    return days;
  }, [createdAts]);

  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <Card className="p-5">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h3 className="font-display text-base text-primary">Reports — last 7 days</h3>
          <p className="text-xs text-muted-foreground">{total} reports generated</p>
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ReportsChart;
