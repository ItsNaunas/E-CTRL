import Container from '@/components/Container';
import Section from '@/components/Section';
import Card from '@/components/Card';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for e-ctrl Amazon audit tool.',
};

export default function TermsPage() {
  return (
    <Section className="py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1>Terms of Service</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Last updated: December 2024
            </p>
          </div>
          
          <Card padding="lg">
            <div className="prose prose-lg max-w-none space-y-8">
              
              {/* Terms of Service Content - Template Ready for Legal Review */}
              <section>
                <h2 className="text-xl font-semibold text-foreground">Acceptance of Terms</h2>
                <div className="mt-4 text-muted-foreground">
                  <p>
                    By accessing and using the e-ctrl Amazon audit tool (&quot;Service&quot;), you accept and agree to be bound by 
                    the terms and provision of this agreement.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">Description of Service</h2>
                <div className="mt-4 space-y-4 text-muted-foreground">
                  <p>
                    e-ctrl provides a free Amazon marketplace audit tool that analyzes product listings and provides 
                    recommendations for optimization. The service includes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Listing analysis for existing Amazon sellers</li>
                    <li>Readiness assessment for new sellers</li>
                    <li>Keyword optimization recommendations</li>
                    <li>Image compliance guidance</li>
                    <li>Fulfilment method recommendations</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">Free Service Limitations</h2>
                <div className="mt-4 space-y-4 text-muted-foreground">
                  <p>
                    The free audit tool is limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>One report per email address per day</li>
                    <li>Basic analysis and recommendations</li>
                    <li>Summary results displayed on-site with detailed reports delivered via email</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">User Responsibilities</h2>
                <div className="mt-4 space-y-4 text-muted-foreground">
                  <p>You agree to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate information when using our tool</li>
                    <li>Use the service only for legitimate business purposes</li>
                    <li>Not attempt to circumvent usage limitations</li>
                    <li>Not upload inappropriate, copyrighted, or harmful content</li>
                    <li>Comply with all applicable laws and Amazon&apos;s terms of service</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">Disclaimer of Warranties</h2>
                <div className="mt-4 text-muted-foreground">
                  <p>
                    The service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>The service will meet your specific requirements</li>
                    <li>The recommendations will result in improved sales or rankings</li>
                    <li>The service will be uninterrupted, timely, secure, or error-free</li>
                    <li>Any errors in the service will be corrected</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">Limitation of Liability</h2>
                <div className="mt-4 text-muted-foreground">
                  <p>
                    In no event shall e-ctrl be liable for any indirect, incidental, special, consequential, or punitive 
                    damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
                    resulting from your use of the service.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">Prohibited Content</h2>
                <div className="mt-4 space-y-4 text-muted-foreground">
                  <p>You may not upload or submit content that:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Infringes on intellectual property rights</li>
                    <li>Contains malicious code or viruses</li>
                    <li>Is illegal, harmful, threatening, abusive, or offensive</li>
                    <li>Violates Amazon&apos;s terms of service or community guidelines</li>
                    <li>Contains personal information of third parties without consent</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">Amazon Relationship</h2>
                <div className="mt-4 text-muted-foreground">
                  <p>
                    e-ctrl is not affiliated with, endorsed by, or sponsored by Amazon. All Amazon trademarks and 
                    product names are the property of Amazon.com, Inc. or its affiliates.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">Termination</h2>
                <div className="mt-4 text-muted-foreground">
                  <p>
                    We reserve the right to terminate or suspend access to our service immediately, without prior notice 
                    or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">Changes to Terms</h2>
                <div className="mt-4 text-muted-foreground">
                  <p>
                    We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                    we will try to provide at least 30 days notice prior to any new terms taking effect.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">Contact Information</h2>
                <div className="mt-4 text-muted-foreground">
                  <p>
                    If you have any questions about these Terms, please contact us at:
                  </p>
                  <div className="mt-4">
                    <p>Email: <a href="mailto:contact@e-ctrl.co.uk" className="text-accent hover:underline">contact@e-ctrl.co.uk</a></p>
                    {/* Contact information provided above */}
                  </div>
                </div>
              </section>

            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
