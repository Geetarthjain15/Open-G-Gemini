const sendPromptToGemini = async (prompt) => {
  // Validate input with more specific checks
  if (typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw new Error('Prompt must be a non-empty string');
  }

  // Safely get API key with fallback for development
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim();
  if (!API_KEY) {
    if (import.meta.env.DEV) {
      console.warn('API key is missing - using test mode');
      return `Test response for: "${prompt}"`;
    }
    throw new Error('API key is missing - check your .env file');
  }

  // Configure API request
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }]
    }),
    signal: AbortSignal.timeout(10000) // 10-second timeout
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    
    // Handle non-OK responses with detailed error info
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      throw new Error(errorData.error?.message || 'API request failed');
    }

    const data = await response.json();
    
    // Validate response structure more thoroughly
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof responseText !== 'string') {
      console.warn('Unexpected API response:', data);
      throw new Error('Received invalid response format from API');
    }

    return responseText;

  } catch (error) {
    // Handle specific error types differently
    if (error.name === 'AbortError') {
      throw new Error('Request timed out (10s)');
    }
    
    console.error('API Error:', error);
    throw new Error(
      error.message.startsWith('Failed to get response') 
        ? error.message 
        : `Failed to get response: ${error.message}`
    );
  }
};

export default sendPromptToGemini;