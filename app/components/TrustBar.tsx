'use client';

export default function TrustBar() {
  const trustElements = [
    "🔒 100% Free",
    "⚡ Instant Results", 
    "🛡️ Secure & Private",
    "📧 No Spam"
  ];

  return (
    <section className="py-8 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
          {trustElements.map((element, index) => (
            <div key={index} className="flex items-center gap-2">
              <span>{element}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
