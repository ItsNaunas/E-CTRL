'use client';

import { useState } from 'react';

export default function NewSellerFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What if I don't have a product landing page yet?",
      answer: "You can use any product page from your website, Shopify store, or even a competitor's page as a reference. Our AI will analyze the product information and create an optimized Amazon listing."
    },
    {
      question: "How long does it take to get my listing?",
      answer: "You'll receive your complete Amazon listing with 6 optimized images and conversion-focused copy within minutes of submitting your email. No waiting, no delays."
    },
    {
      question: "Are the images really optimized for Amazon?",
      answer: "Yes! Each of the 6 images follows Amazon's specific requirements: main image on white background (85% frame), lifestyle shots, benefit infographics, measurements, cross-sections, and competitive comparisons."
    },
    {
      question: "What if I need to modify the listing after receiving it?",
      answer: "The listing we provide is ready to use as-is, but you can easily customize any part of it. The structure and optimization are already done, so you just need to adjust details if needed."
    },
    {
      question: "Do I need an Amazon seller account first?",
      answer: "No, you can create your listing before setting up your Amazon seller account. This gives you everything you need to launch quickly once your account is ready."
    },
    {
      question: "Can I use this for multiple products?",
      answer: "Absolutely! You can create listings for as many products as you want. Each product URL will generate a unique, optimized listing tailored to that specific product."
    },
    {
      question: "What makes your listings better than doing it manually?",
      answer: "Our AI analyzes thousands of successful Amazon listings to understand what converts. We optimize for SEO, conversion, and Amazon's algorithm, saving you hours of research and trial-and-error."
    },
    {
      question: "Is this really free? What's the catch?",
      answer: "100% free, no catch. We believe in helping new sellers succeed on Amazon. The tool is free to use, and you'll get professional-quality listings without any hidden costs."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about creating your Amazon listing.
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                <span className="text-gray-500 text-xl">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8">
                         <h3 className="text-2xl font-bold text-gray-900 mb-4">
               Ready to generate your Amazon listing?
             </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of brand owners who&apos;ve successfully launched on Amazon using our tool.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Instant results</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Professional quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
