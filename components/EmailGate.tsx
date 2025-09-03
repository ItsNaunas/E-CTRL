'use client';

import { useState } from 'react';
import { z } from 'zod';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import { copy } from '@/lib/copy';
// Mock data import removed - using real data

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(1, 'Name is required'),
});

interface EmailGateProps {
  result: SummaryResult;
  onEmailSubmit: (email: string, name: string) => Promise<void>;
  isSubmitting?: boolean;
}

export default function EmailGate({ result, onEmailSubmit, isSubmitting = false }: EmailGateProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = emailSchema.parse({ email, name });
      await onEmailSubmit(validatedData.email, validatedData.name);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Blurred Preview */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white z-10" />
        <div className="relative z-20">
          <div className="space-y-4">
            {/* Header with score */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {result.title}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">
                  {result.score}
                </span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </div>

            {/* Blurred content */}
            <div className="space-y-3 opacity-60">
              {result.highlights && result.highlights.length > 0 ? (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-foreground">Key Findings:</h5>
                  <div className="space-y-2">
                    {result.highlights.slice(0, 2).map((highlight, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                        <p className="text-sm text-foreground leading-relaxed">
                          {highlight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : result.bullets ? (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-foreground">Insights:</h5>
                  <div className="space-y-2">
                    {result.bullets.slice(0, 2).map((bullet, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                        <p className="text-sm text-foreground leading-relaxed">
                          {bullet}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* More content indicator */}
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                + {(() => {
                  const highlightsLength = result.highlights?.length || 0;
                  const bulletsLength = result.bullets?.length || 0;
                  if (highlightsLength > 2) return highlightsLength - 2;
                  if (bulletsLength > 2) return bulletsLength - 2;
                  return 0;
                })()} more insights
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Email Gate */}
      <Card className="border-2 border-dashed border-accent/30 bg-accent/5">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Get Your Full AI-Powered Report
            </h3>
            <p className="text-sm text-muted-foreground">
              Enter your details below to unlock the complete analysis with actionable recommendations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
            <Input
              label="Name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              required
            />
            
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />

            <Button
              type="submit"
              size="lg"
              loading={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Unlocking Report...' : 'Unlock Full Report'}
            </Button>
          </form>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>✓ Free forever - no credit card required</p>
            <p>✓ Get instant access to your personalized report</p>
            <p>✓ Receive expert Amazon optimization tips</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
