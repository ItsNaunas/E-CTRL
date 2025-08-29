'use client';

import CTAButton from '@/components/CTAButton';

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
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {mode === 'audit' 
              ? 'Ready to Optimize Your Amazon Listing?' 
              : 'Ready to Create Your Amazon Listing?'
            }
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {mode === 'audit'
              ? 'Join thousands of sellers who\'ve improved their sales with our AI-powered audit tool.'
              : 'Join thousands of brand owners who\'ve successfully launched on Amazon using our AI-powered listing creation tool.'
            }
          </p>
          
          <CTAButton
            variant="primary"
            size="lg"
            text={mode === 'audit' ? 'get my free audit report' : 'create my listing now'}
            onClick={handleClick}
            className="mb-4"
            data-testid="repeat-cta-mid"
          />
          
          <p className="text-sm text-gray-500" data-testid="microcopy-free">
            Free forever • No credit card required • Get results in minutes
          </p>
        </div>
      </section>
    );
  }

  // Footer variant
  return (
    <section className="py-12 bg-gray-50 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {mode === 'audit' 
            ? 'Start Your Free Amazon Audit Today' 
            : 'Create Your Amazon Listing Today'
          }
        </h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          {mode === 'audit'
            ? 'Get actionable insights to boost your Amazon sales. No strings attached.'
            : 'Get your complete Amazon listing with 6 optimized images. No strings attached.'
          }
        </p>
        
        <CTAButton
          variant="secondary"
          size="lg"
          text={mode === 'audit' ? 'unlock my audit report' : 'get my listing now'}
          onClick={handleClick}
          className="mb-4"
          data-testid="repeat-cta-footer"
        />
        
        <p className="text-sm text-gray-500" data-testid="microcopy-free">
          Secure & private • No spam • Instant results
        </p>
      </div>
    </section>
  );
}
