'use client';

export default function Benefits() {
  const benefits = [
    {
      icon: "🎯",
      title: "Find keyword gaps",
      description: "Discover missing terms that drive traffic"
    },
    {
      icon: "📸",
      title: "Fix image compliance issues",
      description: "Ensure your images meet Amazon standards"
    },
    {
      icon: "💬",
      title: "Improve bullet clarity",
      description: "Make your product benefits crystal clear"
    },
    {
      icon: "📈",
      title: "Increase conversion confidence",
      description: "Optimize for higher click-through rates"
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            What you&apos;ll discover
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI audit reveals specific opportunities to boost your Amazon performance.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center p-6 rounded-lg border border-border bg-background">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-xl mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
