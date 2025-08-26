import { CheckCircle } from 'lucide-react';
import Container from '@/components/Container';
import Section from '@/components/Section';
import Card from '@/components/Card';
import { copy } from '@/lib/copy';

export const metadata = {
  title: 'About',
  description: 'Learn about e-ctrl and our Amazon marketplace expertise.',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <Container>
          <div className="text-center">
            <h1>{copy.about.title}</h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              {copy.about.subtitle}
            </p>
          </div>
        </Container>
      </Section>

      {/* About Content */}
      <Section className="py-16 bg-muted">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Card padding="lg">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {copy.about.intro}
                </p>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* What We Do */}
      <Section>
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2>{copy.about.whatWeDo.title}</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our expertise covers all aspects of Amazon marketplace success
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {copy.about.whatWeDo.items.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* How It Works */}
      <Section className="bg-muted">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2>{copy.about.howItWorks.title}</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Simple, straightforward process with immediate value
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {copy.about.howItWorks.steps.map((step, index) => (
                <Card key={index}>
                  <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground text-lg font-semibold">
                      {step.number}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Background */}
      <Section>
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2>Experience you can trust</h2>
            <div className="mt-8 space-y-6 text-lg text-muted-foreground">
              <p>
                Fesal brings years of hands-on experience as an Amazon Marketplace Consultant, 
                having worked with hundreds of UK and EU sellers across diverse product categories.
              </p>
              <p>
                From startup sellers launching their first product to established brands optimizing 
                their marketplace presence, our insights are grounded in real-world success stories 
                and proven strategies.
              </p>
              <p>
                The e-ctrl tool distills this expertise into actionable insights that you can 
                implement immediately, whether you&apos;re just getting started or looking to scale 
                your existing Amazon business.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
