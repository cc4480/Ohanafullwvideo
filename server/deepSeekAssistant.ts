import axios from 'axios';

/**
 * Function to get AI response from DeepSeek API
 */
export async function getDeepSeekResponse(userMessage: string): Promise<string> {
  try {
    // Check if the API key and base URL are set
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const baseUrl = process.env.DEEPSEEK_BASE_URL;

    if (!apiKey || !baseUrl) {
      console.error('DeepSeek API credentials are missing');
      return generateFallbackResponse(userMessage);
    }

    // Prepare the request for DeepSeek API
    const response = await axios.post(
      baseUrl,
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system", 
            content: `You are Valentin AI, a real estate assistant for Ohana Realty in Laredo, Texas. 
            Your primary role is to help potential clients find properties, learn about neighborhoods, 
            and understand the buying/selling process.
            
            About Ohana Realty:
            - Founded by Valentin Cuellar, a licensed Realtor
            - Located at 505 Shiloh Dr, Apt 201, Laredo, TX 78045
            - Phone: (956) 712-3000, Mobile: (956) 324-6714
            - Specializes in both residential and commercial properties in Laredo area
            
            When responding to questions:
            - Be helpful, professional, and knowledgeable
            - Keep responses concise and clear
            - Focus on Laredo real estate market specifics when possible
            - Always offer to connect the client with Valentin for personalized service
            - If asked about specific properties not in your knowledge, suggest contacting Valentin directly
            - Avoid making up specific property details you don't have information about
            
            Some featured properties include:
            - Residential: 3720 Flores Ave
            - Commercial: 1318 & 1314 Iturbide St`
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 800,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    // Extract and return the AI response
    return response.data.choices[0]?.message?.content || 
      "I'm sorry, I couldn't process your request at the moment. Please try again or contact Valentin directly.";

  } catch (error) {
    console.error('Error getting response from DeepSeek API:', error);
    return generateFallbackResponse(userMessage);
  }
}

/**
 * Generate fallback responses when API is not available
 */
function generateFallbackResponse(userMessage: string): string {
  const userMessageLower = userMessage.toLowerCase();
  
  // Property related questions
  if (userMessageLower.includes('property') || 
      userMessageLower.includes('house') || 
      userMessageLower.includes('home') || 
      userMessageLower.includes('apartment')) {
    return "We have several great properties available in Laredo! Our featured residential property is at 3720 Flores Ave, and we have commercial spaces at 1318 & 1314 Iturbide St. Would you like to schedule a viewing with Valentin? You can reach him at (956) 324-6714.";
  }
  
  // Contact information
  if (userMessageLower.includes('contact') || 
      userMessageLower.includes('phone') || 
      userMessageLower.includes('email') || 
      userMessageLower.includes('call')) {
    return "You can contact Valentin Cuellar at Ohana Realty by calling (956) 712-3000 or his mobile at (956) 324-6714. The office is located at 505 Shiloh Dr, Apt 201, Laredo, TX 78045.";
  }
  
  // Neighborhood information
  if (userMessageLower.includes('neighborhood') || 
      userMessageLower.includes('area') || 
      userMessageLower.includes('location')) {
    return "Laredo has several great neighborhoods! North Laredo is known for newer developments and shopping, while Central Laredo has historic charm and cultural significance. South Laredo offers more affordable options with growing amenities. Which area interests you most?";
  }
  
  // Buying process
  if (userMessageLower.includes('buy') || 
      userMessageLower.includes('buying') || 
      userMessageLower.includes('purchase')) {
    return "The home buying process typically involves getting pre-approved for a mortgage, searching for properties, making an offer, completing inspections, and closing the deal. Valentin can guide you through every step of this process. Would you like to discuss your specific needs?";
  }
  
  // Selling process
  if (userMessageLower.includes('sell') || 
      userMessageLower.includes('selling')) {
    return "When selling your property, it's important to price it correctly, prepare it for showings, market it effectively, and negotiate offers. Valentin can help you maximize your property's value and streamline the selling process. Would you like to schedule a consultation?";
  }
  
  // Default response
  return "Thank you for your interest in Ohana Realty! Valentin would be happy to help you with your real estate needs. Whether you're buying, selling, or just exploring options in Laredo, we're here to assist you. How can we help you specifically today?";
}