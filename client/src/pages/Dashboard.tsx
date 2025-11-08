import StatCard from "@/components/StatCard";
import CarbonChart from "@/components/CarbonChart";
import CategoryCard from "@/components/CategoryCard";
import { Leaf, TrendingDown, Target, Trophy, Car, Zap, UtensilsCrossed } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const recentActivities = [
  { action: "Used public transport", date: "2 hours ago", impact: "-3 kg CO₂" },
  { action: "Bought reusable bag", date: "1 day ago", impact: "-1 kg CO₂" },
  { action: "Vegetarian meal", date: "2 days ago", impact: "-2 kg CO₂" },
  { action: "Recycled electronics", date: "3 days ago", impact: "-5 kg CO₂" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Track your environmental impact</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Carbon"
          value="1.2 tons"
          change="15%"
          trend="down"
          icon={Leaf}
          iconColor="text-green-600"
        />
        <StatCard
          title="This Month"
          value="85 kg"
          change="8%"
          trend="down"
          icon={TrendingDown}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Goal Progress"
          value="72%"
          icon={Target}
          iconColor="text-orange-600"
        />
        <StatCard
          title="Rank"
          value="#234"
          change="12 spots"
          trend="down"
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
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2 rounded hover-elevate">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
                <span className="text-sm font-semibold text-green-600">{activity.impact}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CategoryCard
            title="Transportation"
            icon={Car}
            value="45 kg"
            percentage={75}
            color="bg-blue-600"
          />
          <CategoryCard
            title="Energy"
            icon={Zap}
            value="32 kg"
            percentage={53}
            color="bg-yellow-600"
          />
          <CategoryCard
            title="Food"
            icon={UtensilsCrossed}
            value="18 kg"
            percentage={30}
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
              <span className="text-sm font-medium">Reduce to 75 kg CO₂</span>
              <span className="text-sm text-muted-foreground">85/75 kg</span>
            </div>
            <Progress value={88} className="h-2" />
          </div>
          <p className="text-sm text-muted-foreground">
            You're almost there! Reduce 10 kg more to reach your goal.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
