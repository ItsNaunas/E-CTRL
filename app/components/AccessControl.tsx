'use client';

import { useState } from 'react';
import { useToastHelpers } from '@/lib/toast';
import UnifiedCTA from '@/components/UnifiedCTA';

interface AccessControlProps {
  mode: 'audit' | 'create';
  onGuestAccess: (email: string) => void;
  onAccountAccess: (email: string, password: string) => void;
}

export default function AccessControl({ mode, onGuestAccess, onAccountAccess }: AccessControlProps) {
  const [accessType, setAccessType] = useState<'guest' | 'account' | 'login'>('guest');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [promotionalConsent, setPromotionalConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { success, error: showError, info } = useToastHelpers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Basic validation
    if (!email) {
      setError('Please enter your email address');
      setIsSubmitting(false);
      return;
    }

    if (accessType === 'account' && !name) {
      setError('Please enter your name');
      setIsSubmitting(false);
      return;
    }

    if ((accessType === 'account' || accessType === 'login') && !password) {
      setError('Please enter a password');
      setIsSubmitting(false);
      return;
    }

    // Track access type selection
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'access_type_selected', {
        event_category: 'engagement',
        event_label: accessType,
        value: accessType === 'account' ? 1 : 0
      });
    }

    try {
      if (accessType === 'guest') {
        info('Starting analysis...', 'Generating your preview report');
        onGuestAccess(email);
      } else if (accessType === 'login') {
        // For login, call the login API
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          const result = await response.json();
          success('Login successful!', `Welcome back, ${result.user?.name || 'there'}!`);
          onAccountAccess(email, password);
        } else {
          const errorData = await response.json();
          const errorMessage = errorData.error || 'Login failed';
          setError(errorMessage);
          showError('Login failed', errorMessage);
        }
      } else {
        // For account creation, call the registration API
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, promotionalConsent })
        });

        if (response.ok) {
          const result = await response.json();
          success('Account created!', `Welcome to e-ctrl, ${name}! Generating your full report...`);
          onAccountAccess(email, password);
        } else {
          const errorData = await response.json();
          const errorMessage = errorData.error || 'Failed to create account';
          setError(errorMessage);
          showError('Registration failed', errorMessage);
        }
      }
    } catch (error) {
      console.error('Error during access:', error);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      showError('Connection error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAuditMode = mode === 'audit';
  const title = isAuditMode ? 'Get Your Amazon Audit Report' : 'Create Your Amazon Listing';
  const subtitle = isAuditMode 
    ? 'Choose your access level to unlock your audit insights'
    : 'Choose your access level to create your listing';

  return (
    <section className="py-16 bg-[#0B0B0C]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B0B0C] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] px-8 py-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white/10 mb-4">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">
                {title}
              </h2>
              <p className="text-white/90 mt-2">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Access Type Selection */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Guest Access */}
                <button
                  onClick={() => setAccessType('guest')}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    accessType === 'guest'
                      ? 'border-[#296AFF] bg-[#296AFF]/10'
                      : 'border-white/20 hover:border-white/40 bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                      accessType === 'guest' ? 'border-[#296AFF] bg-[#296AFF]' : 'border-white/40'
                    }`}>
                      {accessType === 'guest' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-semibold text-lg">Guest Access</h3>
                        <span className="bg-[#296AFF]/20 text-[#296AFF] px-2 py-1 rounded-full text-xs font-medium">Free</span>
                      </div>
                      <p className="text-white/70 text-sm mb-4">Quick access with just your email. Get your report instantly.</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <svg className="h-4 w-4 text-[#296AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Instant report delivery</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <svg className="h-4 w-4 text-[#296AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>PDF download</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <svg className="h-4 w-4 text-[#296AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Basic analysis</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Account Access */}
                <button
                  onClick={() => setAccessType('account')}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    accessType === 'account'
                      ? 'border-[#FF7D2B] bg-[#FF7D2B]/10'
                      : 'border-white/20 hover:border-white/40 bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                      accessType === 'account' ? 'border-[#FF7D2B] bg-[#FF7D2B]' : 'border-white/40'
                    }`}>
                      {accessType === 'account' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-semibold text-lg">Create Account</h3>
                        <span className="bg-[#FF7D2B]/20 text-[#FF7D2B] px-2 py-1 rounded-full text-xs font-medium">Enhanced</span>
                      </div>
                      <p className="text-white/70 text-sm mb-4">Save your reports, track progress, and get enhanced analysis features.</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <svg className="h-4 w-4 text-[#FF7D2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Everything in Guest Access</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <svg className="h-4 w-4 text-[#FF7D2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Enhanced AI analysis</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <svg className="h-4 w-4 text-[#FF7D2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Report history & tracking</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <svg className="h-4 w-4 text-[#FF7D2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Priority support</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Login Access */}
                <button
                  onClick={() => setAccessType('login')}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    accessType === 'login'
                      ? 'border-[#296AFF] bg-[#296AFF]/10'
                      : 'border-white/20 hover:border-white/40 bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                      accessType === 'login' ? 'border-[#296AFF] bg-[#296AFF]' : 'border-white/40'
                    }`}>
                      {accessType === 'login' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-semibold text-lg">Sign In</h3>
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">Returning</span>
                      </div>
                      <p className="text-white/70 text-sm mb-4">Already have an account? Sign in to access your enhanced features.</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <svg className="h-4 w-4 text-[#296AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Access saved reports</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <svg className="h-4 w-4 text-[#296AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Account dashboard</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <svg className="h-4 w-4 text-[#296AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Higher daily limits</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {accessType === 'account' && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="block w-full rounded-lg border border-white/20 bg-[#0B0B0C] px-4 py-3 text-white placeholder-white/50 focus:border-[#FF7D2B] focus:ring-[#FF7D2B] transition-colors"
                    required
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="block w-full rounded-lg border border-white/20 bg-[#0B0B0C] px-4 py-3 text-white placeholder-white/50 focus:border-[#296AFF] focus:ring-[#296AFF] transition-colors"
                  required
                />
              </div>

              {(accessType === 'account' || accessType === 'login') && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                    {accessType === 'login' ? 'Password' : 'Create Password'}
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="block w-full rounded-lg border border-white/20 bg-[#0B0B0C] px-4 py-3 text-white placeholder-white/50 focus:border-[#FF7D2B] focus:ring-[#FF7D2B] transition-colors"
                    required
                  />
                  <p className="text-xs text-white/60 mt-1">
                    Minimum 8 characters, includes letters and numbers
                  </p>
                </div>
              )}

              {accessType === 'account' && (
                <div className="flex items-start gap-3">
                  <input
                    id="promotional-consent"
                    type="checkbox"
                    checked={promotionalConsent}
                    onChange={(e) => setPromotionalConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-[#0B0B0C] text-[#FF7D2B] focus:ring-[#FF7D2B] focus:ring-offset-0"
                  />
                  <label htmlFor="promotional-consent" className="text-sm text-white/80 leading-relaxed">
                    I agree to receive promotional emails about Amazon selling tips, new features, and special offers. 
                    <span className="text-white/60"> (You can unsubscribe anytime)</span>
                  </label>
                </div>
              )}

              {error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-sm text-red-400" role="alert">
                    {error}
                  </p>
                </div>
              )}

              <UnifiedCTA
                type="submit"
                variant="primary"
                size="lg"
                text={
                  isSubmitting 
                    ? 'Processing...'
                    : accessType === 'guest' 
                    ? (isAuditMode ? 'get my preview report' : 'get my preview listing')
                    : accessType === 'login'
                    ? (isAuditMode ? 'sign in & get full report' : 'sign in & get full listing')
                    : (isAuditMode ? 'create account & get full report' : 'create account & get full listing')
                }
                fullWidth
                disabled={isSubmitting}
                className="w-full"
              />

              <p className="text-sm text-white/70 text-center">
                {accessType === 'guest' 
                  ? 'No credit card required • Instant access • Limited preview'
                  : 'Free account • Full access • Export & follow-ups included'
                }
              </p>
            </form>

            {/* Benefits Comparison */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                What&apos;s included with each access level?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Guest Access Benefits */}
                <div className="bg-gradient-to-br from-[#296AFF]/10 to-[#296AFF]/5 rounded-lg p-4 border border-[#296AFF]/20">
                  <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#296AFF]/20 flex items-center justify-center">
                      <svg className="h-4 w-4 text-[#296AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    Guest Access
                  </h4>
                  <ul className="text-sm text-white/80 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[#296AFF] mt-1">✓</span>
                      <span>2-3 quick win insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#296AFF] mt-1">✓</span>
                      <span>Basic listing optimization insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#296AFF] mt-1">✓</span>
                      <span>1-2 checklist items preview</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-white/40 mt-1">○</span>
                      <span className="text-white/40">No PDF export</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-white/40 mt-1">○</span>
                      <span className="text-white/40">No follow-up emails</span>
                    </li>
                  </ul>
                </div>

                {/* Account Access Benefits */}
                <div className="bg-gradient-to-br from-[#FF7D2B]/10 to-[#FF7D2B]/5 rounded-lg p-4 border border-[#FF7D2B]/20">
                  <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#FF7D2B]/20 flex items-center justify-center">
                      <svg className="h-4 w-4 text-[#FF7D2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    Full Account
                  </h4>
                  <ul className="text-sm text-white/80 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[#FF7D2B] mt-1">✓</span>
                      <span>Complete comprehensive report</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FF7D2B] mt-1">✓</span>
                      <span>Detailed listing optimization recommendations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FF7D2B] mt-1">✓</span>
                      <span>Full checklist with effort/impact ratings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FF7D2B] mt-1">✓</span>
                      <span>PDF export functionality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FF7D2B] mt-1">✓</span>
                      <span>Automated follow-up system</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
