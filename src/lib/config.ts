export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

if (!OPENROUTER_API_KEY && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ OPENROUTER_API_KEY is not set. AI features will use fallback responses.');
}
