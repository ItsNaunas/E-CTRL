'use client';

import { useState } from 'react';
import Script from 'next/script';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is this really free?", // TODO: replace with client-approved question
      answer: "Yes, our Amazon audit tool is completely free forever. There are no hidden costs, premium tiers, or credit card requirements. We believe in helping Amazon sellers succeed with transparent, accessible tools." // TODO: replace with client-approved answer
    },
    {
      question: "Do I need my Amazon login?", // TODO: replace with client-approved question
      answer: "No, you don't need to log into Amazon. Just paste your product URL or ASIN and we'll analyze the public listing data." // TODO: replace with client-approved answer
    },
    {
      question: "How accurate is the audit?", // TODO: replace with client-approved question
      answer: "Our AI has been trained on thousands of successful Amazon listings and follows Amazon's best practices. While we can't guarantee specific results, our recommendations are based on proven optimization strategies." // TODO: replace with client-approved answer
    },
    {
      question: "Do I need to create an account?", // TODO: replace with client-approved question
      answer: "No for the basic audit (email required). Yes for the full report, advanced checks, and PDF export." // TODO: replace with client-approved answer
    },
    {
      question: "What's included in the basic vs full report?", // TODO: replace with client-approved question
      answer: "Basic: top findings + 2–3 quick wins. Full (account): complete audit, prioritized checklist, detailed image/SEO recommendations, and PDF export." // TODO: replace with client-approved answer
    },
    {
      question: "How long does it take?", // TODO: replace with client-approved question
      answer: "The audit analysis takes just a few seconds. You'll see partial results immediately, and the full detailed report will be emailed to you within 2 minutes." // TODO: replace with client-approved answer
    },
    {
      question: "What happens to my data?", // TODO: replace with client-approved question
      answer: "We only use your data to generate your audit report. We don't store product images, and your email is only used to send you the report. You can read our full privacy policy for details." // TODO: replace with client-approved answer
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // JSON-LD Schema for FAQ
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-16 bg-white">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our free Amazon audit tool.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg" data-testid="faq-item">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                data-testid="faq-accordion-q"
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <span className="flex-shrink-0 text-gray-400">
                  {openIndex === index ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </span>
              </button>
              
              {openIndex === index && (
                <div
                  id={`faq-answer-${index}`}
                  className="px-6 pb-4 text-gray-600"
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Still have questions? Contact us at support@e-ctrl.com
          </p>
          {/* TODO: Replace with client-provided contact information */}
        </div>
      </div>
    </section>
  );
}
