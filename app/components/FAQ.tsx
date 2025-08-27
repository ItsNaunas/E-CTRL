'use client';

import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is this really free?",
      answer: "Yes, completely free! No credit card required. We offer this audit as a free tool to help Amazon sellers improve their listings."
    },
    {
      question: "Do I need an Amazon login?",
      answer: "No, you don't need to log into Amazon. Just paste your product URL or ASIN and we'll analyze the public listing data."
    },
    {
      question: "How accurate is the audit?",
      answer: "Our AI has been trained on thousands of successful Amazon listings and follows Amazon's best practices. While we can't guarantee specific results, our recommendations are based on proven optimization strategies."
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

  return (
    <section className="py-16 bg-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about our free Amazon audit tool.
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-border rounded-lg bg-background">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-muted/50 transition-colors"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-semibold text-foreground">
                  {faq.question}
                </span>
                <span className="text-accent text-xl">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div 
                  id={`faq-answer-${index}`}
                  className="px-6 pb-4 text-muted-foreground"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
