import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, MessageSquare, MapPin, ShoppingBag, TrendingDown, Target } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "AI-powered insights track and predict your carbon footprint with precision.",
  },
  {
    icon: MessageSquare,
    title: "AI Chatbot",
    description: "Get personalized tips and instant answers to all your sustainability questions.",
  },
  {
    icon: MapPin,
    title: "Eco Map",
    description: "Discover nearby charging stations, recycling centers, and green businesses.",
  },
  {
    icon: ShoppingBag,
    title: "Product Recommendations",
    description: "Find sustainable alternatives tailored to your lifestyle and budget.",
  },
  {
    icon: TrendingDown,
    title: "Carbon Reduction",
    description: "Set goals and track your progress toward a lower carbon footprint.",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Achieve milestones and celebrate your environmental impact.",
  },
];

export default function FeatureSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Go Green
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful tools and AI-driven insights to help you make sustainable choices every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover-elevate cursor-pointer" data-testid={`feature-card-${index}`}>
              <CardContent className="p-6 space-y-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
