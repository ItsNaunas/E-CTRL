'use client';

export default function TrustBar() {
  const trustElements = [
    "🔒 100% Free",
    "⚡ Instant Results", 
    "🛡️ Secure & Private",
    "📧 No Spam"
  ];

  const trustLogos = [
    {
      name: "Amazon Partner",
      placeholder: "🏢 Amazon Partner",
      description: "Official Amazon Marketplace Partner"
    },
    {
      name: "GDPR Compliant", 
      placeholder: "🔐 GDPR Compliant",
      description: "EU Data Protection Compliant"
    },
    {
      name: "SSL Secured",
      placeholder: "🔒 SSL Secured", 
      description: "256-bit SSL Encryption"
    },
    {
      name: "Trustpilot 4.8★",
      placeholder: "⭐ Trustpilot 4.8★",
      description: "Rated 4.8/5 by 2,847 sellers"
    }
  ];

  return (
    <section className="py-8 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Basic Trust Elements */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground mb-6">
          {trustElements.map((element, index) => (
            <div key={index} className="flex items-center gap-2">
              <span>{element}</span>
            </div>
          ))}
        </div>
        
        {/* Professional Trust Logos */}
        <div className="border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground mb-4">
            Trusted by Amazon sellers worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {trustLogos.map((logo, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="text-lg font-semibold text-foreground mb-1">
                  {logo.placeholder}
                </div>
                <div className="text-xs text-muted-foreground">
                  {logo.description}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Press Mentions Placeholder */}
        <div className="border-t border-border pt-6 mt-6">
          <p className="text-center text-xs text-muted-foreground mb-3">
            Featured in:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <span>📰 Amazon Seller Central</span>
            <span>📰 E-commerce Weekly</span>
            <span>📰 UK Business News</span>
          </div>
        </div>
      </div>
    </section>
  );
}
