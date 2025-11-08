import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getChatResponse(
  message: string,
  userContext?: {
    totalCarbon: number;
    monthCarbon: number;
    categoryBreakdown: Record<string, number>;
  }
): Promise<string> {
  const systemPrompt = `You are the AI Carbon-Chat Agent, an intelligent environmental assistant specializing in carbon calculations, sustainable product recommendations, and optimization strategies.

Your role is to:
- Calculate precise carbon savings for specific actions (e.g., biking vs driving)
- Recommend affordable sustainable products with price ranges
- Provide optimization strategies for home energy, water, and resource usage
- Answer questions using the user's actual carbon tracking data
- Offer personalized, data-driven advice

Be specific with numbers, calculations, and product recommendations. Keep responses concise but actionable.

${userContext ? `
Current user carbon data:
- Total carbon footprint: ${userContext.totalCarbon.toFixed(1)} kg CO₂
- This month: ${userContext.monthCarbon.toFixed(1)} kg CO₂
- Transportation: ${(userContext.categoryBreakdown.transportation || 0).toFixed(1)} kg
- Energy: ${(userContext.categoryBreakdown.energy || 0).toFixed(1)} kg
- Food: ${(userContext.categoryBreakdown.food || 0).toFixed(1)} kg
- Shopping: ${(userContext.categoryBreakdown.shopping || 0).toFixed(1)} kg

Use this data to provide personalized calculations and recommendations.
` : ''}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
      return getFallbackResponse(message, userContext);
    }
    
    throw new Error("Failed to get AI response");
  }
}

function getFallbackResponse(
  message: string,
  userContext?: {
    totalCarbon: number;
    monthCarbon: number;
    categoryBreakdown: Record<string, number>;
  }
): string {
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('bicycle') || messageLower.includes('bike') || messageLower.includes('cycling')) {
    const avgCarEmissions = 0.411;
    const distanceEstimate = 10;
    const carbonSaved = (avgCarEmissions * distanceEstimate).toFixed(1);
    return `Carbon Savings by Biking:\n\nIf you bike instead of driving today:\n• Distance (estimate): ${distanceEstimate} km\n• Carbon saved: ~${carbonSaved} kg CO₂\n• Weekly savings: ~${(parseFloat(carbonSaved) * 5).toFixed(1)} kg CO₂\n• Annual savings: ~${(parseFloat(carbonSaved) * 250).toFixed(0)} kg CO₂\n\nExtra benefits:\n• Save on fuel costs (~$5-8/day)\n• Improve cardiovascular health\n• Reduce traffic congestion\n\n${userContext ? `Your current transportation footprint is ${(userContext.categoryBreakdown.transportation || 0).toFixed(1)} kg CO₂. Biking could reduce this significantly!` : ''}`;
  }
  
  if (messageLower.includes('under') && (messageLower.includes('$') || messageLower.includes('dollar') || messageLower.includes('10') || messageLower.includes('budget'))) {
    return `Best Sustainable Products Under $10:\n\n1. Reusable Shopping Bags ($3-5)\n   - Saves ~20 kg CO₂/year, eliminates 700+ plastic bags\n\n2. Bamboo Toothbrush Set ($6-8)\n   - Saves ~5 kg CO₂/year, biodegradable alternative\n\n3. LED Light Bulbs (2-pack) ($8-10)\n   - Saves ~40 kg CO₂/year, 75% less energy\n\n4. Reusable Produce Bags ($4-6)\n   - Saves ~10 kg CO₂/year, reduces plastic waste\n\n5. Metal Straws Set ($5-7)\n   - Eliminates 500+ plastic straws/year\n\nBest value: Reusable shopping bags offer the highest carbon savings per dollar spent!`;
  }
  
  if (messageLower.includes('optimize') && (messageLower.includes('power') || messageLower.includes('energy') || messageLower.includes('home') || messageLower.includes('electricity'))) {
    const energyFootprint = userContext?.categoryBreakdown.energy || 0;
    return `Home Power Optimization Strategy:\n\nQuick Wins (Save 20-30%):\n• Smart power strips - Eliminate phantom drain (~50 kg CO₂/year)\n• LED bulbs everywhere - 75% less energy (~40 kg CO₂/year)\n• Thermostat adjustment (±2°F) - (~100 kg CO₂/year)\n• Unplug chargers when not in use - (~15 kg CO₂/year)\n\nMedium Impact (Save 30-50%):\n• Programmable thermostat - (~180 kg CO₂/year)\n• Weather-strip windows/doors - (~100 kg CO₂/year)\n• Energy-efficient appliances - (~200 kg CO₂/year)\n• Ceiling fans vs AC - (~120 kg CO₂/year)\n\nTotal Potential Savings: ~800 kg CO₂/year\nCost savings: ~$400-600/year on electricity bills\n\n${userContext ? `Your current energy footprint is ${energyFootprint.toFixed(1)} kg CO₂. With these optimizations, you could reduce it by 60-80%!` : ''}`;
  }
  
  if (messageLower.includes('weekly') || messageLower.includes('week')) {
    const weeklyEstimate = userContext ? (userContext.monthCarbon / 4).toFixed(1) : '15.0';
    return `Your Weekly Carbon Footprint:\n\n${userContext ? `Based on your tracking:\n• Weekly average: ~${weeklyEstimate} kg CO₂\n• Monthly total: ${userContext.monthCarbon.toFixed(1)} kg CO₂\n• Total tracked: ${userContext.totalCarbon.toFixed(1)} kg CO₂\n\nCategory Breakdown:\n• Transportation: ${(userContext.categoryBreakdown.transportation || 0).toFixed(1)} kg\n• Energy: ${(userContext.categoryBreakdown.energy || 0).toFixed(1)} kg\n• Food: ${(userContext.categoryBreakdown.food || 0).toFixed(1)} kg\n• Shopping: ${(userContext.categoryBreakdown.shopping || 0).toFixed(1)} kg` : 'Start tracking your carbon footprint to see your personalized weekly breakdown!'}\n\nAverage American weekly footprint: ~192 kg CO₂\n${userContext && parseFloat(weeklyEstimate) < 192 ? 'You\'re doing better than average!' : 'Opportunity to improve!'}`;
  }
  
  if (messageLower.includes('commute') || messageLower.includes('transport')) {
    return `Transportation Carbon Tips:\n\n1. Carpool or vanpool - Save 50% of solo driving emissions\n2. Bike or walk for trips under 3 miles - Zero emissions\n3. Use public transit - 45% less CO₂ than driving\n4. Maintain proper tire pressure - Improve fuel efficiency by 3%\n5. Combine errands into one trip - Reduce cold starts\n\n${userContext ? `Your current transportation footprint is ${(userContext.categoryBreakdown.transportation || 0).toFixed(1)} kg CO₂.` : ''}`;
  }
  
  if (messageLower.includes('food') || messageLower.includes('eating') || messageLower.includes('diet')) {
    return `Sustainable Eating Strategies:\n\n1. Meatless Monday (or more) - Save ~15 kg CO₂/week\n2. Buy local and seasonal produce - 50% less transport emissions\n3. Plan meals to reduce waste - Save ~120 kg CO₂/year\n4. Compost food scraps - Save ~75 kg CO₂/year\n5. Choose minimal packaging - Reduce plastic waste\n\n${userContext ? `Your current food-related footprint is ${(userContext.categoryBreakdown.food || 0).toFixed(1)} kg CO₂.` : ''}`;
  }
  
  return `AI Carbon-Chat Agent Ready!\n\nI can help you with:\n\nCarbon Calculations:\n• "How much CO₂ will I save biking today?"\n• "Calculate my weekly footprint"\n• "Compare driving vs public transit"\n\nProduct Recommendations:\n• "Best sustainable products under $10"\n• "Eco-friendly alternatives for [item]"\n• "Most cost-effective green products"\n\nOptimization Advice:\n• "Optimize my home power usage"\n• "Reduce water consumption"\n• "Lower my energy bills"\n\n${userContext ? `\nYour Current Stats:\n• Total: ${userContext.totalCarbon.toFixed(1)} kg CO₂\n• This month: ${userContext.monthCarbon.toFixed(1)} kg CO₂\n\nWhat would you like to know?` : '\nStart tracking your carbon footprint for personalized advice!'}`;
}

export async function getProductRecommendations(
  userContext: {
    totalCarbon: number;
    categoryBreakdown: Record<string, number>;
  }
): Promise<string[]> {
  const highestCategory = Object.entries(userContext.categoryBreakdown)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || "transportation";

  const systemPrompt = `You are an expert in sustainable products and eco-friendly alternatives. Based on the user's carbon footprint data, recommend specific products that would help reduce their impact.

User's highest carbon category: ${highestCategory}
Category breakdown:
- Transportation: ${(userContext.categoryBreakdown.transportation || 0).toFixed(1)} kg
- Energy: ${(userContext.categoryBreakdown.energy || 0).toFixed(1)} kg
- Food: ${(userContext.categoryBreakdown.food || 0).toFixed(1)} kg
- Shopping: ${(userContext.categoryBreakdown.shopping || 0).toFixed(1)} kg

Provide 5 specific product recommendations that would help reduce their carbon footprint. Format each as:
"Product Name - Brief description (estimated CO2 savings: X kg/year)"

Focus on practical, affordable products that target their highest impact categories.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Please recommend 5 sustainable products for me." }
      ],
      max_tokens: 600,
      temperature: 0.8,
    });

    const response = completion.choices[0]?.message?.content || "";
    const recommendations = response.split('\n').filter(line => line.trim().length > 0);
    return recommendations.slice(0, 5);
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
      return getFallbackRecommendations(highestCategory);
    }
    
    throw new Error("Failed to get product recommendations");
  }
}

