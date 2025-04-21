import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check if API key is available
const apiKey = process.env.DEEPSEEK_API_KEY;
const baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';

// Create axios instance for DeepSeek API
const deepSeekClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Function to get AI response from DeepSeek API
 */
export async function getDeepSeekResponse(userMessage: string): Promise<string> {
  // If API key is not available, provide a fallback response
  if (!apiKey) {
    console.warn("DeepSeek API key not found. Using fallback response.");
    return generateFallbackResponse(userMessage);
  }

  try {
    const response = await deepSeekClient.post('/chat/completions', {
      model: "deepseek-chat",
      messages: [
        { 
          role: "system", 
          content: "You are an expert real estate assistant for Ohana Realty in Laredo, Texas. " +
                  "Your name is Valentin AI, and you work alongside Valentin Cuellar, the licensed broker. " +
                  "Provide helpful information about properties, neighborhoods, and the home buying/selling process. " +
                  "Always be professional, concise, and accurate. If asked about specific property details you don't have, " +
                  "offer to connect the user with Valentin Cuellar for more information."
        },
        { role: "user", content: userMessage }
      ],
      stream: false
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("DeepSeek API Error:", error);
    return "I'm having trouble connecting to my knowledge base right now. Please try again later or contact Valentin Cuellar directly at 956-712-3000 for immediate assistance.";
  }
}

/**
 * Generate fallback responses when API is not available
 */
function generateFallbackResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  if (message.includes("shiloh drive")) {
    return "I found 3 properties near Shiloh Drive under $400,000. The closest one is 3720 Flores Ave at $359,000, just 1.5 miles away. Would you like to see the details?";
  } else if (message.includes("3720 flores")) {
    return "3720 Flores Ave is a 4-bedroom, 3-bathroom home with 2,800 sq. ft. It's listed at $359,000. It features hardwood floors, granite countertops, and a large backyard. Would you like to schedule a viewing?";
  } else if (message.includes("iturbide")) {
    return "There's a commercial property at 1318 & 1314 Iturbide St, priced at $899,000. It's a 5,400 sq. ft. retail/office space in downtown Laredo with excellent visibility and high foot traffic.";
  } else if (message.includes("commercial")) {
    return "We have a commercial property at 1318 & 1314 Iturbide St in downtown Laredo. It's priced at $899,000 with 5,400 sq. ft. Would you like more information?";
  } else if (message.includes("residential")) {
    return "We have residential properties like 3720 Flores Ave (4-bed, $359,000) and 245 Brumoso Ct (5-bed, $425,000). Which one would you like to know more about?";
  } else if (message.includes("valentin")) {
    return "Valentin Cuellar is our licensed real estate broker with over 20 years of experience in Laredo. He specializes in both residential and commercial properties. Would you like me to arrange a call with him? His office number is 956-712-3000 and mobile is 956-324-6714.";
  } else if (message.includes("neighborhood")) {
    return "Laredo has several great neighborhoods. North Laredo is popular for families with top schools and shopping centers, Downtown offers historic charm and cultural attractions, and Del Mar is known for its character homes and strong community. Which area interests you most?";
  } else if (message.includes("mortgage") || message.includes("loan") || message.includes("finance")) {
    return "For a $359,000 home with 20% down payment and a 30-year fixed mortgage at 6.5% interest rate, your estimated monthly payment would be around $1,815 (not including taxes and insurance). Would you like me to connect you with a mortgage specialist?";
  } else if (message.includes("sell") || message.includes("selling")) {
    return "Selling your home with Ohana Realty means working with experienced professionals who know the Laredo market inside and out. Valentin Cuellar can provide a free home valuation and marketing strategy tailored to your property. Would you like to schedule a consultation?";
  } else {
    return "I'd be happy to help you find your dream property in Laredo or answer any questions about the real estate market. Could you tell me more about what you're looking for? We have both residential and commercial properties available.";
  }
}