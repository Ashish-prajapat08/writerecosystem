import { Container } from "../layout/container";
import { BackgroundEffects } from "../ui/background-effects";

export function MissionSection() {
  return (
    <section id="mission-section" className="bg-black text-white py-16 sm:py-24 relative px-6">
      {/* Background Effects */}
      <BackgroundEffects variant="subtle" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light mb-6 sm:mb-8 leading-tight"
              style={{ letterSpacing: '0.01em' }}
            >
              Why{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                WE
              </span>{" "}
              Exists
            </h2>
            
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-light">
              We believe in the transformative power of words. Our platform isn't just another content feed - it's a carefully crafted ecosystem where writers thrive, ideas flourish, and meaningful connections are forged. We're building the future of digital writing, one story at a time.
            </p>
          </div>

          {/* Quote */}
          <div className="relative order-1 lg:order-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-blue-600/20 blur-xl rounded-lg"></div>
            <blockquote className="relative bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-6 sm:p-8 rounded-lg border border-blue-500/20 backdrop-blur-sm">
              <p 
                className="text-xl sm:text-2xl lg:text-3xl font-serif font-light italic text-blue-100 leading-relaxed"
                style={{ letterSpacing: '0.01em' }}
              >
                "This isn't another feed. It's a revolution."
              </p>
            </blockquote>
          </div>
        </div>
      </Container>
    </section>
  );
}