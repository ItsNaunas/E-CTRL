'use client';

import Link from 'next/link';
import Image from 'next/image';
import UnifiedCTA from './UnifiedCTA';
import { copy } from '@/lib/copy';

export default function Header() {
  return (
    <header className="bg-[#0B0B0C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Hidden on mobile */}
          <Link
            href="/"
            className="hidden md:flex items-center transition-colors hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            <Image
              src="/logos/logo.png"
              alt="e-ctrl"
              width={1020}
              height={306}
              className="h-36 w-auto"
              priority
            />
          </Link>

          {/* CTA Button - No navigation distractions */}
          <UnifiedCTA
            variant="primary"
            size="sm"
            text="Get Free Audit"
            href="#hero"
            className="hidden sm:block"
          />
        </div>
      </div>
    </header>
  );
}