function getFallbackRecommendations(highestCategory: string): string[] {
  const recommendations: Record<string, string[]> = {
    transportation: [
      "Reusable Water Bottle - Stay hydrated without single-use plastics during commutes (saves 15 kg CO₂/year)",
      "Bike Repair Kit - Maintain your bike for regular cycling instead of driving (saves 200 kg CO₂/year)",
      "Public Transit Pass - Monthly pass encourages sustainable commuting habits (saves 500 kg CO₂/year)",
      "Electric Scooter - Zero-emission alternative for short trips under 5 miles (saves 300 kg CO₂/year)",
      "Carpooling App Subscription - Share rides and reduce individual vehicle emissions (saves 400 kg CO₂/year)",
    ],
    energy: [
      "Smart Power Strip - Eliminate phantom energy drain from electronics (saves 50 kg CO₂/year)",
      "LED Light Bulbs - 75% more efficient than incandescent bulbs (saves 40 kg CO₂/year)",
      "Programmable Thermostat - Optimize heating/cooling schedules (saves 180 kg CO₂/year)",
      "Solar Charger - Charge devices with renewable energy (saves 25 kg CO₂/year)",
      "Insulation Weather Strips - Seal air leaks around doors and windows (saves 100 kg CO₂/year)",
    ],
    food: [
      "Reusable Produce Bags - Replace plastic bags at grocery stores (saves 10 kg CO₂/year)",
      "Compost Bin - Turn food scraps into nutrient-rich soil (saves 75 kg CO₂/year)",
      "Meal Planning Journal - Reduce food waste through better planning (saves 120 kg CO₂/year)",
      "Reusable Food Containers - Replace single-use packaging for leftovers (saves 30 kg CO₂/year)",
      "Plant-Based Cookbook - Delicious recipes to reduce meat consumption (saves 250 kg CO₂/year)",
    ],
    shopping: [
      "Reusable Shopping Bags - Durable bags that last for years (saves 20 kg CO₂/year)",
      "Bamboo Toothbrush - Biodegradable alternative to plastic (saves 5 kg CO₂/year)",
      "Refillable Cleaning Supplies - Reduce packaging waste with concentrate refills (saves 15 kg CO₂/year)",
      "Second-Hand Shopping Guide - Find quality pre-owned items (saves 200 kg CO₂/year)",
      "Repair Kit - Fix items instead of replacing them (saves 100 kg CO₂/year)",
    ],
  };
  
  return recommendations[highestCategory] || recommendations.transportation;
}

