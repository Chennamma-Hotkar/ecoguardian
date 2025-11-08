import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Plus } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Goal } from "@shared/schema";

export default function Goals() {
  const [showForm, setShowForm] = useState(false);
  const [targetAmount, setTargetAmount] = useState("");
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("monthly");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });

  const createGoalMutation = useMutation({
    mutationFn: async (data: { targetAmount: number; period: string }) => {
      return await apiRequest("/api/goals", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Goal created!",
        description: "Your new carbon reduction goal has been set.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      setShowForm(false);
      setTargetAmount("");
      setPeriod("monthly");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create goal",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(targetAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a positive number",
        variant: "destructive",
      });
      return;
    }
    createGoalMutation.mutate({ targetAmount: amount, period });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Carbon Reduction Goals</h1>
          <p className="text-muted-foreground">Set and track your sustainability targets</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} data-testid="button-new-goal">
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Goal</CardTitle>
            <CardDescription>Set a target for your carbon footprint reduction</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target">Target Amount (kg CO₂)</Label>
                <Input
                  id="target"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 75"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                  data-testid="input-target-amount"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
                  <SelectTrigger data-testid="select-period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                  data-testid="button-cancel-goal"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createGoalMutation.isPending}
                  data-testid="button-submit-goal"
                >
                  {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {goals.length > 0 ? (
          goals.map((goal, index) => (
            <Card key={goal.id} className="hover-elevate" data-testid={`goal-card-${index}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  {goal.period.charAt(0).toUpperCase() + goal.period.slice(1)} Goal
                </CardTitle>
                <CardDescription>
                  Target: {goal.targetAmount} kg CO₂ per {goal.period}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created on {new Date(goal.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Goals Yet</h3>
              <p className="text-muted-foreground mb-4">
                Set your first carbon reduction goal to start tracking progress!
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
