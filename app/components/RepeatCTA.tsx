'use client';

import CTAButton from '@/components/CTAButton';

export default function RepeatCTA() {
  return (
    <section className="py-16 bg-accent text-accent-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-accent-foreground mb-4">
            Ready to optimize your Amazon business?
          </h2>
          <p className="text-lg text-accent-foreground/90 max-w-2xl mx-auto mb-8">
            Join thousands of sellers who've improved their listings with our free audit tool.
          </p>
          <CTAButton
            variant="secondary"
            size="lg"
            text="audit"
            href="/tool"
            className="bg-accent-foreground text-accent hover:bg-accent-foreground/90"
          />
        </div>
      </div>
    </section>
  );
}
