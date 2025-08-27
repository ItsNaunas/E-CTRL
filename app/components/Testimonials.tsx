'use client';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Found 3 keyword gaps I never knew existed. Sales increased 23% in the first month!",
      author: "Sarah M.",
      role: "Home & Garden Seller"
    },
    {
      quote: "The image compliance check saved me from getting suspended. Worth every penny (and it's free!)",
      author: "Mike R.",
      role: "Electronics Seller"
    },
    {
      quote: "Finally understand why my listings weren't converting. The bullet point suggestions are gold.",
      author: "Lisa T.",
      role: "Fashion Seller"
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            What sellers are saying
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real results from Amazon sellers who used our free audit tool.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-muted p-6 rounded-lg">
              <div className="mb-4">
                <span className="text-2xl">⭐</span>
                <span className="text-2xl">⭐</span>
                <span className="text-2xl">⭐</span>
                <span className="text-2xl">⭐</span>
                <span className="text-2xl">⭐</span>
              </div>
              <blockquote className="text-foreground mb-4 italic">
                "{testimonial.quote}"
              </blockquote>
              <div className="text-sm">
                <div className="font-semibold text-foreground">{testimonial.author}</div>
                <div className="text-muted-foreground">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
