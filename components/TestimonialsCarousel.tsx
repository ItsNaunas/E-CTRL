'use client';

import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const defaultTestimonials = [
  {
    text: 'The audit revealed missing keywords that significantly boosted my sales in just 2 weeks. The expert insights were spot-on!',
    imageSrc: 'https://i.pravatar.cc/150?img=1',
    name: 'Sarah Chen',
    username: '@sarahchen',
    role: 'Amazon FBA Seller',
    location: 'United States',
    result: 'Significant sales increase in 2 weeks',
    rating: 5
  },
  {
    text: 'Finally found a tool backed by real Amazon experience. My conversion rate improved substantially after implementing the recommendations.',
    imageSrc: 'https://i.pravatar.cc/150?img=2',
    name: 'Marcus Rodriguez',
    username: '@marcusrod',
    role: 'E-commerce Entrepreneur',
    location: 'Canada',
    result: 'Substantial conversion rate improvement',
    rating: 5
  },
  {
    text: 'Free tool that actually works! The recommendations were based on real Amazon expertise, not just generic advice.',
    imageSrc: 'https://i.pravatar.cc/150?img=3',
    name: 'Emma Thompson',
    username: '@emmathompson',
    role: 'Amazon Seller',
    location: 'Australia',
    result: 'Significant ROI improvement',
    rating: 5
  },
  {
    text: 'E-CTRL&apos;s attention to Amazon&apos;s algorithm is impressive. The keyword recommendations significantly increased our organic traffic.',
    imageSrc: 'https://i.pravatar.cc/150?img=4',
    name: 'David Kim',
    username: '@davidkim',
    role: 'Amazon Specialist',
    location: 'United Kingdom',
    result: 'Major organic traffic increase',
    rating: 5
  },
  {
    text: 'The optimization checklist is comprehensive. It&apos;s exactly what we needed to launch our new product successfully.',
    imageSrc: 'https://i.pravatar.cc/150?img=5',
    name: 'Lisa Thompson',
    username: '@lisathompson',
    role: 'Product Manager',
    location: 'Germany',
    result: 'Successful product launch',
    rating: 5
  },
  {
    text: 'I&apos;ve tried every Amazon tool out there, but E-CTRL is different. The audit reports are comprehensive yet easy to understand.',
    imageSrc: 'https://i.pravatar.cc/150?img=6',
    name: 'James Wilson',
    username: '@jameswilson',
    role: 'Amazon Consultant',
    location: 'France',
    result: 'Best tool for Amazon optimization',
    rating: 5
  },
  {
    text: 'E-CTRL helped us navigate Amazon&apos;s complex requirements. We achieved 100% compliance on all our health products.',
    imageSrc: 'https://i.pravatar.cc/150?img=7',
    name: 'Maria Garcia',
    username: '@mariagarcia',
    role: 'E-commerce Lead',
    location: 'Spain',
    result: '100% compliance achieved',
    rating: 5
  },
  {
    text: 'Our electronics listings were underperforming until we found E-CTRL. The technical specification optimization boosted our rankings.',
    imageSrc: 'https://i.pravatar.cc/150?img=8',
    name: 'Alex Johnson',
    username: '@alexjohnson',
    role: 'Amazon Seller',
    location: 'Italy',
    result: 'Top 3 keyword rankings',
    rating: 5
  }
];

interface TestimonialProps {
  testimonials?: {
    text: string;
    imageSrc: string;
    name: string;
    username: string;
    role?: string;
    location?: string;
    result?: string;
    rating?: number;
  }[];
  title?: string;
  subtitle?: string;
  autoplaySpeed?: number;
  className?: string;
}

