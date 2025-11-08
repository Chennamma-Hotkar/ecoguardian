import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Car, Zap, UtensilsCrossed, ShoppingBag } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { id: "transportation", label: "Transportation", icon: Car, color: "bg-blue-600" },
  { id: "energy", label: "Energy", icon: Zap, color: "bg-yellow-600" },
  { id: "food", label: "Food", icon: UtensilsCrossed, color: "bg-green-600" },
  { id: "shopping", label: "Shopping", icon: ShoppingBag, color: "bg-purple-600" },
];

export default function Calculator() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createEntryMutation = useMutation({
    mutationFn: async (data: { category: string; amount: number; description?: string }) => {
      return await apiRequest("/api/carbon-entries", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Entry added!",
        description: "Your carbon footprint has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/carbon-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/carbon-entries/stats"] });
      setAmount("");
      setDescription("");
      setSelectedCategory(null);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add entry",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !amount) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a positive number",
        variant: "destructive",
      });
      return;
    }

    createEntryMutation.mutate({
      category: selectedCategory,
      amount: numAmount,
      description: description || undefined,
    });
  };

  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Carbon Calculator</h1>
          <p className="text-muted-foreground">Track your environmental impact by category</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                className="hover-elevate cursor-pointer"
                onClick={() => setSelectedCategory(category.id)}
                data-testid={`category-${category.id}`}
              >
                <CardContent className="p-6 space-y-4">
                  <div className={`h-16 w-16 rounded-full ${category.color} flex items-center justify-center mx-auto`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">{category.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.id === "transportation" && "Track your commute, flights, and vehicle emissions"}
                      {category.id === "energy" && "Monitor electricity, heating, and home energy usage"}
                      {category.id === "food" && "Log your meals and dietary carbon footprint"}
                      {category.id === "shopping" && "Record purchases and consumer goods impact"}
                    </p>
                  </div>
                  <Button className="w-full" data-testid={`button-calculate-${category.id}`}>
                    Calculate
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  const category = categories.find(c => c.id === selectedCategory)!;
  const Icon = category.icon;

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="outline"
          onClick={() => setSelectedCategory(null)}
          className="mb-4"
          data-testid="button-back"
        >
          ← Back to Categories
        </Button>
        <h1 className="text-3xl font-bold">{category.label} Calculator</h1>
        <p className="text-muted-foreground">Add a new carbon footprint entry</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-full ${category.color} flex items-center justify-center`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle>Calculate {category.label} Impact</CardTitle>
              <CardDescription>Enter the details of your activity</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Carbon Amount (kg CO₂)</Label>
              <Input
                id="amount"
                type="number"
                step="0.1"
                placeholder="e.g., 5.5"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                data-testid="input-amount"
              />
              <p className="text-xs text-muted-foreground">
                Enter the estimated carbon footprint in kilograms
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="e.g., Daily commute to work, 20 miles"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                data-testid="input-description"
              />
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Quick Reference:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {category.id === "transportation" && (
                  <>
                    <li>• Car (10 miles): ~4.5 kg CO₂</li>
                    <li>• Bus (10 miles): ~1 kg CO₂</li>
                    <li>• Flight (100 miles): ~90 kg CO₂</li>
                  </>
                )}
                {category.id === "energy" && (
                  <>
                    <li>• 1 kWh electricity: ~0.4 kg CO₂</li>
                    <li>• Gas heating (day): ~5 kg CO₂</li>
                    <li>• AC usage (day): ~3 kg CO₂</li>
                  </>
                )}
                {category.id === "food" && (
                  <>
                    <li>• Beef meal: ~6.6 kg CO₂</li>
                    <li>• Chicken meal: ~1.5 kg CO₂</li>
                    <li>• Vegetarian meal: ~0.5 kg CO₂</li>
                  </>
                )}
                {category.id === "shopping" && (
                  <>
                    <li>• New smartphone: ~80 kg CO₂</li>
                    <li>• T-shirt: ~7 kg CO₂</li>
                    <li>• Jeans: ~33 kg CO₂</li>
                  </>
                )}
              </ul>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedCategory(null)}
                className="flex-1"
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createEntryMutation.isPending}
                data-testid="button-submit-entry"
              >
                {createEntryMutation.isPending ? "Adding..." : "Add Entry"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
