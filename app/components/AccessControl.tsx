'use client';

import { useState } from 'react';
import CTAButton from '@/components/CTAButton';

interface AccessControlProps {
  mode: 'audit' | 'create';
  onGuestAccess: (email: string) => void;
  onAccountAccess: (email: string, password: string) => void;
}

export default function AccessControl({ mode, onGuestAccess, onAccountAccess }: AccessControlProps) {
  const [accessType, setAccessType] = useState<'guest' | 'account'>('guest');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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

    if (accessType === 'account' && !password) {
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

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (accessType === 'guest') {
      onGuestAccess(email);
    } else {
      onAccountAccess(email, password);
    }
    
    setIsSubmitting(false);
  };

  const isAuditMode = mode === 'audit';
  const title = isAuditMode ? 'Get Your Amazon Audit Report' : 'Create Your Amazon Listing';
  const subtitle = isAuditMode 
    ? 'Choose your access level to unlock your audit insights'
    : 'Choose your access level to create your listing';

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-white">
                {title}
              </h2>
              <p className="text-orange-100 mt-2">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Access Type Selection */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Guest Access */}
                <button
                  onClick={() => setAccessType('guest')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    accessType === 'guest'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📧</div>
                    <h3 className="font-semibold text-gray-900 mb-2">Guest Access</h3>
                    <p className="text-sm text-gray-600 mb-3">Quick preview with email only</p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>• Basic insights preview</div>
                      <div>• Limited recommendations</div>
                      <div>• No account required</div>
                    </div>
                  </div>
                </button>

                {/* Account Access */}
                <button
                  onClick={() => setAccessType('account')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    accessType === 'account'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🚀</div>
                    <h3 className="font-semibold text-gray-900 mb-2">Full Account</h3>
                    <p className="text-sm text-gray-600 mb-3">Complete access with registration</p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>• Full comprehensive report</div>
                      <div>• PDF export & follow-ups</div>
                      <div>• Future perks & updates</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>

              {accessType === 'account' && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Create Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 8 characters, includes letters and numbers
                  </p>
                </div>
              )}

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <CTAButton
                type="submit"
                variant="primary"
                size="lg"
                text={accessType === 'guest' 
                  ? (isAuditMode ? 'get my preview report' : 'get my preview listing')
                  : (isAuditMode ? 'create account & get full report' : 'create account & get full listing')
                }
                fullWidth
                disabled={isSubmitting}
                className="w-full"
              />

              <p className="text-sm text-gray-500 text-center">
                {accessType === 'guest' 
                  ? 'No credit card required • Instant access • Limited preview'
                  : 'Free account • Full access • Export & follow-ups included'
                }
              </p>
            </form>

            {/* Benefits Comparison */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                What&apos;s included with each access level?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Guest Access Benefits */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <span>📧</span>
                    Guest Access
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>2-3 quick win insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Blurred image recommendations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>1-2 checklist items preview</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">○</span>
                      <span className="text-gray-400">No PDF export</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">○</span>
                      <span className="text-gray-400">No follow-up emails</span>
                    </li>
                  </ul>
                </div>

                {/* Account Access Benefits */}
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <span>🚀</span>
                    Full Account
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Complete comprehensive report</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Sharp, detailed image recommendations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Full checklist with effort/impact ratings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>PDF export functionality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
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
