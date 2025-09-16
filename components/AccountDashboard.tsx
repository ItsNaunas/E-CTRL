import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import UnifiedCTA from './UnifiedCTA';

export default function AccountDashboard() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Account Dashboard</h1>
          <p className="text-white/70">Welcome back, {user.name}!</p>
        </div>
        <UnifiedCTA
          variant="secondary"
          size="sm"
          text={isLoggingOut ? "Signing out..." : "Sign Out"}
          onClick={handleLogout}
          disabled={isLoggingOut}
        />
      </div>

      {/* Account Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-white/60">Name</label>
              <p className="text-white">{user.name}</p>
            </div>
            <div>
              <label className="text-sm text-white/60">Email</label>
              <p className="text-white">{user.email}</p>
            </div>
            <div>
              <label className="text-sm text-white/60">Account Status</label>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${user.emailVerified ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                <p className="text-white">
                  {user.emailVerified ? 'Verified' : 'Email not verified'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Account Benefits</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-[#296AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-white/90">5 reports per day</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-[#296AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-white/90">Complete PDF reports</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-[#296AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-white/90">Report history & tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-[#296AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-white/90">Priority support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-white/60 mt-4">No reports generated yet</p>
          <p className="text-white/40 text-sm mt-2">Your audit reports will appear here</p>
        </div>
      </div>
    </div>
  );
}
