import { BookOpen, PenTool } from "lucide-react";
import { Container } from "../layout/container";
import { AnimatedButton } from "../ui/animated-button";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "../utils/analytics";

export function EbookSection() {
  const navigate = useNavigate();

  const handlePublishEbook = () => {
    trackEvent("ebook_cta_click", {
      button_type: "primary",
      button_text: "Publish Your Ebook",
      section: "ebook_section",
      page_path: window.location.pathname,
    });
    navigate("/publish-ebook");
  };

  const handleReadEbooks = () => {
    trackEvent("ebook_cta_click", {
      button_type: "secondary",
      button_text: "Browse Library",
      section: "ebook_section",
      page_path: window.location.pathname,
    });
    navigate("/ebookhub");
  };

  return (
    <section className=" text-white py-16 sm:py-24 px-6">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light mb-6 leading-tight">
              Transform Stories Into{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Success
              </span>
            </h2>

            <p className="text-gray-300 text-base sm:text-lg mb-8 leading-relaxed font-light">
              Join thousands of authors who've turned their passion for writing
              into thriving ebook businesses. Publish your stories, reach global
              audiences, and discover amazing reads from fellow creators.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <AnimatedButton
                onClick={handlePublishEbook}
                icon={PenTool}
                size="lg"
                variant="primary"
              >
                Publish Your Ebook
              </AnimatedButton>

              <AnimatedButton
                onClick={handleReadEbooks}
                icon={BookOpen}
                size="lg"
                variant="secondary"
              >
                Browse Library
              </AnimatedButton>
            </div>
          </div>

          {/* Visual */}
          <div className="relative order-1 lg:order-2">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-blue-900/20 to-purple-900/10 p-6 sm:p-8 rounded-xl border border-blue-500/20 backdrop-blur-sm">
              <div className="space-y-4">
                {/* Mock ebook listings */}
                {[
                  {
                    title: "The Digital Nomad's Guide",
                    author: "Sarah Chen",
                    price: "$12.99",
                    rating: "4.8",
                    category: "Business",
                  },
                  {
                    title: "Mystic Realms: Book 1",
                    author: "Marcus Stone",
                    price: "$9.99",
                    rating: "4.6",
                    category: "Fantasy",
                  },
                  {
                    title: "Modern Web Development",
                    author: "Alex Rivera",
                    price: "$19.99",
                    rating: "4.9",
                    category: "Tech",
                  },
                ].map((ebook, index) => (
                  <div
                    key={index}
                    className="bg-black/30 p-4 rounded-lg border border-blue-500/10 hover:border-blue-500/30 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white text-sm sm:text-base group-hover:text-blue-300 transition-colors">
                        {ebook.title}
                      </h4>
                      <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-xs sm:text-sm font-bold">
                        {ebook.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-400">
                      <span className="text-blue-300">{ebook.author}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        ⭐ {ebook.rating}
                      </span>
                      <span>•</span>
                      <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                        {ebook.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-blue-500/20 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    25K+
                  </div>
                  <div className="text-xs text-gray-400">Published Books</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    500K+
                  </div>
                  <div className="text-xs text-gray-400">Happy Readers</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    $5M+
                  </div>
                  <div className="text-xs text-gray-400">Author Earnings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
