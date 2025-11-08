import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Brain, Calendar, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AnalyticsData {
  dailyTotals: Array<{ date: string; amount: number }>;
  categoryTrends: Record<string, Array<{ date: string; amount: number }>>;
  weekOverWeekChange: number;
  thisWeekTotal: number;
  lastWeekTotal: number;
  topCategory: { category: string; amount: number } | null;
  totalEntries: number;
  averageDaily: number;
}

export default function Analytics() {
  const { data, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/carbon-entries/analytics"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Analyzing your data...</p>
        </div>
      </div>
    );
  }

  if (!data || data.totalEntries === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Smart Analytics</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Data to Analyze</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking your carbon footprint to see intelligent insights and trends!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const chartData = data.dailyTotals.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount: parseFloat(item.amount.toFixed(1)),
  }));

  const categoryChartData = Object.keys(data.categoryTrends).map(category => {
    const total = data.categoryTrends[category].reduce((sum, item) => sum + item.amount, 0);
    return {
      category: category.charAt(0).toUpperCase() + category.slice(1),
      amount: parseFloat(total.toFixed(1)),
    };
  });

  const getInsights = () => {
    const insights: string[] = [];
    
    if (data.weekOverWeekChange < -10) {
      insights.push(`Great progress! You've reduced emissions by ${Math.abs(data.weekOverWeekChange).toFixed(1)}% this week.`);
    } else if (data.weekOverWeekChange > 10) {
      insights.push(`Emissions increased by ${data.weekOverWeekChange.toFixed(1)}% this week. Consider reviewing your recent activities.`);
    } else {
      insights.push(`Your emissions are stable week-over-week. Keep up the consistency!`);
    }
    
    if (data.topCategory) {
      const categoryName = data.topCategory.category.charAt(0).toUpperCase() + data.topCategory.category.slice(1);
      const percentage = ((data.topCategory.amount / data.dailyTotals.reduce((sum, d) => sum + d.amount, 0)) * 100).toFixed(0);
      insights.push(`${categoryName} is your largest impact category at ${percentage}% of total emissions.`);
    }
    
    if (data.averageDaily > 0) {
      const monthlyProjection = data.averageDaily * 30;
      insights.push(`At your current rate, you're on track for ${monthlyProjection.toFixed(1)} kg CO₂ this month.`);
    }
    
    return insights;
  };

  const insights = getInsights();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Smart Analytics</h1>
        <p className="text-muted-foreground">AI-powered insights from your carbon data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.thisWeekTotal.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground">
              Last week: {data.lastWeekTotal.toFixed(1)} kg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Change</CardTitle>
            {data.weekOverWeekChange < 0 ? (
              <TrendingDown className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingUp className="h-4 w-4 text-orange-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.weekOverWeekChange < 0 ? 'text-green-500' : 'text-orange-500'}`}>
              {data.weekOverWeekChange > 0 ? '+' : ''}{data.weekOverWeekChange.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Compared to last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.averageDaily.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Insights
          </CardTitle>
          <CardDescription>Intelligent analysis of your carbon footprint patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                <p className="text-sm flex-1">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>30-Day Carbon Trend</CardTitle>
          <CardDescription>Your daily emissions over the last month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Total emissions by category (last 30 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {data.topCategory && (
        <Card>
          <CardHeader>
            <CardTitle>Top Impact Category</CardTitle>
            <CardDescription>Your highest emissions source</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <Badge variant="default" className="mt-1">
                  {data.topCategory.category.charAt(0).toUpperCase() + data.topCategory.category.slice(1)}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Impact</p>
                <p className="text-2xl font-bold">{data.topCategory.amount.toFixed(1)} kg CO₂</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
