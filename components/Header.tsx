'use client';

import Link from 'next/link';
import CTAButton from './CTAButton';
import { copy } from '@/lib/copy';

export default function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-semibold text-foreground transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            {copy.brand}
          </Link>

          {/* CTA Button - No navigation distractions */}
          <CTAButton
            variant="sticky"
            size="sm"
            text="audit"
            href="/tool"
            className="hidden sm:block"
          />
        </div>
      </div>
    </header>
  );
}
