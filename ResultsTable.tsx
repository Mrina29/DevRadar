const API_BASE = '/api';

export async function runSQLQuery(sql: string, bypassCoral: boolean = false) {
  try {
    const response = await fetch(`${API_BASE}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql, bypassCoral })
    });
    if (!response.ok) {
      throw new Error(`Execution returned status code: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
}

export async function translatePrompt(prompt: string, context?: string) {
  try {
    const response = await fetch(`${API_BASE}/ai/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, context })
    });
    if (!response.ok) {
      throw new Error("Unable to parse natural language translation request.");
    }
    return await response.json();
  } catch (error) {
    console.error("Translation logic error:", error);
    throw error;
  }
}
