'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, Users, Zap } from 'lucide-react';
import Container from '@/components/Container';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Button from '@/components/Button';
import CTAButton from '@/components/CTAButton';
import EmailCapture from '@/components/EmailCapture';
import Hero from '@/components/Hero';
import { copy } from '@/lib/copy';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

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

             {/* Email Capture Section */}
       <EmailCapture 
         onEmailSubmit={(email) => {
           console.log('Email submitted:', email);
           // TODO: Send email to backend
         }}
       />

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
               <CTAButton
                 variant="secondary"
                 size="lg"
                 text="audit"
                 href="/tool"
                 className="bg-accent-foreground text-accent hover:bg-accent-foreground/90 group"
               />
             </div>
           </div>
         </Container>
       </Section>
    </>
  );
}
