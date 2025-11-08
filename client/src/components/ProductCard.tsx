import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Leaf, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  image: string;
  name: string;
  price: string;
  carbonSaving: string;
  ecoScore: number;
  category: string;
}

export default function ProductCard({ 
  image, 
  name, 
  price, 
  carbonSaving, 
  ecoScore,
  category 
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate cursor-pointer" data-testid={`product-card-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="aspect-square relative overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={name}
          className="object-cover w-full h-full"
        />
        <Badge className="absolute top-2 right-2 bg-green-600">
          <Leaf className="h-3 w-3 mr-1" />
          {ecoScore}/10
        </Badge>
      </div>
      <CardContent className="p-4">
        <Badge variant="outline" className="mb-2">{category}</Badge>
        <h3 className="font-semibold mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Saves {carbonSaving} CO₂/year
        </p>
        <p className="text-lg font-bold text-primary">{price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" variant="outline" data-testid={`button-add-${name.toLowerCase().replace(/\s+/g, '-')}`}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
