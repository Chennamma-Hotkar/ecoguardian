import StatCard from '../StatCard';
import { Leaf, TrendingDown, Target, Trophy } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
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
  );
}
