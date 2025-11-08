import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const dailyData = [
  { name: "Mon", carbon: 12 },
  { name: "Tue", carbon: 15 },
  { name: "Wed", carbon: 10 },
  { name: "Thu", carbon: 18 },
  { name: "Fri", carbon: 14 },
  { name: "Sat", carbon: 8 },
  { name: "Sun", carbon: 6 },
];

const weeklyData = [
  { name: "Week 1", carbon: 85 },
  { name: "Week 2", carbon: 92 },
  { name: "Week 3", carbon: 78 },
  { name: "Week 4", carbon: 88 },
];

const monthlyData = [
  { name: "Jan", carbon: 320 },
  { name: "Feb", carbon: 285 },
  { name: "Mar", carbon: 310 },
  { name: "Apr", carbon: 275 },
  { name: "May", carbon: 295 },
  { name: "Jun", carbon: 260 },
];

export default function CarbonChart() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  
  const data = period === "daily" ? dailyData : period === "weekly" ? weeklyData : monthlyData;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
        <CardTitle>Carbon Footprint Trend</CardTitle>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as any)}>
          <TabsList>
            <TabsTrigger value="daily" data-testid="tab-daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly" data-testid="tab-weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" data-testid="tab-monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="carbon" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
