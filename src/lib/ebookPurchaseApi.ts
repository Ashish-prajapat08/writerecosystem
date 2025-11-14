import { supabase } from './supabaseClient';

interface PurchaseData {
  fullname: string;
  email: string;
  contactNumber: string;
  whatsappNumber?: string;
  ebookTitle: string;
  ebookAuthor: string;
  ebookAuthorEmail: string;
  price: string;
  paymentScreenshotUrl: string;
}

// Function to upload payment screenshot to Supabase
export const uploadPaymentScreenshot = async (file: File): Promise<{ url: string; error: Error | null }> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `buyer-payments/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('payments')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('payments')
      .getPublicUrl(data.path);

    return { url: publicUrl, error: null };
  } catch (error) {
    return { url: '', error: error as Error };
  }
};

// Function to submit purchase data to Airtable
export const submitPurchaseToAirtable = async (purchaseData: PurchaseData) => {
  try {
    if (!import.meta.env.VITE_AIRTABLE_API_KEY) {
      throw new Error('Missing Airtable API');
    }

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
            'Contact Number': purchaseData.contactNumber,
            'WhatsApp Number': purchaseData.whatsappNumber || '',
            'Ebook Title': purchaseData.ebookTitle,
            'Ebook Author': purchaseData.ebookAuthor,
            'Author Email': purchaseData.ebookAuthorEmail,
            'Price': purchaseData.price,
            'Payment Screenshot URL': purchaseData.paymentScreenshotUrl,
            'Status': 'Pending',
            'Purchase Date': new Date().toISOString(),
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to submit to Airtable');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Main function to handle the entire purchase process
export const submitEbookPurchase = async (
  purchaseData: Omit<PurchaseData, 'paymentScreenshotUrl'>,
  paymentScreenshot: File
) => {
  try {
    // Upload payment screenshot
    const { url, error } = await uploadPaymentScreenshot(paymentScreenshot);
    if (error) throw error;

    // Submit to Airtable
    const result = await submitPurchaseToAirtable({
      ...purchaseData,
      paymentScreenshotUrl: url
    });

    return result;
  } catch (error) {
    console.error('Purchase submission failed:', error);
    throw error;
  }
};