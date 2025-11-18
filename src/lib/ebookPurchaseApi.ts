import { supabase } from './supabaseClient';

interface PurchaseData {
  fullname: string;
  email: string;
  contactNumber?: string;
  whatsappNumber?: string;
  ebookTitle: string;
  ebookAuthor: string;
  ebookAuthorEmail: string;
  price: string;
  razorpay_payment_id?: string;
}

// Function to submit purchase data to Airtable
export const submitPurchaseToAirtable = async (purchaseData: PurchaseData) => {
  try {
    if (!import.meta.env.VITE_AIRTABLE_API_KEY) {
      throw new Error('Missing Airtable API key'); 
    }

    console.log('📤 Sending to Airtable:', purchaseData);

    const response = await fetch(
      `https://api.airtable.com/v0/appzG5tuIn0406HDt/tblA4Gk861VQGDfCr`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
        },
        body: JSON.stringify({
          fields: {
            'First Name': purchaseData.fullname,
            'Email': purchaseData.email,
            'Contact Number': purchaseData.contactNumber || '', // Empty if not provided
            'WhatsApp Number': purchaseData.whatsappNumber || '', // Empty if not provided
            'Ebook Title': purchaseData.ebookTitle,
            'Ebook Author': purchaseData.ebookAuthor,
            'Author Email': purchaseData.ebookAuthorEmail,
            'Price': purchaseData.price,
            'Payment Screenshot URL': purchaseData.razorpay_payment_id || '',
            'Status': 'Pending',
            'Purchase Date': new Date().toISOString(),
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Airtable Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to submit');
    }

    const result = await response.json();
    console.log('✅ Saved to Airtable:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Submission failed:', error);
    throw error;
  }
};