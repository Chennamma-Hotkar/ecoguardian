import ProductCard from '../ProductCard';
import bottleImage from '@assets/generated_images/Reusable_water_bottle_product_3de846b6.png';
import toothbrushImage from '@assets/generated_images/Bamboo_toothbrush_product_716afcae.png';
import bagImage from '@assets/generated_images/Reusable_shopping_bag_product_5094c408.png';
import chargerImage from '@assets/generated_images/Solar_charger_product_34767e19.png';

export default function ProductCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <ProductCard
        image={bottleImage}
        name="Eco Steel Bottle"
        price="$24.99"
        carbonSaving="12 kg"
        ecoScore={9}
        category="Reusables"
      />
      <ProductCard
        image={toothbrushImage}
        name="Bamboo Brush Set"
        price="$12.99"
        carbonSaving="3 kg"
        ecoScore={8}
        category="Personal Care"
      />
      <ProductCard
        image={bagImage}
        name="Organic Cotton Bag"
        price="$15.99"
        carbonSaving="8 kg"
        ecoScore={9}
        category="Shopping"
      />
      <ProductCard
        image={chargerImage}
        name="Solar Power Bank"
        price="$39.99"
        carbonSaving="15 kg"
        ecoScore={10}
        category="Electronics"
      />
    </div>
  );
}
