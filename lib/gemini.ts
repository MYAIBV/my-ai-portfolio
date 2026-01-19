/**
 * Gemini AI integration for multilingual content generation
 * Uses Gemini 2.5 Flash Lite model (15 RPM, 1000 RPD free tier)
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 5000; // 5 seconds

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
  error?: {
    message: string;
    code?: number;
  };
}

interface RateLimitError {
  isRateLimit: boolean;
  retryAfterMs: number;
  message: string;
}

function parseRateLimitError(errorText: string): RateLimitError {
  try {
    const errorJson = JSON.parse(errorText);
    if (errorJson.error?.code === 429) {
      // Try to extract retry delay from the error message
      const retryMatch = errorJson.error.message?.match(/retry in (\d+(?:\.\d+)?)/i);
      const retrySeconds = retryMatch ? parseFloat(retryMatch[1]) : 30;
      return {
        isRateLimit: true,
        retryAfterMs: Math.ceil(retrySeconds * 1000),
        message: 'Rate limit exceeded. Please wait a moment and try again.',
      };
    }
  } catch {
    // Not JSON or parsing failed
  }
  return { isRateLimit: false, retryAfterMs: 0, message: errorText };
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const rateLimitInfo = parseRateLimitError(errorText);

        if (rateLimitInfo.isRateLimit && attempt < MAX_RETRIES - 1) {
          // Wait and retry on rate limit
          const waitTime = Math.max(rateLimitInfo.retryAfterMs, INITIAL_RETRY_DELAY * (attempt + 1));
          console.log(`Rate limited. Waiting ${waitTime}ms before retry ${attempt + 2}/${MAX_RETRIES}`);
          await sleep(waitTime);
          continue;
        }

        if (rateLimitInfo.isRateLimit) {
          throw new Error(rateLimitInfo.message);
        }

        throw new Error(`Gemini API error: ${errorText}`);
      }

      const data: GeminiResponse = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('No response from Gemini');
      }

      return text.trim();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on non-rate-limit errors
      if (!lastError.message.includes('Rate limit') && !lastError.message.includes('429')) {
        throw lastError;
      }
    }
  }

  throw lastError || new Error('Failed after multiple retries');
}

export type Language = 'nl' | 'en';

const languageNames: Record<Language, string> = {
  nl: 'Dutch',
  en: 'English',
};

/**
 * Translate content between Dutch and English
 */
export async function translateContent(
  text: string,
  fromLang: Language,
  toLang: Language
): Promise<string> {
  if (!text.trim()) {
    return '';
  }

  const prompt = `Translate the following ${languageNames[fromLang]} text to ${languageNames[toLang]}.
Keep the same tone and style. Only respond with the translation, nothing else.

Text to translate:
${text}`;

  return callGemini(prompt);
}

export type ContentField = 'title' | 'description';

/**
 * Generate content suggestions for a project
 */
export async function suggestContent(
  context: {
    existingTitle?: string;
    existingDescription?: string;
    categories?: string[];
    keywords?: string[];
  },
  field: ContentField,
  language: Language
): Promise<string> {
  const langName = languageNames[language];

  let contextInfo = '';
  if (context.existingTitle) {
    contextInfo += `Current title: ${context.existingTitle}\n`;
  }
  if (context.existingDescription) {
    contextInfo += `Current description: ${context.existingDescription}\n`;
  }
  if (context.categories?.length) {
    contextInfo += `Categories: ${context.categories.join(', ')}\n`;
  }
  if (context.keywords?.length) {
    contextInfo += `Keywords: ${context.keywords.join(', ')}\n`;
  }

  let prompt = '';

  if (field === 'title') {
    prompt = `Generate a concise, professional ${langName} title for an AI project portfolio item.
${contextInfo ? `\nContext:\n${contextInfo}` : ''}

Requirements:
- Keep it short (3-8 words)
- Make it catchy and descriptive
- Focus on the AI/technology aspect
- Only respond with the title, nothing else`;
  } else {
    prompt = `Generate a professional ${langName} description for an AI project portfolio item.
${contextInfo ? `\nContext:\n${contextInfo}` : ''}

Requirements:
- 2-4 sentences
- Highlight the benefits and features
- Keep it engaging and informative
- Focus on what makes this AI solution valuable
- Only respond with the description, nothing else`;
  }

  return callGemini(prompt);
}
