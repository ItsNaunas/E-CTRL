'use client';

export default function Guarantees() {
  const guarantees = [
    {
      icon: "💯",
      title: "Free forever",
      description: "No hidden costs or premium tiers"
    },
    {
      icon: "💳",
      title: "No credit card required",
      description: "Start your audit immediately"
    },
    {
      icon: "🔒",
      title: "Secure & private",
      description: "Your data is never shared"
    },
    {
      icon: "⚡",
      title: "Instant results",
      description: "Get insights in seconds"
    }
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            Why Choose Our Free Amazon Audit Tool?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            We&apos;re committed to helping Amazon sellers succeed with transparent, secure, and effective tools.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((guarantee, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl mb-3">{guarantee.icon}</div>
              <h3 className="font-semibold text-white mb-2">
                {guarantee.title}
              </h3>
              <p className="text-sm text-white/80">
                {guarantee.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-4 text-sm text-white/60 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:border-white/20 transition px-4 py-2">
            <span>🔐 SSL Encrypted</span>
            <span>•</span>
            <span>📧 No spam emails</span>
            <span>•</span>
            <span>🚫 No data selling</span>
          </div>
        </div>
      </div>
    </section>
  );
}
