import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useToastHelpers } from '@/lib/toast';
import UnifiedCTA from './UnifiedCTA';

interface LoginProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

export default function Login({ onSuccess, onCancel, showCancel = true }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { success, error: showError } = useToastHelpers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Track successful login
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'login', {
            event_category: 'engagement',
            event_label: 'successful_login'
          });
        }
        
        success('Login successful!', 'Welcome back!');
        onSuccess?.();
      } else {
        const errorMessage = result.error || 'Login failed';
        setError(errorMessage);
        showError('Login failed', errorMessage);
      }
    } catch (error) {
      const errorMessage = 'Login failed. Please try again.';
      setError(errorMessage);
      showError('Connection error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-white/80">Sign in to access your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#296AFF] focus:border-transparent"
            placeholder="Enter your email"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#296AFF] focus:border-transparent"
            placeholder="Enter your password"
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-4">
          <UnifiedCTA
            variant="primary"
            size="lg"
            text={isLoading ? "Signing In..." : "Sign In"}
            disabled={isLoading}
            className="w-full"
          />

          {showCancel && onCancel && (
            <UnifiedCTA
              variant="secondary"
              size="lg"
              text="Cancel"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full"
            />
          )}
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-white/60 text-sm">
          Don&apos;t have an account?{' '}
          <button 
            onClick={onCancel}
            className="text-[#296AFF] hover:text-[#296AFF]/80 font-medium"
          >
            Create one now
          </button>
        </p>
      </div>
    </div>
  );
}
