'use client';

import Link from 'next/link';
import Image from 'next/image';
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
            className="flex items-center transition-colors hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
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
