import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Recycle, Zap, ShoppingBag, Navigation } from "lucide-react";
import { useState } from "react";

const locations = [
  { id: 1, name: "GreenCharge Station", type: "charging", distance: "0.3 mi", rating: 4.8, address: "123 Main St" },
  { id: 2, name: "EcoRecycle Center", type: "recycling", distance: "0.5 mi", rating: 4.6, address: "456 Oak Ave" },
  { id: 3, name: "Organic Market", type: "market", distance: "0.7 mi", rating: 4.9, address: "789 Green Blvd" },
  { id: 4, name: "Solar Hub", type: "charging", distance: "1.2 mi", rating: 4.7, address: "321 Energy Ln" },
];

const typeIcons = {
  charging: Zap,
  recycling: Recycle,
  market: ShoppingBag,
};

const typeColors = {
  charging: "bg-yellow-500",
  recycling: "bg-green-500",
  market: "bg-blue-500",
};

export default function MapModule() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredLocations = locations.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !activeFilter || loc.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eco-Friendly Locations Near You</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-map-search"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge 
            variant={activeFilter === "charging" ? "default" : "outline"}
            className="cursor-pointer hover-elevate"
            onClick={() => setActiveFilter(activeFilter === "charging" ? null : "charging")}
            data-testid="filter-charging"
          >
            <Zap className="h-3 w-3 mr-1" />
            Charging
          </Badge>
          <Badge 
            variant={activeFilter === "recycling" ? "default" : "outline"}
            className="cursor-pointer hover-elevate"
            onClick={() => setActiveFilter(activeFilter === "recycling" ? null : "recycling")}
            data-testid="filter-recycling"
          >
            <Recycle className="h-3 w-3 mr-1" />
            Recycling
          </Badge>
          <Badge 
            variant={activeFilter === "market" ? "default" : "outline"}
            className="cursor-pointer hover-elevate"
            onClick={() => setActiveFilter(activeFilter === "market" ? null : "market")}
            data-testid="filter-market"
          >
            <ShoppingBag className="h-3 w-3 mr-1" />
            Markets
          </Badge>
        </div>

        <div className="h-64 bg-muted rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <MapPin className="h-12 w-12" />
          </div>
          <div className="absolute top-2 left-2 right-2 text-xs text-muted-foreground bg-card/80 backdrop-blur-sm p-2 rounded">
            Interactive map showing eco-friendly locations
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredLocations.map(location => {
            const Icon = typeIcons[location.type as keyof typeof typeIcons];
            const colorClass = typeColors[location.type as keyof typeof typeColors];
            
            return (
              <Card key={location.id} className="hover-elevate cursor-pointer" data-testid={`location-card-${location.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold">{location.name}</h4>
                      <p className="text-sm text-muted-foreground">{location.address}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs">⭐ {location.rating}</span>
                        <span className="text-xs text-muted-foreground">{location.distance}</span>
                      </div>
                    </div>
                    <Button size="icon" variant="outline" data-testid={`button-navigate-${location.id}`}>
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
