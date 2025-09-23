'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ClientTestimonial {
  id: number;
  name: string;
  quote: string;
  result: string;
  avatar: string;
}

interface ClientTestimonialsProps {
  testimonials?: ClientTestimonial[];
  className?: string;
}

const defaultTestimonials: ClientTestimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    quote: "Significant sales increase in just 2 weeks",
    result: "Missing keywords found",
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: 2,
    name: "Marcus Rodriguez", 
    quote: "Substantial conversion rate improvement",
    result: "Expert recommendations",
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: 3,
    name: "Emma Thompson",
    quote: "Significant ROI improvement",
    result: "Real Amazon expertise",
    avatar: "https://i.pravatar.cc/150?img=13"
  },
  {
    id: 4,
    name: "David Kim",
    quote: "Boosted my ranking to page 1",
    result: "Optimized listing structure",
    avatar: "https://i.pravatar.cc/150?img=14"
  }
];

export default function ClientTestimonials({ 
  testimonials = defaultTestimonials,
  className = ""
}: ClientTestimonialsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Avatar clicked!'); // Debug log
    
    // Scroll to testimonials section
    const testimonialsSection = document.querySelector('[data-testid="testimonials"]');
    console.log('Testimonials section found:', testimonialsSection); // Debug log
    
    if (testimonialsSection) {
      // Get the element's position
      const elementTop = testimonialsSection.getBoundingClientRect().top + window.pageYOffset;
      console.log('Scrolling to position:', elementTop); // Debug log
      
      // Smooth scroll to the element
      window.scrollTo({
        top: elementTop - 80, // 80px offset for better positioning
        behavior: 'smooth'
      });
    } else {
      console.log('Testimonials section not found'); // Debug log
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center -space-x-3">
        {testimonials.map((testimonial, idx) => (
          <div
            key={testimonial.id}
            className="group relative"
            onMouseEnter={() => setHoveredIndex(testimonial.id)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Tooltip */}
            {hoveredIndex === testimonial.id && (
              <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                <div className="bg-black/95 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 shadow-2xl min-w-[200px] max-w-[280px]">
                  {/* Gradient background */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#296AFF]/10 to-[#FF7D2B]/10" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-white font-semibold text-sm mb-1">
                      {testimonial.name}
                    </div>
                    <div className="text-white/90 text-xs leading-relaxed mb-2">
                      &ldquo;{testimonial.quote}&rdquo;
                    </div>
                    <div className="text-[#FF7D2B] text-xs font-medium">
                      {testimonial.result}
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/95 border-r border-b border-white/20 rotate-45" />
                </div>
              </div>
            )}

            {/* Avatar */}
            <div className="relative">
              <div 
                className="w-12 h-12 rounded-full border-2 border-[#FF7D2B] group-hover:scale-110 transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={handleAvatarClick}
              >
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover pointer-events-none"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>
              
              {/* Hover ring effect */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-[#FF7D2B]/30 group-hover:scale-110 transition-all duration-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
