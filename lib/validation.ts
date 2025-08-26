import { z } from "zod";

// Base field validators
export const email = z.string().email("Enter a valid email.");
export const name = z.string().min(2, "Enter your name.");
export const phone = z.string().optional(); // Basic; refine later per region

// ASIN validation - supports both ASIN codes and full URLs
export const asin = z
  .string()
  .min(1, "ASIN or URL is required")
  .refine((value) => {
    // Check if it's a 10-character ASIN
    const asinRegex = /^[A-Z0-9]{10}$/;
    if (asinRegex.test(value)) return true;
    
    // Check if it's a valid Amazon URL containing an ASIN
    try {
      const url = new URL(value);
      return url.hostname.includes('amazon') && /\/dp\/[A-Z0-9]{10}/.test(url.pathname);
    } catch {
      return false;
    }
  }, "Enter a valid 10-character ASIN or Amazon product URL");

// Keywords validation
export const keywords = z
  .array(z.string().min(1))
  .max(8, "Max 8 keywords.")
  .optional();

// Fulfilment options
export const fulfilment = z.enum(["FBA", "FBM"]).optional();
export const fulfilmentIntent = z.enum(["FBA", "FBM", "Unsure"]);

// New seller fields
export const productUrl = z.string().url("Enter a valid website/store URL.");

export const shortDesc = z
  .string()
  .min(12, "Add a short product description (min 12 chars).")
  .max(400, "Keep it under 400 characters.");

export const category = z.string().min(2, "Choose a category.");

// Required keywords for new sellers (2-5 keywords)
export const requiredKeywords = z
  .array(z.string().min(1))
  .min(2, "Add at least 2 keywords.")
  .max(5, "Maximum 5 keywords allowed.");

// Image file validation
export const imageFile = z
  .object({
    name: z.string(),
    size: z.number().max(8 * 1024 * 1024, "Max 8MB."),
    type: z.string(),
  })
  .refine(
    (f) => ["image/jpeg", "image/png"].includes(f.type), 
    "JPG or PNG only."
  );

// Complete form schemas
export const existingSellerSchema = z.object({
  asin,
  keywords,
  fulfilment,
  name,
  email,
  phone,
});

export const newSellerSchema = z.object({
  websiteUrl: productUrl.optional(),
  noWebsiteDesc: shortDesc.optional(),
  category,
  desc: shortDesc,
  keywords: requiredKeywords,
  fulfilmentIntent,
  image: imageFile,
  name,
  email,
  phone,
}).refine(
  (data) => !!data.websiteUrl || !!data.noWebsiteDesc,
  { 
    message: "Provide a website URL or a short description.",
    path: ["websiteUrl"] // This will show the error on the websiteUrl field
  }
);

// Type exports for TypeScript
export type ExistingSellerData = z.infer<typeof existingSellerSchema>;
export type NewSellerData = z.infer<typeof newSellerSchema>;
export type ImageFile = z.infer<typeof imageFile>;
