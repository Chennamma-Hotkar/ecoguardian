import StatCard from "@/components/StatCard";
import CarbonChart from "@/components/CarbonChart";
import CategoryCard from "@/components/CategoryCard";
import { Leaf, TrendingDown, Target, Trophy, Car, Zap, UtensilsCrossed } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { CarbonEntry } from "@shared/schema";

export default function Dashboard() {
  const { data: entries = [], isLoading: entriesLoading } = useQuery<CarbonEntry[]>({
    queryKey: ["/api/carbon-entries"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<{
    total: number;
    monthTotal: number;
    categoryBreakdown: Record<string, number>;
    entryCount: number;
  }>({
    queryKey: ["/api/carbon-entries/stats"],
  });

  if (entriesLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalCarbonTons = (stats?.total || 0) / 1000;
  const monthTotalKg = stats?.monthTotal || 0;
  const categoryBreakdown = stats?.categoryBreakdown || {};

  const goalTarget = 75;
  const goalProgress = monthTotalKg > 0 ? Math.min((monthTotalKg / goalTarget) * 100, 100) : 0;

  const recentActivities = entries.slice(0, 4).map(entry => ({
    action: entry.description || `${entry.category} activity`,
    date: new Date(entry.date).toLocaleDateString(),
    impact: `-${entry.amount.toFixed(1)} kg CO₂`,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Track your environmental impact</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Carbon"
          value={`${totalCarbonTons.toFixed(2)} tons`}
          change="15%"
          trend="down"
          icon={Leaf}
          iconColor="text-green-600"
        />
        <StatCard
          title="This Month"
          value={`${monthTotalKg.toFixed(0)} kg`}
          change="8%"
          trend="down"
          icon={TrendingDown}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Goal Progress"
          value={`${goalProgress.toFixed(0)}%`}
          icon={Target}
          iconColor="text-orange-600"
        />
        <StatCard
          title="Total Entries"
          value={`${stats?.entryCount || 0}`}
          icon={Trophy}
          iconColor="text-yellow-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CarbonChart />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2 rounded hover-elevate">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">{activity.impact}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No activities yet</p>
                <p className="text-sm">Start tracking your carbon footprint!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CategoryCard
            title="Transportation"
            icon={Car}
            value={`${(categoryBreakdown.transportation || 0).toFixed(0)} kg`}
            percentage={categoryBreakdown.transportation ? Math.min((categoryBreakdown.transportation / goalTarget) * 100, 100) : 0}
            color="bg-blue-600"
          />
          <CategoryCard
            title="Energy"
            icon={Zap}
            value={`${(categoryBreakdown.energy || 0).toFixed(0)} kg`}
            percentage={categoryBreakdown.energy ? Math.min((categoryBreakdown.energy / goalTarget) * 100, 100) : 0}
            color="bg-yellow-600"
          />
          <CategoryCard
            title="Food"
            icon={UtensilsCrossed}
            value={`${(categoryBreakdown.food || 0).toFixed(0)} kg`}
            percentage={categoryBreakdown.food ? Math.min((categoryBreakdown.food / goalTarget) * 100, 100) : 0}
            color="bg-green-600"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Goal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Reduce to {goalTarget} kg CO₂</span>
              <span className="text-sm text-muted-foreground">{monthTotalKg.toFixed(0)}/{goalTarget} kg</span>
            </div>
            <Progress value={goalProgress} className="h-2" />
          </div>
          <p className="text-sm text-muted-foreground">
            {monthTotalKg < goalTarget
              ? `Great job! You're ${(goalTarget - monthTotalKg).toFixed(0)} kg below your goal.`
              : monthTotalKg === 0
              ? "Start tracking your carbon footprint to see your progress!"
              : `You're ${(monthTotalKg - goalTarget).toFixed(0)} kg over your goal. Keep going!`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
