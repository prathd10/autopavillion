import { supabase } from '../../lib/supabase';

export const leadService = {
  /**
   * Save a lead to the inquiries table
   * @param {object} leadData { name, phone, whatsapp, intent, vehicleId, vehicleName, message }
   * @returns {Promise<boolean>} success status
   */
  async createLead(leadData) {
    try {
      const payload = {
        type: 'chatbot',
        name: leadData.name,
        phone: leadData.phone,
        status: 'new',
        details: {
          intent: leadData.intent || 'callback',
          whatsapp: leadData.whatsapp || false,
          vehicleId: leadData.vehicleId || null,
          vehicleName: leadData.vehicleName || null,
          message: leadData.message || '',
          source: 'chatbot'
        }
      };

      const { error } = await supabase.from('inquiries').insert([payload]);

      if (error) {
        throw error;
      }
      return true;
    } catch (err) {
      console.error('[leadService] Failed to submit chatbot lead to database:', err.message);
      // Even if database fails, we return false so chatbot can explain or try another route
      return false;
    }
  }
};
