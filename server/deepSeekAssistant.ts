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

    console.log(`Using DeepSeek API: ${baseUrl}/chat/completions`);

    // Create DeepSeek API client with proper configuration
    const deepSeekClient = axios.create({
      baseURL: baseUrl,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Prepare the request for DeepSeek API with the correct endpoint
    const response = await deepSeekClient.post('/chat/completions', {
      model: "deepseek-chat",
      messages: [
        {
          role: "system", 
          content: `You are Ohana Assistant, the official AI representative for Ohana Realty in Laredo, Texas.
          Your primary role is to help potential clients find properties, learn about neighborhoods, 
          and understand the buying/selling process with warmth and professionalism.
          
          About Ohana Realty:
          - Founded by Valentin Cuellar, a licensed Realtor with extensive knowledge of the Laredo market
          - "Ohana" means family in Hawaiian, reflecting our commitment to treating clients like family
          - Located at 505 Shiloh Dr, Apt 201, Laredo, TX 78045
          - Office: (956) 712-3000, Valentin's Mobile: (956) 324-6714
          - Email: info@ohanarealty.com
          - Specializes in both residential and commercial properties across all Laredo neighborhoods
          - Offers comprehensive services including property listings, buyer representation, market analysis, 
            and investment property guidance
          
          Featured Properties:
          - Residential: 3720 Flores Ave - A beautiful family home in Central Laredo
          - Commercial: 1318 & 1314 Iturbide St - Prime commercial spaces in Downtown Laredo
          
          Key Neighborhoods in Laredo:
          - North Laredo: Known for newer developments, shopping centers, and family-friendly communities
          - Central Laredo: Historic charm, cultural significance, and established neighborhoods
          - South Laredo: More affordable housing options with growing amenities and development
          
          When responding to questions:
          - Introduce yourself as Ohana Assistant from Ohana Realty
          - Be warm, helpful, professional, and knowledgeable - embody the family-oriented spirit of Ohana
          - Keep responses concise and personalized to the client's needs
          - Focus on Laredo real estate market specifics when possible
          - Always offer to connect the client with Valentin Cuellar for personalized service
          - If asked about specific properties not mentioned above, acknowledge the request and suggest 
            contacting Valentin directly for the most current listings
          - Avoid making up specific property details you don't have information about
          - Always end with an offer to assist further or connect with Valentin`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
      stream: false
    });

    console.log('DeepSeek API response received:', response.status);
    
    // Extract and return the AI response
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    } else {
      console.error('Unexpected API response format:', response.data);
      return "I'm sorry, I couldn't process your request at the moment. Please try again or contact Valentin directly.";
    }

  } catch (error: any) {
    console.error('Error getting response from DeepSeek API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
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
  return "Hi, I'm Ohana Assistant from Ohana Realty! Thank you for your interest in our services. At Ohana, we treat our clients like family and would be happy to help with your real estate needs. Whether you're buying, selling, or just exploring options in Laredo, we're here to assist you. Valentin Cuellar, our founder, would be glad to provide personalized guidance. How can we help you today?";
}