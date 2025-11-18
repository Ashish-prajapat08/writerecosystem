import { supabase } from "./supabaseClient";

// Updated interface with only the required fields
interface EbookData {
  fullName: string;
  email: string;
  contact: string;
  socialMedia?: string;
  ebookTitle: string;
  ebookDescription?: string;
  upiId?: string;
  genre: string;
  price: string;
  originalWork: boolean;
  permission: boolean;
  message?: string;
  pages: number;
  ebookFileUrl: string;
  coverImageUrl: string;
}

// Function to upload files to Supabase Storage (unchanged)
export const uploadFileToSupabase = async (
  file: File,
  bucket: string,
  path: string
): Promise<{ url: string; error: Error | null }> => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${path}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    const { 
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return { url: publicUrl, error: null };
  } catch (error) {
    return { url: "", error: error as Error };
  }
};

// Updated function to submit to Airtable with only required fields
export const submitEbookToAirtable = async (ebookData: EbookData) => {
  try {
    const response = await fetch(
      "https://api.airtable.com/v0/appzG5tuIn0406HDt/tbl5U4VbXEkEYQ4MC",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
        },
        body: JSON.stringify({
          fields: {
            "Full Name": ebookData.fullName,
            Email: ebookData.email,
            Contact: ebookData.contact,
            "Social Media": ebookData.socialMedia,
            "Ebook Title": ebookData.ebookTitle,
            "Ebook Description": ebookData.ebookDescription,
            "UPI ID": ebookData.upiId,
            Genre: ebookData.genre,
            Price: ebookData.price,
            "Original Work": ebookData.originalWork,
            Permission: ebookData.permission,
            Message: ebookData.message,
            Pages: ebookData.pages,
            "Ebook File URL": ebookData.ebookFileUrl,
            "Cover Image URL": ebookData.coverImageUrl,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to submit to Airtable");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Updated main submission function
export const submitEbook = async (
  formData: {
    fullName: string;
    email: string;
    contact: string;
    socialMedia?: string;
    ebookTitle: string; 
    ebookDescription?: string;
    upiId?: string;
    genre: string;
    price: string;
    originalWork: boolean;
    permission: boolean;
    message?: string;
    pages: number;
  },
  files: {
    ebookFile: File;
    coverImage: File;
  }
) => {
  try {
    // Upload both files to Supabase
    const [ebookUpload, coverUpload] = await Promise.all([
      uploadFileToSupabase(files.ebookFile, "ebooks", "ebook-files"),
      uploadFileToSupabase(files.coverImage, "ebooks", "cover-images"),
    ]);

    // Check for upload errors
    if (ebookUpload.error) throw ebookUpload.error;
    if (coverUpload.error) throw coverUpload.error;

    // Prepare data for Airtable
    const ebookData: EbookData = {
      fullName: formData.fullName,
      email: formData.email,
      contact: formData.contact,
      socialMedia: formData.socialMedia,
      ebookTitle: formData.ebookTitle,
      ebookDescription: formData.ebookDescription,
      upiId: formData.upiId,
      genre: formData.genre,
      price: formData.price,
      originalWork: formData.originalWork,
      permission: formData.permission,
      message: formData.message,
      pages: formData.pages,
      ebookFileUrl: ebookUpload.url,
      coverImageUrl: coverUpload.url,
    };

    const result = await submitEbookToAirtable(ebookData);
    return result;
  } catch (error) {
    console.error("Submission failed:", error);
    throw error;
  }
};
