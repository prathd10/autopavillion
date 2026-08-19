/**
 * Client service to call the server-side Gemini fallback endpoint safely.
 */
export const geminiFallbackService = {
  /**
   * Invokes Gemini endpoint via the backend proxy
   * @param {string} query User query
   * @param {string} context Compiled context string
   * @returns {Promise<string|null>} Response text or null if failed
   */
  async getReply(query, context) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, context }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return data.reply || null;
      }
      return null;
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn('[geminiFallbackService] Error querying Gemini fallback API:', error);
      return null;
    }
  }
};
