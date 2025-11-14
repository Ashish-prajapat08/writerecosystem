import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Found my writing voice and community here. It's unlike anything else.",
    author: "Sarah Chen",
    role: "Tech Writer"
  },
  {
    quote: "The battles pushed me to improve. Now I write for major publications.",
    author: "Marcus Rodriguez",
    role: "Journalist"
  },
  {
    quote: "Finally, a platform that values depth over algorithms.",
    author: "Aisha Patel",
    role: "Essay Writer"
  },
  {
    quote: "My writing circle became my second family. We grow together.",
    author: "James Wilson",
    role: "Fiction Author"
  }
];

export function CommunitySection() {
  return (
    <section className="bg-black text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          The Movement Speaks
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.quote}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-blue-500/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-blue-900/20 p-8 rounded-lg border border-blue-500/20">
                <p className="text-xl text-blue-100 mb-4">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-blue-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}