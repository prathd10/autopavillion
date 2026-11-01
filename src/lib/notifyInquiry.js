/**
 * Tells the server to email the team about a new enquiry.
 * Call it after the enquiry has been saved. It never throws and never blocks
 * the form: if the email fails, the enquiry is still in the admin panel.
 *
 * @param {{ type: string, name: string, phone: string, details?: object }} inquiry
 */
export function notifyInquiry(inquiry) {
  try {
    const submissionId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    fetch('/api/notify-inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // keepalive lets the request finish even if the visitor navigates away
      keepalive: true,
      body: JSON.stringify({
        type: inquiry.type,
        name: inquiry.name,
        phone: inquiry.phone,
        details: inquiry.details || {},
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        submissionId,
      }),
    }).catch((err) => console.warn('[notifyInquiry] Email notification failed:', err));
  } catch (err) {
    console.warn('[notifyInquiry] Email notification failed:', err);
  }
}
