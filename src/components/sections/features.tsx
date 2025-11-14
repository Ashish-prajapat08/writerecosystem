import { Pen, Swords, Briefcase, Users, Brain, MessageSquare, Sparkles } from "lucide-react";
import { BackgroundEffects } from "../ui/background-effects";
import { SectionHeader } from "../ui/section-header";
import { ResponsiveGrid } from "../ui/responsive-grid";
import { AnimatedButton } from "../ui/animated-button";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "../utils/analytics";

const features = [
  {
    icon: Pen,
    title: "Writer Profiles",
    subtitle: "Your voice. Your space.",
    description: "Every writer gets a personalized profile, not just a username. Display your bio, your best pieces, your interests, and the ideas that define you. This isn't a social profile. It's your digital writer's desk.",
    color: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-900/30 to-cyan-900/20",
    borderColor: "border-blue-500/30",
    hoverBorder: "hover:border-blue-400/60"
  },
  {
    icon: Swords,
    title: "Writing Battles",
    subtitle: "Where words clash and ideas win.",
    description: "Step into monthly writing duels where articles, essays, or opinions face off. Winners are crowned by the community, not algorithms. Earn recognition, rewards, and a place on the leaderboard.",
    color: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-900/30 to-pink-900/20",
    borderColor: "border-purple-500/30",
    hoverBorder: "hover:border-purple-400/60"
  },
  {
    icon: Briefcase,
    title: "Job Portal",
    subtitle: "Turn your passion into pay.",
    description: "A dedicated space for freelance, remote, and part-time gigs. Writers can showcase portfolios, apply to curated jobs, and track their progress. Because powerful voices deserve powerful opportunities.",
    color: "from-green-500 to-emerald-500",
    bgGradient: "from-green-900/30 to-emerald-900/20",
    borderColor: "border-green-500/30",
    hoverBorder: "hover:border-green-400/60"
  },
  {
    icon: Users,
    title: "Writing Circles",
    subtitle: "Writing is better together.",
    description: "Team up with fellow creators on shared themes from mythology to modernity. Collaborate on series, respond to prompts, and co-create conversations. A creative greenhouse built by and for writers.",
    color: "from-orange-500 to-red-500",
    bgGradient: "from-orange-900/30 to-red-900/20",
    borderColor: "border-orange-500/30",
    hoverBorder: "hover:border-orange-400/60"
  },
  {
    icon: Brain,
    title: "Deep-Topic Feed",
    subtitle: "Substance over scroll.",
    description: "Curated articles on topics that matter not just what trends. Explore categories like politics, culture, science, history, or philosophy. Every feed is tailored to your curiosity, not your clicks.",
    color: "from-indigo-500 to-blue-500",
    bgGradient: "from-indigo-900/30 to-blue-900/20",
    borderColor: "border-indigo-500/30",
    hoverBorder: "hover:border-indigo-400/60"
  },
  {
    icon: MessageSquare,
    title: "Reader Engagement Tools",
    subtitle: "Your audience, your allies.",
    description: "Comments, votes, reactions, and shoutouts built to connect you with real readers. No vanity metrics. Just meaningful interaction. You don't just write here, you build a following.",
    color: "from-teal-500 to-cyan-500",
    bgGradient: "from-teal-900/30 to-cyan-900/20",
    borderColor: "border-teal-500/30",
    hoverBorder: "hover:border-teal-400/60"
  }
];


export function FeaturesSection() {
  const navigate = useNavigate();

  const handleCta = () => {
    // Track the button click
    trackEvent('features_cta_click', {
      button_text: 'Start Your Writing Journey',
      button_location: 'features_section',
      page_path: window.location.pathname
    });
    
    navigate('/login');
  };
  return (
    <section className="bg-black text-white py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <BackgroundEffects variant="animated" />
      <BackgroundEffects variant="particles" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <SectionHeader
          badge={{ icon: Sparkles, text: "Platform Features" }}
          title="What You'll Find"
          subtitle="Inside"
          description="Discover the tools and features that make Writers Ecosystem the ultimate platform for creative minds"
        />

        {/* Features Grid */}
        <ResponsiveGrid 
          cols={{ default: 1, md: 2 }} 
          gap={6}
          className="mb-12 sm:mb-16 lg:mb-20"
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group relative p-6 sm:p-8 rounded-xl border transition-all duration-300 ${feature.bgGradient} ${feature.borderColor} ${feature.hoverBorder}`}
          
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} flex-shrink-0`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{feature.subtitle}</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </ResponsiveGrid>

        {/* Bottom CTA */}
        <div className="text-center"
        onClick={handleCta}
        >
          <AnimatedButton
            icon={Sparkles}
            size="lg"
            className="shadow-2xl"
          >
            Start Your Writing Journey
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
}