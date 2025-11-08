import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, RefreshCw, Home, Send } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import bedroomImage from "@assets/generated_images/Sustainable_bedroom_with_eco_furniture_d9ade003.png";
import livingRoomImage from "@assets/generated_images/Sustainable_living_room_eco_design_4d099e2b.png";
import kitchenImage from "@assets/generated_images/Sustainable_kitchen_eco_design_d360f33b.png";
import officeImage from "@assets/generated_images/Sustainable_home_office_eco_design_6b5e70f5.png";

const imageMap: Record<string, string> = {
  "Sustainable_bedroom_with_eco_furniture_d9ade003.png": bedroomImage,
  "Sustainable_living_room_eco_design_4d099e2b.png": livingRoomImage,
  "Sustainable_kitchen_eco_design_d360f33b.png": kitchenImage,
  "Sustainable_home_office_eco_design_6b5e70f5.png": officeImage,
};

export default function Recommendations() {
  const [roomRequest, setRoomRequest] = useState("");

  const { data, isLoading, refetch, isRefetching } = useQuery<{ recommendations: string[] }>({
    queryKey: ["/api/recommendations"],
  });

  const redesignMutation = useMutation({
    mutationFn: async (request: string) => {
      return apiRequest<{ recommendations: string[]; roomType: string; imagePath: string }>(
        "/api/room-redesign",
        "POST",
        { roomRequest: request }
      );
    },
  });

  const handleRedesignSubmit = () => {
    if (roomRequest.trim()) {
      redesignMutation.mutate(roomRequest);
    }
  };

  const recommendations = data?.recommendations || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Recommendations</h1>
        <p className="text-muted-foreground">Personalized sustainable product suggestions and room redesigns</p>
      </div>

      <Tabs defaultValue="carbon" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="carbon" data-testid="tab-carbon-recommendations">
            <Sparkles className="h-4 w-4 mr-2" />
            Carbon-Based
          </TabsTrigger>
          <TabsTrigger value="room" data-testid="tab-room-redesign">
            <Home className="h-4 w-4 mr-2" />
            Room Redesign
          </TabsTrigger>
        </TabsList>

        <TabsContent value="carbon" className="space-y-4">
          <div className="flex justify-end">
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
        </TabsContent>

        <TabsContent value="room" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                AI Room Redesign
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Describe the room you want to redesign sustainably, and our AI will generate eco-friendly recommendations with a visualization.
              </p>
              <div className="space-y-3">
                <Textarea
                  placeholder="Example: I want to redesign my bedroom sustainably with natural materials..."
                  value={roomRequest}
                  onChange={(e) => setRoomRequest(e.target.value)}
                  rows={3}
                  data-testid="input-room-request"
                  className="resize-none"
                />
                <Button
                  onClick={handleRedesignSubmit}
                  disabled={!roomRequest.trim() || redesignMutation.isPending}
                  data-testid="button-generate-redesign"
                  className="w-full"
                >
                  {redesignMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Redesign...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Generate Sustainable Redesign
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {redesignMutation.data && (
            <div className="space-y-4">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Your Eco-Friendly Room Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <img
                    src={imageMap[redesignMutation.data.imagePath]}
                    alt="Sustainable room redesign visualization"
                    className="w-full h-auto"
                    data-testid="image-room-redesign"
                  />
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Sustainable Product Recommendations
                </h3>
                {redesignMutation.data.recommendations.map((recommendation, index) => (
                  <Card key={index} className="hover-elevate" data-testid={`redesign-recommendation-${index}`}>
                    <CardContent className="p-4">
                      <p className="text-muted-foreground">{recommendation}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {redesignMutation.isError && (
            <Card className="border-destructive">
              <CardContent className="p-6 text-center">
                <p className="text-destructive">Failed to generate room redesign. Please try again.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
