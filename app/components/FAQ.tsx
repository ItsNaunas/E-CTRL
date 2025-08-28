'use client';

import { useState } from 'react';
import Script from 'next/script';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is the Amazon audit tool really free?",
      answer: "Yes, our Amazon audit tool is completely free forever. There are no hidden costs, premium tiers, or credit card requirements. We believe in helping Amazon sellers succeed with transparent, accessible tools."
    },
    {
      question: "How accurate are the audit results?",
      answer: "Our AI-powered audit analyzes your listing against Amazon's best practices and current market data. The recommendations are based on proven optimization strategies used by successful sellers. Results typically show improvement within 2-4 weeks of implementation."
    },
    {
      question: "What information do you need for the audit?",
      answer: "We only need your Amazon ASIN (product ID) or product URL. We don't require access to your seller account, personal information, or any sensitive data. The audit is performed using publicly available listing information."
    },
    {
      question: "How long does the audit take?",
      answer: "The initial audit analysis takes just a few seconds. You'll get immediate insights and a score. The detailed report with specific recommendations is delivered to your email within minutes."
    },
    {
      question: "Will you spam my email?",
      answer: "No, we respect your privacy. You'll only receive your audit report and occasional helpful Amazon selling tips. You can unsubscribe at any time, and we never share your email with third parties."
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
            <div key={index} className="border border-gray-200 rounded-lg">
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
        </div>
      </div>
    </section>
  );
}
