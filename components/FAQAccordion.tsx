'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { PlusIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';

const items = [
  {
    id: '1',
    title: 'How accurate are the audit results?',
    content:
      'Our audit tool is backed by 4+ years of real Amazon experience and analyzes your listing against proven optimization strategies. While results may vary, our recommendations are based on successful patterns from $5.5M+ in client portfolio management.',
  },
  {
    id: '2',
    title: 'Is the audit really free forever?',
    content:
      'Yes! Our Amazon audit tool is completely free with no hidden costs, premium tiers, or credit card requirements. We believe every seller deserves access to expert-level optimization insights.',
  },
  {
    id: '3',
    title: 'How long does it take to get my audit results?',
    content:
      'You&apos;ll receive your instant summary immediately after submitting your ASIN or product details. The complete detailed report with actionable recommendations is delivered to your email within minutes.',
  },
  {
    id: '4',
    title: 'What information do you need for the audit?',
    content:
      'For existing sellers: Just your ASIN or Amazon product URL. For new sellers: Product description, category, and optionally an image. We never store or share your data - it&apos;s used solely for generating your audit.',
  },
  {
    id: '5',
    title: 'Can I use this for multiple products?',
    content:
      'Absolutely! You can audit as many products as you need. Each audit is independent, and you&apos;ll receive separate reports for each product to help optimize your entire catalog.',
  },
  {
    id: '6',
    title: 'What makes your audit different from other tools?',
    content:
      'Our tool is built by a former Amazon employee with 4+ years of seller growth experience. Unlike generic tools, our recommendations are based on real Amazon algorithm insights and proven conversion strategies.',
  },
  {
    id: '7',
    title: 'Do you offer any paid services?',
    content:
      'The audit tool itself is completely free. We may offer premium consulting services in the future, but the core audit functionality will always remain free to help Amazon sellers succeed.',
  },
  {
    id: '8',
    title: 'Is my data secure and private?',
    content:
      'Yes, absolutely. We use SSL encryption, never share your data with third parties, and don&apos;t send spam emails. Your product information is used solely for generating your audit report and then securely discarded.',
  }
];

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
      duration: 0.4,
    },
  }),
};

export default function FAQAccordion() {
  return (
    <section className="py-12 md:py-16" data-testid="faq">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <motion.h2
            className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-white/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Everything you need to know about our free Amazon audit tool and how to optimize your listings for maximum sales.
          </motion.p>
        </div>

        <motion.div
          className="relative mx-auto max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Decorative gradient with brand colors */}
          <div className="absolute -top-4 -left-4 -z-10 h-72 w-72 rounded-full bg-gradient-to-br from-[#296AFF]/10 to-transparent blur-3xl" />
          <div className="absolute -right-4 -bottom-4 -z-10 h-72 w-72 rounded-full bg-gradient-to-tl from-[#FF7D2B]/10 to-transparent blur-3xl" />

          <Accordion
            type="single"
            collapsible
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-2 backdrop-blur-sm"
            defaultValue="1"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                variants={fadeInAnimationVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <AccordionItem
                  value={item.id}
                  className={cn(
                    'my-1 overflow-hidden rounded-lg border-none px-2 shadow-sm transition-all bg-white/[0.02]',
                    'data-[state=open]:bg-white/[0.05] data-[state=open]:shadow-md',
                  )}
                >
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger
                      className={cn(
                        'group flex flex-1 items-center justify-between gap-4 py-4 text-left text-base font-medium text-white',
                        'hover:text-[#FF7D2B] transition-all duration-300 outline-none',
                        'focus-visible:ring-[#FF7D2B]/50 focus-visible:ring-2',
                        'data-[state=open]:text-[#FF7D2B]',
                      )}
                    >
                      {item.title}
                      <PlusIcon
                        size={18}
                        className={cn(
                          'text-[#FF7D2B]/70 shrink-0 transition-transform duration-300 ease-out',
                          'group-data-[state=open]:rotate-45',
                        )}
                        aria-hidden="true"
                      />
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent
                    className={cn(
                      'overflow-hidden pt-0 pb-4 text-white/80',
                      'data-[state=open]:animate-accordion-down',
                      'data-[state=closed]:animate-accordion-up',
                    )}
                  >
                    <div className="border-t border-white/10 pt-3">
                      {item.content}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
