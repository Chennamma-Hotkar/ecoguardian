import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Recycle, Zap, ShoppingBag, Navigation } from "lucide-react";
import { useState } from "react";

const locations = [
  { id: 1, name: "GreenCharge Station", type: "charging", distance: "0.3 mi", rating: 4.8, address: "123 Main St", hours: "24/7" },
  { id: 2, name: "EcoRecycle Center", type: "recycling", distance: "0.5 mi", rating: 4.6, address: "456 Oak Ave", hours: "Mon-Sat 8AM-6PM" },
  { id: 3, name: "Organic Farmers Market", type: "market", distance: "0.7 mi", rating: 4.9, address: "789 Green Blvd", hours: "Daily 7AM-8PM" },
  { id: 4, name: "Solar Hub EV Charging", type: "charging", distance: "1.2 mi", rating: 4.7, address: "321 Energy Ln", hours: "24/7" },
  { id: 5, name: "Zero Waste Store", type: "market", distance: "0.9 mi", rating: 4.8, address: "555 Eco Way", hours: "Mon-Sun 9AM-7PM" },
  { id: 6, name: "Community Composting", type: "recycling", distance: "1.5 mi", rating: 4.5, address: "888 Nature Dr", hours: "Tue-Sun 7AM-5PM" },
  { id: 7, name: "Tesla Supercharger", type: "charging", distance: "2.1 mi", rating: 4.9, address: "999 Tech Pkwy", hours: "24/7" },
  { id: 8, name: "Whole Foods Co-op", type: "market", distance: "1.8 mi", rating: 4.7, address: "222 Local St", hours: "Daily 8AM-9PM" },
  { id: 9, name: "Electronics Recycling Drop-off", type: "recycling", distance: "2.3 mi", rating: 4.4, address: "444 Recycle Rd", hours: "Wed-Sat 10AM-4PM" },
  { id: 10, name: "Fast Charge Station", type: "charging", distance: "0.4 mi", rating: 4.6, address: "111 Power Ave", hours: "24/7" },
  { id: 11, name: "Sustainable Marketplace", type: "market", distance: "1.1 mi", rating: 4.8, address: "666 Earth Ln", hours: "Daily 9AM-8PM" },
  { id: 12, name: "Battery Recycling Center", type: "recycling", distance: "3.0 mi", rating: 4.7, address: "777 Clean St", hours: "Mon-Fri 9AM-5PM" },
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
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs">⭐ {location.rating}</span>
                        <span className="text-xs text-muted-foreground">{location.distance}</span>
                        <span className="text-xs text-muted-foreground">• {(location as any).hours}</span>
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
