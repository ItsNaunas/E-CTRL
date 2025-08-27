'use client';

import CTAButton from '../../components/CTAButton';

interface PartialResultProps {
  score: number;
  highlights: string[];
  onUnlock: () => void;
}

export default function PartialResult({ score, highlights, onUnlock }: PartialResultProps) {
  return (
    <section className="py-16 bg-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Your Amazon Listing Audit
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Here's what we found in your listing analysis:
          </p>
          
          <div className="bg-background rounded-lg border border-border p-8 mb-8">
            <div className="mb-6">
              <div className="text-4xl font-bold text-accent mb-2">
                {score}/100
              </div>
              <div className="text-muted-foreground">
                Overall Listing Score
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground mb-4">Key Findings:</h3>
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3 text-left">
                  <span className="text-accent mt-1">•</span>
                  <span className="text-foreground">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-foreground mb-2">
              🔒 Get Your Complete Report
            </h3>
            <p className="text-muted-foreground mb-4">
              Enter your email to receive the full detailed audit with specific recommendations and action steps.
            </p>
            <CTAButton
              variant="primary"
              size="lg"
              text="report"
              onClick={onUnlock}
              className="w-full sm:w-auto"
            />
          </div>
          
          <p className="text-sm text-muted-foreground">
            💡 <strong>Pro tip:</strong> The full report includes keyword suggestions, image optimization tips, and conversion rate improvements.
          </p>
        </div>
      </div>
    </section>
  );
}
