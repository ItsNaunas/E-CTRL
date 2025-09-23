import Link from 'next/link';
import Container from './Container';
import { copy } from '@/lib/copy';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Brand */}
            <div>
              <Link
                href="/"
                className="text-lg font-semibold text-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                {copy.brand}
              </Link>
              <p className="mt-2 text-sm text-muted-foreground">
                Amazon marketplace expertise, simplified.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Navigation
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Contact */}
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Legal & Contact
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/legal/privacy"
                    className="text-sm text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/terms"
                    className="text-sm text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <a
                    href={`mailto:${copy.contactMailto}`}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/fesal-saleh/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 border-t border-border pt-8">
            <p className="text-sm text-muted-foreground text-center">
              {copy.footer}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
