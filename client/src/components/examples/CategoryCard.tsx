import CategoryCard from '../CategoryCard';
import { Car, Zap, UtensilsCrossed } from 'lucide-react';

export default function CategoryCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
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
  );
}
