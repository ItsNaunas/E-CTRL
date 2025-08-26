import Container from '@/components/Container';
import Section from '@/components/Section';
import Card from '@/components/Card';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for e-ctrl Amazon audit tool.',
};

export default function PrivacyPage() {
  return (
    <Section className="py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1>Privacy Policy</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Last updated: [DATE] {/* TODO: Add actual date */}
            </p>
          </div>
          
          <Card padding="lg">
            <div className="prose prose-lg max-w-none space-y-8">
              
              {/* TODO: Replace with actual privacy policy content */}
              <section>
                <h2 className="text-xl font-semibold text-foreground">Information We Collect</h2>
                <div className="mt-4 space-y-4 text-muted-foreground">
                  <p>
                    When you use our free Amazon audit tool, we collect the following information:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Personal Information:</strong> Name, email address, and optionally your phone number</li>
                    <li><strong>Product Information:</strong> ASIN/product URLs, keywords, product descriptions, categories, and fulfilment preferences</li>
                    <li><strong>Images:</strong> Product images you upload for analysis (new sellers only)</li>
                    <li><strong>Usage Data:</strong> How you interact with our tool and website</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">How We Use Your Information</h2>
                <div className="mt-4 space-y-4 text-muted-foreground">
                  <p>We use the information you provide to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Generate your personalized Amazon audit report</li>
                    <li>Deliver your full report via email</li>
                    <li>Process uploaded images to generate Amazon-ready variants (future feature)</li>
                    <li>Improve our tool and services</li>
                    <li>Communicate with you about your audit results</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">Data Retention</h2>
                <div className="mt-4 text-muted-foreground">
                  <p>
                    {/* TODO: Define actual retention policy */}
                    We retain your personal information and audit data for [RETENTION_PERIOD] or until you request deletion. 
                    Uploaded images are processed and then deleted within [IMAGE_RETENTION_PERIOD].
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">Data Sharing</h2>
                <div className="mt-4 text-muted-foreground">
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to third parties. 
                    We may share your information only in the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>With your explicit consent</li>
                    <li>To comply with legal obligations</li>
                    <li>With trusted service providers who assist in delivering our services (under strict confidentiality agreements)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">Your Rights (GDPR)</h2>
                <div className="mt-4 space-y-4 text-muted-foreground">
                  <p>Under GDPR, you have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access your personal data</li>
                    <li>Rectify inaccurate personal data</li>
                    <li>Erase your personal data</li>
                    <li>Restrict processing of your personal data</li>
                    <li>Data portability</li>
                    <li>Object to processing</li>
                  </ul>
                  <p className="mt-4">
                    To exercise these rights, contact us at: <a href="mailto:privacy@e-ctrl.example" className="text-accent hover:underline">privacy@e-ctrl.example</a>
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">Security</h2>
                <div className="mt-4 text-muted-foreground">
                  <p>
                    We implement appropriate technical and organizational measures to protect your personal information 
                    against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">Contact Information</h2>
                <div className="mt-4 text-muted-foreground">
                  <p>
                    If you have questions about this Privacy Policy, please contact us at:
                  </p>
                  <div className="mt-4">
                    <p>Email: <a href="mailto:privacy@e-ctrl.example" className="text-accent hover:underline">privacy@e-ctrl.example</a></p>
                    {/* TODO: Add actual contact information */}
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">Changes to This Policy</h2>
                <div className="mt-4 text-muted-foreground">
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by 
                    posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
                  </p>
                </div>
              </section>

            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
