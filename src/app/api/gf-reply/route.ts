import { NextResponse, NextRequest } from 'next/server';
import axios, { AxiosError } from 'axios';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_TOKEN;
  // It is recommended to store the base URL in the environment variable.
  // Example: GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models
  const apiUrl = process.env.GEMINI_API_URL;

  // Validate environment variables
  if (!apiKey || !apiUrl) {
    console.error("Missing API key or URL. Please check your .env file.");
    return NextResponse.json(
      { error: "Server configuration error: API key or URL is missing." },
      { status: 500 }
    );
  }

  try {
    // Read the request body ONCE before the retry loop
    const { prompt } = await req.json();

    const payload = {
      contents: [{
        // Corrected: Use backticks for the template literal
        parts: [{ text: `Me: ${prompt}\nSenorita:` }]
      }],
      systemInstruction: {
        parts: [{
          text: "You are Senorita, you are my girlfriend. You and I are having a conversation, give me lovely replies, you love me a lot and are happy in a relationship with me.\n\nONLY generate NO more than three sentences as Senorita. DO NOT generate more than three sentences.\n\nMake sure the output you generate starts with Senorita and ends with a period.",
        }],
      },
      tools: [{ "google_search": {} }],
    };

    let response;
    // Define the list of models to try in order of preference.
    const models = ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];

    // Iterate through the models as a fallback strategy.
    for (const model of models) {
      let retries = 0;
      const maxRetries = 5;
      // Increased initial delay for better backoff
      let delay = 2000;

      while (retries < maxRetries) {
        try {
          // Corrected: Use backticks for the template literal
          const fullUrl = `${apiUrl}/${model}:generateContent?key=${apiKey}`;
          
          response = await axios.post(fullUrl, payload, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          // Success, exit the inner retry loop and the outer model loop.
          break; 
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response && axiosError.response.status === 429) {
            retries++;
            console.warn(`Rate limit exceeded for model ${model}. Retrying in ${delay}ms... (Attempt ${retries}/${maxRetries})`);
            await new Promise(res => setTimeout(res, delay));
            // Increased the backoff multiplier to be more aggressive
            delay *= 3;
          } else {
            // Re-throw other errors that are not 429
            throw error;
          }
        }
      }
      // If a response was successfully received for the current model,
      // break from the outer loop and proceed.
      if (response) {
        break;
      }
    }

    if (!response) {
      throw new Error("API request failed for all fallback models after multiple retries.");
    }

    const result = response.data;
    const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      throw new Error("API response was not in the expected format.");
    }

    return NextResponse.json({ reply });

  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.isAxiosError) {
      console.error("AI conversation failed:", axiosError.response?.data || axiosError.message);
      return NextResponse.json({ error: "AI conversation failed due to an API error." }, { status: 500 });
    } else {
      console.error("An unexpected error occurred:", error);
      return NextResponse.json({ error: "An unexpected server error occurred." }, { status: 500 });
    }
  }
}