export default function TestimonialsCarousel({
  testimonials = defaultTestimonials,
  title = 'Trusted by Amazon Sellers Worldwide',
  subtitle = 'See what other sellers are saying about their audit results from our Amazon expert',
  autoplaySpeed = 5000,
  className,
}: TestimonialProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps',
    dragFree: true,
    // Enhanced mobile swipe settings
    slidesToScroll: 1,
    skipSnaps: false,
    inViewThreshold: 0.7,
    // Better touch handling for mobile
    watchDrag: true,
    watchResize: true,
    // Smooth momentum scrolling
    duration: 25,
  });

  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, autoplaySpeed);

    return () => {
      clearInterval(autoplay);
    };
  }, [emblaApi, autoplaySpeed]);

  // Enhanced touch handling for better mobile experience
  // Embla carousel already handles touch interactions well with the configured options

  const allTestimonials = [...testimonials, ...testimonials];

  return (
    <section
      className={cn('relative overflow-hidden py-16 md:py-24', className)}
      data-testid="testimonials"
    >
      {/* Background with brand colors */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(41,106,255,0.1),transparent_60%)]" />
        <div className="bg-[#296AFF]/5 absolute top-1/4 left-1/4 h-32 w-32 rounded-full blur-3xl" />
        <div className="bg-[#FF7D2B]/10 absolute right-1/4 bottom-1/4 h-40 w-40 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative mb-12 text-center md:mb-16"
        >
          <h1 className="mb-4 bg-gradient-to-b from-white to-white/40 bg-clip-text text-3xl font-bold text-transparent md:text-5xl lg:text-6xl">
            {title}
          </h1>

          <motion.p
            className="mx-auto max-w-2xl text-base text-white/70 md:text-lg"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Testimonials carousel */}
        <div 
          className="embla overflow-hidden touch-pan-y" 
          ref={emblaRef}
        >
          <div className="flex touch-pan-y">
            {allTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.name}-${index}`}
                className="flex justify-center px-4 flex-shrink-0 w-full sm:w-auto"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative h-full w-full max-w-sm sm:w-fit rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-md backdrop-blur-sm touch-manipulation"
                >
                  {/* Enhanced decorative gradients with brand colors */}
                  <div className="absolute -top-5 -left-5 -z-10 h-40 w-40 rounded-full bg-gradient-to-b from-[#296AFF]/15 to-transparent blur-md" />
                  <div className="absolute -right-10 -bottom-10 -z-10 h-32 w-32 rounded-full bg-gradient-to-t from-[#FF7D2B]/10 to-transparent opacity-70 blur-xl" />

                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="mb-4 text-[#FF7D2B]"
                  >
                    <div className="relative">
                      <Quote className="h-10 w-10 -rotate-180" />
                    </div>
                  </motion.div>

                  {/* Rating Stars */}
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FF7D2B] text-[#FF7D2B]" />
                    ))}
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="relative mb-6 text-base leading-relaxed text-white/90"
                  >
                    <span className="relative">&ldquo;{testimonial.text}&rdquo;</span>
                  </motion.p>

                  {/* Result Highlight */}
                  {testimonial.result && (
                    <div className="mb-4 rounded-lg bg-gradient-to-r from-[#296AFF]/10 to-[#FF7D2B]/10 border border-[#296AFF]/20 p-3">
                      <span className="text-sm font-semibold bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] bg-clip-text text-transparent">
                        {testimonial.result}
                      </span>
                    </div>
                  )}

                  {/* Enhanced user info with animation */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="mt-auto flex items-center gap-3 border-t border-white/10 pt-4"
                  >
                    <Avatar className="h-10 w-10 border border-[#FF7D2B]/20 ring-2 ring-[#FF7D2B]/10 ring-offset-2 ring-offset-transparent">
                      <AvatarImage
                        src={testimonial.imageSrc}
                        alt={testimonial.name}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] text-white">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h4 className="font-medium text-white whitespace-nowrap">
                        {testimonial.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-[#FF7D2B]/80 whitespace-nowrap">
                          {testimonial.username}
                        </p>
                        {testimonial.role && (
                          <>
                            <span className="text-white/40 flex-shrink-0">
                              •
                            </span>
                            <p className="text-sm text-white/60 whitespace-nowrap">
                              {testimonial.role}
                            </p>
                          </>
                        )}
                      </div>
                      {testimonial.location && (
                        <p className="text-xs text-white/50 whitespace-nowrap">
                          {testimonial.location}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Expert Credibility Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-md backdrop-blur-sm md:p-8"
        >
          <div className="text-center">
            <h3 className="mb-4 text-xl font-semibold text-white md:text-2xl">
              Backed by Real Amazon Expertise
            </h3>
            <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 shadow-sm backdrop-blur-sm">
                <div className="font-semibold text-white">4+ Years at Amazon</div>
                <div className="text-white/80">Seller growth & optimization</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 shadow-sm backdrop-blur-sm">
                <div className="font-semibold text-white">22 Brands Launched</div>
                <div className="text-white/80">$1.1M revenue generated</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 shadow-sm backdrop-blur-sm">
                <div className="font-semibold text-white">$5.5M Portfolio</div>
                <div className="text-white/80">Active client management</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <p className="text-sm text-white/60">
            * Results may vary. These testimonials represent individual experiences.
          </p>
        </div>
      </div>
    </section>
  );
}
