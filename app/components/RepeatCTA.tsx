'use client';

import UnifiedCTA from '@/components/UnifiedCTA';

interface RepeatCTAProps {
  variant?: 'mid' | 'footer';
  onCtaClick: () => void;
  mode?: 'audit' | 'create';
}

export default function RepeatCTA({ variant = 'mid', onCtaClick, mode = 'audit' }: RepeatCTAProps) {
  const handleClick = () => {
    // Track repeat CTA click
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'repeat_cta_click', {
        event_category: 'engagement',
        event_label: `repeat_cta_${variant}`
      });
    }
    onCtaClick();
  };

  if (variant === 'mid') {
    return (
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            {mode === 'audit' 
              ? 'Ready to Optimize Your Amazon Listing?' 
              : 'Ready to Create Your Amazon Listing?'
            }
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            {mode === 'audit'
              ? 'Join thousands of sellers who\'ve improved their sales with our AI-powered audit tool.'
              : 'Join thousands of brand owners who\'ve successfully launched on Amazon using our AI-powered listing creation tool.'
            }
          </p>
          
          <UnifiedCTA
            variant="primary"
            size="lg"
            text={mode === 'audit' ? 'get my free audit report' : 'create my listing now'}
            onClick={handleClick}
            className="mb-4"
            data-testid="repeat-cta-mid"
          />
          
          <p className="text-sm text-white/70" data-testid="microcopy-free">
            Free forever • No credit card required • Get results in minutes
          </p>
        </div>
      </section>
    );
  }

  // Footer variant
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
          {mode === 'audit' 
            ? 'Start Your Free Amazon Audit Today' 
            : 'Create Your Amazon Listing Today'
          }
        </h2>
        <p className="text-white/70 mb-6 max-w-xl mx-auto">
          {mode === 'audit'
            ? 'Get actionable insights to boost your Amazon sales. No strings attached.'
            : 'Get your complete Amazon listing optimization checklist. No strings attached.'
          }
        </p>
        
        <UnifiedCTA
          variant="secondary"
          size="lg"
          text={mode === 'audit' ? 'unlock my audit report' : 'get my listing now'}
          onClick={handleClick}
          className="mb-4"
          data-testid="repeat-cta-footer"
        />
        
        <p className="text-sm text-white/70" data-testid="microcopy-free">
          Secure & private • No spam • Instant results
        </p>
      </div>
    </section>
  );
}