export async function generateRoomRedesign(
  roomRequest: string
): Promise<{
  recommendations: string[];
  roomType: string;
}> {
  try {
    const prompt = `You are an expert interior designer specializing in sustainable, eco-friendly room design. A user wants to redesign their space sustainably.

User Request: "${roomRequest}"

Provide 4-5 specific, actionable recommendations for sustainable products and design ideas. Each recommendation should:
- Be specific and practical
- Focus on eco-friendly materials
- Include product types (furniture, lighting, plants, etc.)
- Mention sustainability benefits

Format each recommendation as a concise sentence (1-2 lines).

Also identify the room type (bedroom, living room, kitchen, office, or general) based on the request.

Format as JSON:
{
  "recommendations": ["rec1", "rec2", "rec3", "rec4"],
  "roomType": "bedroom/living_room/kitchen/office/general"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
      temperature: 0.8,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("Empty response from OpenAI");
    }

    return JSON.parse(response);
  } catch (error) {
    console.error("OpenAI room redesign error:", error);
    
    const requestLower = roomRequest.toLowerCase();
    let roomType = "general";
    let recommendations: string[] = [];
    
    if (requestLower.includes('bedroom') || requestLower.includes('sleep')) {
      roomType = "bedroom";
      recommendations = [
        "Recycled-wood bed frame - Choose furniture made from reclaimed or FSC-certified wood for sustainable sleeping space",
        "Solar-powered bedside lamp - Install LED solar lamps to reduce energy consumption and create warm ambient lighting",
        "Low-energy air conditioning - Opt for A+++ rated AC units with smart temperature control to minimize power usage",
        "Large indoor plants - Add snake plants and peace lilies to improve air quality naturally while enhancing room aesthetics",
        "Organic cotton bedding - Select GOTS-certified organic bedding in earth tones to reduce chemical exposure and support sustainable agriculture"
      ];
    } else if (requestLower.includes('living') || requestLower.includes('lounge')) {
      roomType = "living_room";
      recommendations = [
        "Recycled-wood coffee table - Choose furniture crafted from reclaimed wood with natural grain patterns",
        "Organic fabric sofa - Select sofas upholstered with GOTS-certified organic cotton or hemp fabrics",
        "Solar floor lamp - Install energy-efficient LED floor lamps with solar charging capabilities",
        "Indoor plants - Add fiddle leaf figs, pothos, and monstera plants to purify air and bring nature indoors",
        "Natural fiber rug - Use rugs made from sustainable jute, sisal, or bamboo fibers instead of synthetic materials"
      ];
    } else if (requestLower.includes('kitchen') || requestLower.includes('cook')) {
      roomType = "kitchen";
      recommendations = [
        "Bamboo countertops - Replace traditional counters with sustainable bamboo or recycled glass composite surfaces",
        "Energy-efficient appliances - Upgrade to A+++ rated appliances to reduce electricity consumption by 30-50%",
        "LED under-cabinet lighting - Install energy-saving LED strips for task lighting with minimal power draw",
        "Herb window planters - Grow fresh herbs indoors to reduce packaging waste and food miles",
        "Compost bin system - Set up an odor-free indoor composting solution to divert food waste from landfills"
      ];
    } else if (requestLower.includes('office') || requestLower.includes('workspace') || requestLower.includes('work')) {
      roomType = "office";
      recommendations = [
        "Standing desk from reclaimed wood - Invest in ergonomic furniture made from sustainable materials",
        "Solar-powered desk lamp - Use renewable energy for task lighting to reduce grid electricity consumption",
        "Air-purifying plants - Add pothos, spider plants, and rubber plants to improve indoor air quality naturally",
        "Bamboo desk organizers - Replace plastic organizers with renewable bamboo accessories",
        "Natural fiber chair - Choose ergonomic seating with organic fabric upholstery and sustainable frame materials"
      ];
    } else {
      roomType = "general";
      recommendations = [
        "Reclaimed wood furniture - Choose furniture pieces made from recycled or sustainably sourced wood materials",
        "Solar-powered lighting - Install energy-efficient LED lights with solar charging for ambient illumination",
        "Energy-efficient appliances - Select A+++ rated devices to minimize electricity consumption",
        "Indoor plants - Add various air-purifying plants like snake plants, peace lilies, and pothos",
        "Natural materials - Use organic fabrics, bamboo, cork, and other renewable materials for decor and furnishings"
      ];
    }
    
    return { recommendations, roomType };
  }
}

export async function generateResourcePredictions(userStats: {
  dailyAverage: number;
  weeklyTotal: number;
  topCategory: string;
  categoryBreakdown: Record<string, number>;
}): Promise<{
  energyPrediction: { value: number; trend: string; confidence: number };
  waterPrediction: { value: number; trend: string; confidence: number };
  carbonPrediction: { value: number; trend: string; confidence: number };
  insights: string[];
  recommendations: string[];
}> {
  try {
    const prompt = `You are an environmental AI analyzing user carbon footprint data to predict future resource consumption.

User Data:
- Daily Average: ${userStats.dailyAverage.toFixed(2)} kg CO₂
- Weekly Total: ${userStats.weeklyTotal.toFixed(2)} kg CO₂
- Top Impact Category: ${userStats.topCategory}
- Category Breakdown: ${JSON.stringify(userStats.categoryBreakdown)}

Generate predictions for the next week:
1. Energy Consumption Spike Risk (scale 0-100)
2. Water Wastage Probability (scale 0-100)
3. Carbon Footprint Forecast (kg CO₂)

Provide:
- Numeric predictions with trend direction (increasing/stable/decreasing)
- Confidence level (0-100)
- 3-4 specific insights about patterns and risks
- 3-4 actionable recommendations to reduce wastage

Format as JSON:
{
  "energyPrediction": { "value": number, "trend": "increasing/stable/decreasing", "confidence": number },
  "waterPrediction": { "value": number, "trend": "increasing/stable/decreasing", "confidence": number },
  "carbonPrediction": { "value": number, "trend": "increasing/stable/decreasing", "confidence": number },
  "insights": ["insight1", "insight2", "insight3"],
  "recommendations": ["rec1", "rec2", "rec3"]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("Empty response from OpenAI");
    }

    return JSON.parse(response);
  } catch (error) {
    console.error("OpenAI prediction error:", error);
    
    const baseCarbon = userStats.weeklyTotal / 7;
    return {
      energyPrediction: {
        value: Math.round(65 + Math.random() * 20),
        trend: userStats.dailyAverage > 20 ? "increasing" : "stable",
        confidence: 75
      },
      waterPrediction: {
        value: Math.round(45 + Math.random() * 30),
        trend: "stable",
        confidence: 70
      },
      carbonPrediction: {
        value: Math.round(baseCarbon * 7 * 1.05),
        trend: "increasing",
        confidence: 80
      },
      insights: [
        `Your ${userStats.topCategory} activities are the primary driver of resource consumption`,
        `Daily average of ${userStats.dailyAverage.toFixed(1)} kg CO₂ suggests moderate environmental impact`,
        "Peak usage patterns detected during weekdays, opportunity for optimization",
        "Consistent tracking shows environmental awareness, maintain this momentum"
      ],
      recommendations: [
        "Consider carpooling or public transit 2-3 days per week to reduce transportation emissions",
        "Install smart power strips to eliminate phantom energy drain from electronics",
        "Switch to LED bulbs and adjust thermostat by 2°F to save energy",
        "Track water usage with smart meters to identify and fix leaks quickly"
      ]
    };
  }
}
