const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';
const GEMINI_API_KEY_2 = process.env.EXPO_PUBLIC_GEMINI_API_KEY_2 ?? '';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

export interface Recipe {
  name: string;
  cookTime: string;
  calories: string;
  ingredients: string[];
  steps: string[];
}

async function fetchGemini(body: string, apiKey: string): Promise<Response> {
  return fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey },
    body,
  });
}

async function fetchWithFallback(body: string): Promise<Response> {
  const res = await fetchGemini(body, GEMINI_API_KEY);
  if (res.status === 429 && GEMINI_API_KEY_2) {
    return fetchGemini(body, GEMINI_API_KEY_2);
  }
  return res;
}

async function callGemini(parts: object[]): Promise<Recipe[]> {
  if (!GEMINI_API_KEY) throw new Error('API key is missing.');
  let res: Response;
  try {
    res = await fetchWithFallback(JSON.stringify({ contents: [{ parts }] }));
  } catch {
    throw new Error('No internet connection.');
  }
  const data = await res.json();
  if (res.status === 429) throw new Error('Too many requests. Please wait and try again.');
  if (res.status === 403) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error('Something went wrong. Please try again.');
  const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const match = text.match(/```json\s*([\s\S]*?)```/) ?? text.match(/(\[[\s\S]*\])/);
  try {
    return JSON.parse(match?.[1] ?? match?.[0] ?? '[]');
  } catch {
    return [];
  }
}

function buildPrompt(cuisine?: string, lang?: string) {
  const cuisineNote = cuisine && cuisine !== 'Any' ? ` The recipes must be ${cuisine} cuisine.` : '';
  const langNote = lang === 'tagalog'
    ? ' Write all recipe names, ingredients, and steps in Tagalog (Filipino language).'
    : ' Write everything in English.';
  return `You are a recipe generator.${cuisineNote}${langNote} Given the ingredients below, return ONLY a valid JSON array of exactly 3 recipe objects. No explanation, no markdown text outside the code block.

Each object must have these exact keys:
- "name": string
- "cookTime": string (e.g. "20 mins")
- "calories": string (e.g. "350 kcal")
- "ingredients": array of strings (each ingredient with quantity, e.g. "2 eggs")
- "steps": array of strings (each step as a full sentence)

Return the JSON array inside a \`\`\`json code block like this:
\`\`\`json
[{...}, {...}, {...}]
\`\`\``;
}

export async function getRecipesFromText(ingredients: string, cuisine?: string, lang?: string): Promise<Recipe[]> {
  return callGemini([{ text: `${buildPrompt(cuisine, lang)}\n\nIngredients: ${ingredients}` }]);
}

export async function getRecipesFromImage(base64: string, mimeType: string, cuisine?: string, lang?: string): Promise<Recipe[]> {
  return callGemini([
    { text: `Look at this image, identify all visible food ingredients, then use them as the ingredient list. ${buildPrompt(cuisine, lang)}` },
    { inline_data: { mime_type: mimeType, data: base64 } },
  ]);
}

export async function getRecipesByCategory(cuisine: string): Promise<Recipe[]> {
  return callGemini([{ text: `${buildPrompt(cuisine, 'english')}\n\nGenerate 3 popular ${cuisine} recipes using common ingredients.` }]);
}

export interface CookingTip {
  title: string;
  tip: string;
}

export async function getCookingTips(): Promise<CookingTip[]> {
  const body = JSON.stringify({
    contents: [{ parts: [{ text: `Give 5 practical cooking tips or ingredient substitution ideas. Return ONLY a valid JSON array inside a \`\`\`json code block. Each object must have "title" (short, max 5 words) and "tip" (1-2 sentences) keys.` }] }],
  });
  const res = await fetchWithFallback(body);
  const data = await res.json();
  const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const match = text.match(/\`\`\`json\s*([\s\S]*?)\`\`\`/) ?? text.match(/(\[[\s\S]*\])/);
  try { return JSON.parse(match?.[1] ?? match?.[0] ?? '[]'); } catch { return []; }
}

export interface IngredientInfo {
  name: string;
  description: string;
  uses: string;
  pairsWith: string[];
}

export async function getIngredientInfo(ingredient: string): Promise<IngredientInfo | null> {
  const body = JSON.stringify({
    contents: [{ parts: [{ text: `Give info about the ingredient "${ingredient}". Return ONLY a valid JSON object inside a \`\`\`json code block with keys: "name" (string), "description" (1-2 sentences), "uses" (1 sentence), "pairsWith" (array of 4 ingredient strings).` }] }],
  });
  const res = await fetchWithFallback(body);
  const data = await res.json();
  const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const match = text.match(/\`\`\`json\s*([\s\S]*?)\`\`\`/) ?? text.match(/(\{[\s\S]*\})/);
  try { return JSON.parse(match?.[1] ?? match?.[0] ?? 'null'); } catch { return null; }
}
