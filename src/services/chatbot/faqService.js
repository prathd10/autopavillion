import { supabase } from '../../lib/supabase';
import { FAQS as staticFAQs } from '../../data/faqs';

export const faqService = {
  /**
   * Search FAQs from Supabase or fallback static list
   * @param {string} query 
   * @returns {Promise<object|null>} The highest matching FAQ { question, answer, score }
   */
  async findMatchingFAQ(query) {
    const cleanQuery = query.toLowerCase().trim();
    let faqsList = [];
    let isSupabase = false;

    try {
      // 1. Try to fetch active FAQs from Supabase
      const { data, error } = await supabase
        .from('chatbot_faqs')
        .select('*')
        .eq('is_active', true);

      if (!error && data && data.length > 0) {
        faqsList = data;
        isSupabase = true;
      } else {
        console.warn('[faqService] FAQ table empty or inaccessible. Using local static FAQs.');
        faqsList = staticFAQs;
      }
    } catch (err) {
      console.warn('[faqService] Failed to query Supabase FAQs, falling back:', err.message);
      faqsList = staticFAQs;
    }

    // 2. Perform score-based keyword matching on retrieved FAQs
    let bestMatch = null;
    let highestScore = 0;

    faqsList.forEach(faq => {
      let score = 0;
      const keywords = Array.isArray(faq.keywords) ? faq.keywords : [];
      
      // Match keywords strictly as whole words/phrases to prevent sub-string matching bugs
      // (e.g. matching "emi" inside the word "premium")
      keywords.forEach(keyword => {
        const kwClean = keyword.toLowerCase().trim();
        const escaped = kwClean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');
        
        if (regex.test(cleanQuery)) {
          // Exact matches within the query get higher weight
          score += kwClean.split(' ').length * 1.5;
        }
      });

      // Match question words
      const questionWords = faq.question.toLowerCase().replace(/[?.,!]/g, '').split(/\s+/);
      const queryWords = cleanQuery.replace(/[?.,!]/g, '').split(/\s+/);
      
      let wordOverlap = 0;
      queryWords.forEach(qw => {
        if (qw.length > 2 && questionWords.includes(qw)) {
          wordOverlap += 0.5;
        }
      });
      score += wordOverlap;

      // Match category
      if (faq.category && cleanQuery.includes(faq.category.toLowerCase())) {
        score += 1.0;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = faq;
      }
    });

    // 3. Return the best match if it meets confidence threshold
    const confidenceThreshold = 1.5;
    if (bestMatch && highestScore >= confidenceThreshold) {
      return {
        question: bestMatch.question,
        answer: bestMatch.answer,
        category: bestMatch.category,
        score: highestScore,
        source: isSupabase ? 'supabase' : 'static'
      };
    }

    return null;
  }
};
