'use client';

export default function HowItWorks() {
  const steps = [
    {
      icon: "🔍",
      title: "Enter your ASIN",
      description: "Paste your Amazon product URL or ASIN"
    },
    {
      icon: "🤖", 
      title: "AI Audit",
      description: "Our AI analyzes your listing in seconds"
    },
    {
      icon: "📧",
      title: "Report Delivered",
      description: "Get your detailed report via email"
    }
  ];

  return (
    <section className="py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get actionable insights for your Amazon business in three simple steps.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl mb-4">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
