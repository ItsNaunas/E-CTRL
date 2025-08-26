export const copy = {
  brand: "e-ctrl",
  heroTitle: "Free Amazon Growth Audit for UK/EU Sellers",
  heroSub: "Built by a former Amazon Marketplace Consultant — get instant, actionable insights.",
  valueCards: [
    { 
      title: "Actionable insights", 
      body: "Consultant-style guidance, not just raw data." 
    },
    { 
      title: "New & existing sellers", 
      body: "Works whether you have an ASIN or are just getting started." 
    },
    { 
      title: "Fast & privacy-aware", 
      body: "Minimal inputs. Clear outcomes." 
    }
  ],
  toolIntro: "Pick your path, fill the form, get a summary now. We'll email the full report.",
  usageNote: "1 free report per email per day.",
  existingSummaryMock: [
    "Listing score: 72/100 (mock)",
    "Add a missing keyword to the title for relevance",
    "Main image meets size; confirm pure white background"
  ],
  newSummaryMock: [
    "Readiness score: 68/100 (mock)",
    "Category is moderately competitive—emphasise benefits in bullets",
    "We'll email your full report and image guidance"
  ],
  footer: "© e-ctrl. All rights reserved.",
  contactMailto: "hello@e-ctrl.example",
  consentLine: "By continuing you agree to our Terms and acknowledge our Privacy Policy. We'll email your report. Uploaded images are processed to generate variants.",
  
  // Navigation
  nav: {
    home: "Home",
    tool: "Tool",
    about: "About"
  },

  // About page content
  about: {
    title: "About e-ctrl",
    subtitle: "Amazon marketplace expertise, simplified.",
    intro: "e-ctrl was built by Fesal, a former Amazon Marketplace Consultant who has helped hundreds of UK and EU sellers optimize their listings and scale their businesses.",
    
    whatWeDo: {
      title: "What we do",
      items: [
        "Listing readiness assessment for new sellers",
        "Keyword strategy and optimization guidance", 
        "Fulfilment method recommendations",
        "Image compliance and optimization advice"
      ]
    },
    
    howItWorks: {
      title: "How the free tool works",
      steps: [
        {
          number: "1",
          title: "Choose your path",
          description: "Tell us if you're already selling on Amazon or just getting started"
        },
        {
          number: "2", 
          title: "Share your details",
          description: "Provide your product info — we only ask for what's needed"
        },
        {
          number: "3",
          title: "Get instant insights", 
          description: "See your summary immediately, with the full report delivered by email"
        }
      ]
    }
  },

  // Tool page content
  tool: {
    title: "Free Amazon Growth Audit",
    subtitle: "Get instant insights for your Amazon business",
    existingTab: "I sell on Amazon",
    newTab: "I don't sell on Amazon yet",
    
    existing: {
      title: "Existing Amazon Seller Audit",
      description: "Get a comprehensive analysis of your current listing"
    },
    
    new: {
      title: "New Seller Readiness Check", 
      description: "See how ready your product is for Amazon marketplace"
    }
  },

  // Form labels and placeholders
  form: {
    asin: {
      label: "ASIN or Product URL",
      placeholder: "B091CMBRKL or https://amazon.co.uk/...",
      help: "Enter your 10-character ASIN or full Amazon product URL"
    },
    keywords: {
      label: "Keywords (optional)",
      placeholder: "gardening gloves, leather gloves...",
      help: "Up to 8 keywords you want to rank for"
    },
    fulfilment: {
      label: "Fulfilment method (optional)",
      placeholder: "Select method...",
      options: {
        fba: "FBA (Fulfillment by Amazon)",
        fbm: "FBM (Fulfillment by Merchant)"
      }
    },
    fulfilmentIntent: {
      label: "Intended fulfilment method",
      placeholder: "Select method...",
      options: {
        fba: "FBA (Fulfillment by Amazon)",
        fbm: "FBM (Fulfillment by Merchant)", 
        unsure: "Not sure yet"
      }
    },
    name: {
      label: "Name",
      placeholder: "Your full name"
    },
    email: {
      label: "Email",
      placeholder: "your@email.com"
    },
    phone: {
      label: "Phone (optional)",
      placeholder: "+44 7xxx xxx xxx"
    },
    websiteUrl: {
      label: "Website or store URL",
      placeholder: "https://yourstore.com",
      help: "If you don't have a website, leave blank and describe your product below"
    },
    noWebsiteDesc: {
      label: "Product description",
      placeholder: "Brief description of your product...",
      help: "Tell us about your product in a few sentences"
    },
    category: {
      label: "Product category",
      placeholder: "Select category...",
      options: [
        "Home & Garden",
        "Sports & Outdoors", 
        "Health & Beauty",
        "Electronics",
        "Fashion",
        "Kitchen & Dining",
        "Pet Supplies",
        "Baby & Child",
        "Automotive",
        "Tools & Home Improvement",
        "Books & Media",
        "Office & Stationery",
        "Other"
      ]
    },
    desc: {
      label: "Short product description",
      placeholder: "What is your product and what makes it special?",
      help: "Keep it under 400 characters"
    },
    keywordsRequired: {
      label: "2-3 main keywords",
      placeholder: "Type and press Enter...",
      help: "Add 2-5 keywords that describe your product"
    },
    image: {
      label: "Product image",
      help: "Upload 1 image (JPG/PNG, max 8MB). We recommend at least 1500×1500px.",
      dropText: "Drop image here or click to browse",
      supportedTypes: "JPG, PNG up to 8MB"
    },
    
    // Buttons
    submit: "Get My Free Audit",
    submitting: "Analyzing...",
    
    // Validation messages
    validation: {
      required: "This field is required",
      email: "Enter a valid email address",
      asin: "Enter a valid 10-character ASIN or Amazon URL",
      keywords: "Maximum 8 keywords allowed",
      imageSize: "Image must be under 8MB",
      imageType: "Please upload a JPG or PNG image",
      minKeywords: "Add at least 2 keywords",
      maxKeywords: "Maximum 5 keywords allowed"
    }
  }
};
