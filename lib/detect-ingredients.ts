const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

export async function detectIngredients(base64: string): Promise<string[]> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-goog-api-key': GEMINI_API_KEY },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: 'List all food ingredients visible in this image. Return ONLY a JSON array of strings, e.g. ["egg","tomato"]. No explanation.' },
          { inline_data: { mime_type: 'image/jpeg', data: base64 } },
        ],
      }],
    }),
  });
  const data = await res.json();
  const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]';
  const match = text.match(/```json\s*([\s\S]*?)```/) ?? text.match(/(\[[\s\S]*\])/);
  return JSON.parse(match?.[1] ?? '[]');
}
