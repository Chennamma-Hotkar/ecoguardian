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
  const systemPrompt = `You are EcoGuardian AI, a helpful and knowledgeable environmental assistant specializing in carbon footprint reduction and sustainable living. 

Your role is to:
- Provide personalized advice on reducing carbon emissions
- Suggest eco-friendly alternatives and sustainable practices
- Answer questions about climate change and environmental impact
- Help users understand their carbon footprint data
- Offer practical, actionable tips for everyday sustainability

Be friendly, encouraging, and specific in your recommendations. Keep responses concise but informative.

${userContext ? `
Current user carbon data:
- Total carbon footprint: ${userContext.totalCarbon.toFixed(1)} kg CO₂
- This month: ${userContext.monthCarbon.toFixed(1)} kg CO₂
- Transportation: ${(userContext.categoryBreakdown.transportation || 0).toFixed(1)} kg
- Energy: ${(userContext.categoryBreakdown.energy || 0).toFixed(1)} kg
- Food: ${(userContext.categoryBreakdown.food || 0).toFixed(1)} kg
- Shopping: ${(userContext.categoryBreakdown.shopping || 0).toFixed(1)} kg
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
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get AI response");
  }
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
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get product recommendations");
  }
}
