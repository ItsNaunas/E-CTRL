import Link from 'next/link';
import { ArrowRight, CheckCircle, Users, Zap } from 'lucide-react';
import Container from '@/components/Container';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { copy } from '@/lib/copy';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <Container>
          <div className="text-center">
            <h1 className="mx-auto max-w-4xl">
              {copy.heroTitle}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              {copy.heroSub}
            </p>
            <div className="mt-10">
              <Link href="/tool">
                <Button size="lg" className="group">
                  Use the Free Tool
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* Value Proposition Cards */}
      <Section className="py-16 bg-muted">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {copy.valueCards.map((card, index) => {
              const icons = [CheckCircle, Users, Zap];
              const Icon = icons[index];
              
              return (
                <Card key={index}>
                  <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {card.body}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* How It Works */}
      <Section>
        <Container>
          <div className="text-center">
            <h2>How it works</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Get actionable insights for your Amazon business in three simple steps.
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Choose your path",
                description: "Tell us if you're already selling on Amazon or just getting started"
              },
              {
                step: "2", 
                title: "Share your details",
                description: "Provide your product info — we only ask for what's needed"
              },
              {
                step: "3",
                title: "Get instant insights", 
                description: "See your summary immediately, with the full report delivered by email"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground text-lg font-semibold">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-accent text-accent-foreground">
        <Container>
          <div className="text-center">
            <h2 className="text-accent-foreground">
              Ready to optimize your Amazon business?
            </h2>
            <p className="mt-4 text-lg text-accent-foreground/90 max-w-2xl mx-auto">
              Get started with our free audit tool and discover opportunities to grow your sales.
            </p>
            <div className="mt-8">
              <Link href="/tool">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-accent-foreground text-accent hover:bg-accent-foreground/90 group"
                >
                  Start Your Free Audit
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
