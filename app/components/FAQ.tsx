'use client';

import { useState } from 'react';
import Script from 'next/script';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is this really free?",
      answer: "Yes, our Amazon audit tool is completely free forever. There are no hidden costs, premium tiers, or credit card requirements. We believe in helping Amazon sellers succeed with transparent, accessible tools."
    },
    {
      question: "Do I need my Amazon login?",
      answer: "No, you don't need to log into Amazon. Just paste your product URL or ASIN and we'll analyze the public listing data."
    },
    {
      question: "How accurate is the audit?",
      answer: "Our AI has been trained on thousands of successful Amazon listings and follows Amazon's best practices. While we can't guarantee specific results, our recommendations are based on proven optimization strategies."
    },
    {
      question: "Do I need to create an account?",
      answer: "No for the basic audit (email required). Yes for the full report, advanced checks, and PDF export."
    },
    {
      question: "What's included in the basic vs full report?",
      answer: "Basic: top findings + 2–3 quick wins. Full (account): complete audit, prioritized checklist, detailed listing optimization recommendations, and PDF export."
    },
    {
      question: "How long does it take?",
      answer: "The audit analysis takes just a few seconds. You'll see partial results immediately, and the full detailed report will be emailed to you within 2 minutes."
    },
    {
      question: "What happens to my data?",
      answer: "We only use your data to generate your audit report. We don't store product images, and your email is only used to send you the report. You can read our full privacy policy for details."
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
    <section className="py-16 md:py-20">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Everything you need to know about our free Amazon audit tool.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:border-white/20 transition" data-testid="faq-item">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 focus:ring-inset"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                data-testid="faq-accordion-q"
              >
                <span className="font-semibold text-white pr-4">
                  {faq.question}
                </span>
                <span className="flex-shrink-0 text-white/60">
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
                  className="px-6 pb-4 text-white/80"
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
          <p className="text-sm text-white/60">
            Still have questions? Contact us at contact@e-ctrl.co.uk
          </p>
        </div>
      </div>
    </section>
  );
}
