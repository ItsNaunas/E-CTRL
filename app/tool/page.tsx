'use client';

import { useState } from 'react';
import { z } from 'zod';
import Container from '@/components/Container';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Tabs from '@/components/Tabs';
import ChipsInput from '@/components/ChipsInput';
import FileDropzone from '@/components/FileDropzone';
import SummaryCard from '@/components/SummaryCard';
import EmailGate from '../components/EmailGate';
import ListingPackCard from '@/components/ListingPackCard';
import { copy } from '@/lib/copy';
import { 
  existingSellerSchema, 
  newSellerSchema,
  type ExistingSellerData,
  type NewSellerData,
  type ImageFile
} from '@/lib/validation';
import type { SummaryResult } from '@/types/ai';

export default function ToolPage() {
  const [activeTab, setActiveTab] = useState('existing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [currentLeadId, setCurrentLeadId] = useState<string | null>(null);
  
  // Form state for existing sellers
  const [existingForm, setExistingForm] = useState<Partial<ExistingSellerData>>({
    asin: '',
    keywords: [],
    fulfilment: undefined,
    name: '',
    email: '',
    phone: '',
  });
  
  // Form state for new sellers
  const [newForm, setNewForm] = useState<Partial<NewSellerData>>({
    websiteUrl: '',
    noWebsiteDesc: '',
    category: '',
    desc: '',
    keywords: [],
    fulfilmentIntent: undefined,
    image: undefined,
    name: '',
    email: '',
    phone: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  const handleExistingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const validatedData = existingSellerSchema.parse(existingForm);
      
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'existing_seller', data: validatedData }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === 'Rate limit exceeded. One report per email per day.') {
          setErrors({ email: 'You can only request one report per email per day. Please try again tomorrow.' });
        } else {
          setErrors({ general: errorData.error || 'Failed to generate report' });
        }
        return;
      }
      
      const result = await response.json();
      setSummary(result.result);
      setCurrentLeadId(result.leadId);
      setShowEmailGate(true); // Show email gate for guests
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const validatedData = newSellerSchema.parse(newForm);
      
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'new_seller', data: validatedData }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === 'Rate limit exceeded. One report per email per day.') {
          setErrors({ email: 'You can only request one report per email per day. Please try again tomorrow.' });
        } else {
          setErrors({ general: errorData.error || 'Failed to generate report' });
        }
        return;
      }
      
      const result = await response.json();
      setSummary(result.result);
      setCurrentLeadId(result.leadId);
      setShowEmailGate(true); // Show email gate for guests
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateKeywordSuggestions = async () => {
    if (!newForm.category || !newForm.desc) {
      setErrors({ general: 'Please fill in category and description first' });
      return;
    }

    setIsGeneratingSuggestions(true);
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'keywords',
          data: {
            category: newForm.category,
            description: newForm.desc
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setNewForm(prev => ({ 
          ...prev, 
          keywords: result.suggestions.slice(0, 5) // Take first 5 suggestions
        }));
      } else {
        setErrors({ general: 'Failed to generate keyword suggestions' });
      }
    } catch (error) {
      setErrors({ general: 'Failed to generate suggestions' });
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const handleEmailSubmit = async (email: string) => {
    setIsEmailSubmitting(true);
    try {
      if (!currentLeadId) {
        throw new Error('No lead ID available');
      }

      // Send email to database
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: '', // Name not available in this EmailGate component
          leadId: currentLeadId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit email');
      }

      // Unlock the full report
      setShowEmailGate(false);
      
    } catch (error) {
      console.error('Email submission failed:', error);
      setErrors({ general: 'Failed to submit email. Please try again.' });
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  const existingSellerForm = (
    <form onSubmit={handleExistingSubmit} className="space-y-6">
      <Card>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">{copy.tool.existing.title}</h3>
            <p className="mt-2 text-muted-foreground">
              {copy.tool.existing.description}
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label={copy.form.asin.label}
              placeholder={copy.form.asin.placeholder}
              help={copy.form.asin.help}
              value={existingForm.asin || ''}
              onChange={(e) => setExistingForm(prev => ({ ...prev, asin: e.target.value }))}
              error={errors.asin}
              required
            />
            
            <Select
              label={copy.form.fulfilment.label}
              placeholder={copy.form.fulfilment.placeholder}
              options={[
                { value: 'FBA', label: copy.form.fulfilment.options.fba },
                { value: 'FBM', label: copy.form.fulfilment.options.fbm },
              ]}
              value={existingForm.fulfilment || ''}
              onChange={(e) => setExistingForm(prev => ({ ...prev, fulfilment: e.target.value as 'FBA' | 'FBM' || undefined }))}
              error={errors.fulfilment}
            />
          </div>
          
          <ChipsInput
            label={copy.form.keywords.label}
            placeholder={copy.form.keywords.placeholder}
            help={copy.form.keywords.help}
            value={existingForm.keywords || []}
            onChange={(keywords) => setExistingForm(prev => ({ ...prev, keywords }))}
            maxChips={8}
            error={errors.keywords}
          />
          
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label={copy.form.name.label}
              placeholder={copy.form.name.placeholder}
              value={existingForm.name || ''}
              onChange={(e) => setExistingForm(prev => ({ ...prev, name: e.target.value }))}
              error={errors.name}
              required
            />
            
            <Input
              label={copy.form.email.label}
              type="email"
              placeholder={copy.form.email.placeholder}
              value={existingForm.email || ''}
              onChange={(e) => setExistingForm(prev => ({ ...prev, email: e.target.value }))}
              error={errors.email}
              required
            />
          </div>
          
          <Input
            label={copy.form.phone.label}
            type="tel"
            placeholder={copy.form.phone.placeholder}
            value={existingForm.phone || ''}
            onChange={(e) => setExistingForm(prev => ({ ...prev, phone: e.target.value }))}
            error={errors.phone}
          />
        </div>
      </Card>
      
      <div className="space-y-4">
        {errors.general && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground">
          {copy.consentLine}
        </p>
        
        <Button
          type="submit"
          size="lg"
          loading={isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? copy.form.submitting : copy.form.submit}
        </Button>
        
        <p className="text-sm text-muted-foreground">
          {copy.usageNote}
        </p>
      </div>
    </form>
  );

  const newSellerForm = (
    <form onSubmit={handleNewSubmit} className="space-y-6">
      <Card>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">{copy.tool.new.title}</h3>
            <p className="mt-2 text-muted-foreground">
              {copy.tool.new.description}
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label={copy.form.websiteUrl.label}
              type="url"
              placeholder={copy.form.websiteUrl.placeholder}
              help={copy.form.websiteUrl.help}
              value={newForm.websiteUrl || ''}
              onChange={(e) => setNewForm(prev => ({ ...prev, websiteUrl: e.target.value }))}
              error={errors.websiteUrl}
            />
            
            <Select
              label={copy.form.category.label}
              placeholder={copy.form.category.placeholder}
              options={copy.form.category.options.map(cat => ({ value: cat, label: cat }))}
              value={newForm.category || ''}
              onChange={(e) => setNewForm(prev => ({ ...prev, category: e.target.value }))}
              error={errors.category}
              required
            />
          </div>
          
          <Input
            label={copy.form.noWebsiteDesc.label}
            placeholder={copy.form.noWebsiteDesc.placeholder}
            help={copy.form.noWebsiteDesc.help}
            value={newForm.noWebsiteDesc || ''}
            onChange={(e) => setNewForm(prev => ({ ...prev, noWebsiteDesc: e.target.value }))}
            error={errors.noWebsiteDesc}
          />
          
          <Input
            label={copy.form.desc.label}
            placeholder={copy.form.desc.placeholder}
            help={copy.form.desc.help}
            value={newForm.desc || ''}
            onChange={(e) => setNewForm(prev => ({ ...prev, desc: e.target.value }))}
            error={errors.desc}
            required
          />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                {copy.form.keywordsRequired.label}
              </label>
                             <Button
                 type="button"
                 variant="secondary"
                 size="sm"
                 onClick={generateKeywordSuggestions}
                 loading={isGeneratingSuggestions}
                 disabled={!newForm.category || !newForm.desc}
               >
                {isGeneratingSuggestions ? 'Generating...' : '🤖 AI Suggestions'}
              </Button>
            </div>
            
            <ChipsInput
              placeholder={copy.form.keywordsRequired.placeholder}
              help={copy.form.keywordsRequired.help}
              value={newForm.keywords || []}
              onChange={(keywords) => setNewForm(prev => ({ ...prev, keywords }))}
              maxChips={5}
              error={errors.keywords}
            />
          </div>
          
          <Select
            label={copy.form.fulfilmentIntent.label}
            placeholder={copy.form.fulfilmentIntent.placeholder}
            options={[
              { value: 'FBA', label: copy.form.fulfilmentIntent.options.fba },
              { value: 'FBM', label: copy.form.fulfilmentIntent.options.fbm },
              { value: 'Unsure', label: copy.form.fulfilmentIntent.options.unsure },
            ]}
            value={newForm.fulfilmentIntent || ''}
            onChange={(e) => setNewForm(prev => ({ ...prev, fulfilmentIntent: e.target.value as 'FBA' | 'FBM' | 'Unsure' || undefined }))}
            error={errors.fulfilmentIntent}
            required
          />
          
          <FileDropzone
            label={copy.form.image.label}
            help={copy.form.image.help}
            value={newForm.image || null}
            onChange={(image: ImageFile | null) => setNewForm(prev => ({ ...prev, image: image || undefined }))}
            error={errors.image}
          />
          
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label={copy.form.name.label}
              placeholder={copy.form.name.placeholder}
              value={newForm.name || ''}
              onChange={(e) => setNewForm(prev => ({ ...prev, name: e.target.value }))}
              error={errors.name}
              required
            />
            
            <Input
              label={copy.form.email.label}
              type="email"
              placeholder={copy.form.email.placeholder}
              value={newForm.email || ''}
              onChange={(e) => setNewForm(prev => ({ ...prev, email: e.target.value }))}
              error={errors.email}
              required
            />
          </div>
          
          <Input
            label={copy.form.phone.label}
            type="tel"
            placeholder={copy.form.phone.placeholder}
            value={newForm.phone || ''}
            onChange={(e) => setNewForm(prev => ({ ...prev, phone: e.target.value }))}
            error={errors.phone}
          />
        </div>
      </Card>
      
      <div className="space-y-4">
        {errors.general && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground">
          {copy.consentLine}
        </p>
        
        <Button
          type="submit"
          size="lg"
          loading={isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? copy.form.submitting : copy.form.submit}
        </Button>
        
        <p className="text-sm text-muted-foreground">
          {copy.usageNote}
        </p>
      </div>
    </form>
  );

  const tabs = [
    {
      id: 'existing',
      label: copy.tool.existingTab,
      content: existingSellerForm,
    },
    {
      id: 'new',
      label: copy.tool.newTab,
      content: newSellerForm,
    },
  ];

  return (
    <Section className="py-16">
      <Container>
        <div className="text-center">
          <h1>{copy.tool.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {copy.toolIntro}
          </p>
        </div>
        
        <div className="mt-16 max-w-4xl mx-auto">
          <Tabs
            tabs={tabs}
            defaultTab="existing"
            onChange={(tabId) => {
              setActiveTab(tabId);
              setSummary(null);
              setShowEmailGate(false);
              setCurrentLeadId(null);
              setErrors({});
            }}
          />
        </div>
        
        {/* Summary Results */}
        {summary && (
          <div className="mt-12 max-w-4xl mx-auto">
            {showEmailGate ? (
              <EmailGate 
                onEmailSubmit={handleEmailSubmit}
                isLoading={isEmailSubmitting}
                mode={activeTab === 'new' ? 'create' : 'audit'}
              />
            ) : activeTab === 'new' && summary.listingPack ? (
              <ListingPackCard result={summary} />
            ) : (
              <SummaryCard result={summary} />
            )}
          </div>
        )}
      </Container>
    </Section>
  );
}
