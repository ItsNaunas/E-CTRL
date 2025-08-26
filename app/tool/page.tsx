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
import { copy } from '@/lib/copy';
import { 
  existingSellerSchema, 
  newSellerSchema,
  type ExistingSellerData,
  type NewSellerData,
  type ImageFile
} from '@/lib/validation';
import { mockExistingSummary, mockNewSummary } from '@/lib/mock';
import type { SummaryResult } from '@/lib/mock';

export default function ToolPage() {
  const [activeTab, setActiveTab] = useState('existing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  
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

  const handleExistingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const validatedData = existingSellerSchema.parse(existingForm);
      
      // TODO: Connect to backend API
      // const response = await fetch('/api/report', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ type: 'existing', data: validatedData }),
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResult = mockExistingSummary(validatedData);
      setSummary(mockResult);
      
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
      
      // TODO: Connect to backend API
      // const response = await fetch('/api/report', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ type: 'new', data: validatedData }),
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResult = mockNewSummary(validatedData);
      setSummary(mockResult);
      
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
    } finally {
      setIsSubmitting(false);
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
          
          <div className="grid gap-6 md:grid-cols-2">
            <ChipsInput
              label={copy.form.keywordsRequired.label}
              placeholder={copy.form.keywordsRequired.placeholder}
              help={copy.form.keywordsRequired.help}
              value={newForm.keywords || []}
              onChange={(keywords) => setNewForm(prev => ({ ...prev, keywords }))}
              maxChips={5}
              error={errors.keywords}
            />
            
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
          </div>
          
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
              setErrors({});
            }}
          />
        </div>
        
        {/* Summary Results */}
        {summary && (
          <div className="mt-12 max-w-4xl mx-auto">
            <SummaryCard result={summary} />
          </div>
        )}
      </Container>
    </Section>
  );
}
