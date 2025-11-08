import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Recommendations() {
  const { data, isLoading, refetch, isRefetching } = useQuery<{ recommendations: string[] }>({
    queryKey: ["/api/recommendations"],
  });

  const recommendations = data?.recommendations || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Recommendations</h1>
          <p className="text-muted-foreground">Personalized sustainable product suggestions</p>
        </div>
        <Button
          onClick={() => refetch()}
          disabled={isRefetching}
          data-testid="button-refresh-recommendations"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Generating personalized recommendations...</p>
          </div>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <Card key={index} className="hover-elevate" data-testid={`recommendation-${index}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Recommendation {index + 1}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{recommendation}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking your carbon footprint to get personalized product recommendations!
            </p>
            <Button onClick={() => window.location.href = '/calculator'}>
              Track Carbon Footprint
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
