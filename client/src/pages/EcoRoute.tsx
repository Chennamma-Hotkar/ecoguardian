import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Navigation, Fuel, Leaf, Clock, TrendingDown, Route, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RouteData {
  standardRoute: {
    distance: number;
    time: number;
    fuel: number;
    co2: number;
    traffic: string;
  };
  ecoRoute: {
    distance: number;
    time: number;
    fuel: number;
    co2: number;
    traffic: string;
    waypoints: Array<{ lat: number; lng: number; name: string }>;
  };
  savings: {
    fuel: number;
    co2: number;
    cost: number;
  };
}

export default function EcoRoute() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [routeData, setRouteData] = useState<RouteData | null>(null);

  const calculateRouteMutation = useMutation({
    mutationFn: async (data: { start: string; end: string }) => {
      const response = await apiRequest("/api/eco-route", "POST", data);
      return response as RouteData;
    },
    onSuccess: (data) => {
      setRouteData(data);
    },
  });

  const handleCalculate = () => {
    if (start && end) {
      calculateRouteMutation.mutate({ start, end });
    }
  };

  const getTrafficColor = (traffic: string) => {
    if (traffic === "Low") return "text-green-500";
    if (traffic === "Moderate") return "text-yellow-500";
    return "text-red-500";
  };

  const getTrafficBadgeVariant = (traffic: string) => {
    if (traffic === "Low") return "default";
    if (traffic === "Moderate") return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Eco-Route Navigator</h1>
        <p className="text-muted-foreground">Find the most sustainable route and save fuel & CO₂</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Route Calculator
          </CardTitle>
          <CardDescription>Enter your start and end locations to find the eco-friendly route</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="start">Start Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="start"
                  placeholder="e.g., Downtown, Central Park"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="pl-10"
                  data-testid="input-start-location"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">Destination</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="end"
                  placeholder="e.g., Airport, Shopping Mall"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="pl-10"
                  data-testid="input-end-location"
                />
              </div>
            </div>
          </div>
          <Button
            onClick={handleCalculate}
            disabled={!start || !end || calculateRouteMutation.isPending}
            className="w-full"
            data-testid="button-calculate-route"
          >
            {calculateRouteMutation.isPending ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Calculating...
              </>
            ) : (
              <>
                <Route className="h-4 w-4 mr-2" />
                Calculate Eco-Route
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {routeData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fuel Saved</CardTitle>
                <Fuel className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {routeData.savings.fuel} L
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ${routeData.savings.cost.toFixed(2)} in fuel costs
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/50 bg-blue-50 dark:bg-blue-950/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CO₂ Reduced</CardTitle>
                <Leaf className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {routeData.savings.co2} kg
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Carbon emissions saved
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/50 bg-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eco Score</CardTitle>
                <TrendingDown className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {Math.round((routeData.savings.co2 / routeData.standardRoute.co2) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Emissions reduction
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5 text-muted-foreground" />
                  Standard Route
                </CardTitle>
                <CardDescription>Fastest route based on traffic</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Distance</span>
                  <span className="font-semibold">{routeData.standardRoute.distance} km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Estimated Time
                  </span>
                  <span className="font-semibold">{routeData.standardRoute.time} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Fuel className="h-3 w-3" />
                    Fuel Consumption
                  </span>
                  <span className="font-semibold">{routeData.standardRoute.fuel} L</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Leaf className="h-3 w-3" />
                    CO₂ Emissions
                  </span>
                  <span className="font-semibold">{routeData.standardRoute.co2} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Traffic
                  </span>
                  <Badge variant={getTrafficBadgeVariant(routeData.standardRoute.traffic)}>
                    {routeData.standardRoute.traffic}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Eco-Friendly Route
                </CardTitle>
                <CardDescription>Optimized for fuel efficiency & lower emissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Distance</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {routeData.ecoRoute.distance} km
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Estimated Time
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {routeData.ecoRoute.time} min
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Fuel className="h-3 w-3" />
                    Fuel Consumption
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {routeData.ecoRoute.fuel} L
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Leaf className="h-3 w-3" />
                    CO₂ Emissions
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {routeData.ecoRoute.co2} kg
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Traffic
                  </span>
                  <Badge variant={getTrafficBadgeVariant(routeData.ecoRoute.traffic)}>
                    {routeData.ecoRoute.traffic}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Route Visualization
              </CardTitle>
              <CardDescription>Interactive map showing your eco-friendly route</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 800 400" className="absolute inset-0">
                  <defs>
                    <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                  
                  <rect width="800" height="400" fill="hsl(var(--muted))" />
                  
                  <path
                    d="M 100 350 Q 200 280, 300 250 T 500 200 T 700 100"
                    stroke="url(#roadGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                  
                  <path
                    d="M 100 350 Q 250 320, 350 280 T 550 180 T 700 100"
                    stroke="hsl(var(--primary))"
                    strokeWidth="6"
                    fill="none"
                  />

                  {routeData.ecoRoute.waypoints.map((point, index) => {
                    const x = 100 + (index * 200);
                    const y = 350 - (index * 75);
                    return (
                      <g key={index}>
                        <circle
                          cx={x}
                          cy={y}
                          r="8"
                          fill={index === 0 ? "hsl(var(--primary))" : index === routeData.ecoRoute.waypoints.length - 1 ? "hsl(var(--destructive))" : "hsl(var(--accent))"}
                          stroke="white"
                          strokeWidth="2"
                        />
                        <text
                          x={x}
                          y={y + 25}
                          textAnchor="middle"
                          className="fill-foreground text-xs font-medium"
                        >
                          {point.name}
                        </text>
                      </g>
                    );
                  })}
                  
                  <g transform="translate(680, 80)">
                    <circle r="12" fill="hsl(var(--primary))" className="animate-pulse" />
                    <path
                      d="M 0 -6 L 4 6 L 0 3 L -4 6 Z"
                      fill="white"
                    />
                  </g>
                </svg>

                <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur p-3 rounded-lg shadow-lg border">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-primary"></div>
                      <span className="text-xs">Eco Route</span>
                    </div>
                    <div className="flex items-center gap-1 ml-3">
                      <div className="h-3 w-3 rounded-full bg-primary/30"></div>
                      <span className="text-xs">Standard Route</span>
                    </div>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur px-3 py-2 rounded-lg shadow-lg text-white">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    <span className="text-sm font-semibold">-{routeData.savings.co2} kg CO₂</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                {routeData.ecoRoute.waypoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                  >
                    <div className={`h-2 w-2 rounded-full ${
                      index === 0 ? "bg-primary" : 
                      index === routeData.ecoRoute.waypoints.length - 1 ? "bg-destructive" : 
                      "bg-accent"
                    }`}></div>
                    <span className="text-xs font-medium truncate">{point.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
