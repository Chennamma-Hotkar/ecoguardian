import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Leaf, TrendingDown } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_forest_ocean_landscape_f04a8ae9.png";

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 space-y-6">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white text-sm">
          <Leaf className="h-4 w-4" />
          <span>AI-Powered Carbon Tracking</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
          Track, Reduce, and Save <br />the Planet
        </h1>
        
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          Join thousands making sustainable choices with AI-powered insights. 
          Monitor your carbon footprint and get personalized recommendations.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button 
            size="lg" 
            className="bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30 text-white"
            onClick={onGetStarted}
            data-testid="button-get-started"
          >
            Start Tracking Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white/10 backdrop-blur-md border-white/30 hover:bg-white/20 text-white"
            data-testid="button-learn-more"
          >
            Learn More
          </Button>
        </div>
        
        <Card className="inline-flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md border-white/20">
          <div className="text-left">
            <div className="flex items-center gap-2 text-white">
              <TrendingDown className="h-5 w-5 text-green-400" />
              <span className="text-2xl font-bold">2.4M</span>
            </div>
            <p className="text-sm text-white/80">Tons CO₂ Saved</p>
          </div>
          <div className="h-12 w-px bg-white/20" />
          <div className="text-left">
            <div className="text-2xl font-bold text-white">150K+</div>
            <p className="text-sm text-white/80">Active Users</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
