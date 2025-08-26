'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Container from './Container';
import { copy } from '@/lib/copy';

export default function Header() {
  const pathname = usePathname();

  const navigation = [
    { name: copy.nav.home, href: '/' },
    { name: copy.nav.tool, href: '/tool' },
    { name: copy.nav.about, href: '/about' },
  ];

  return (
    <header className="border-b border-border bg-background">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-semibold text-foreground transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            {copy.brand}
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex md:space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                    isActive
                      ? 'text-accent'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button - simplified for MVP */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-muted-foreground hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}
