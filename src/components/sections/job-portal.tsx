import { Briefcase } from "lucide-react";
import { Container } from "../layout/container";
import { AnimatedButton } from "../ui/animated-button";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "../utils/analytics";

export function JobPortalSection() {
  const navigate = useNavigate();
  const handleExploreJobs = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCta = () => {
    trackEvent('job_portal_cta_click', {
      button_text: 'Explore Jobs for Writers',
      section: 'job_portal_section',
      page_path: window.location.pathname
    });
    navigate("/jobs");
  };

  return (
    <section className="bg-black text-white py-16 sm:py-24 px-6">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light mb-6 leading-tight">
              Turn Passion Into{" "}
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Pay
              </span>
            </h2>

            <p className="text-gray-300 text-base sm:text-lg mb-8 leading-relaxed font-light">
              Connect with publications, brands, and organizations looking for
              authentic voices. Our job portal matches writers with
              opportunities that align with their expertise and aspirations.
            </p>

            <div onClick={handleCta}>
              <AnimatedButton
                onClick={handleExploreJobs}
                icon={Briefcase}
                size="lg"
              >
                Explore Jobs for Writers
              </AnimatedButton>
            </div>
          </div>

          {/* Visual */}
          <div className="relative order-1 lg:order-2">
            <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-green-900/20 to-emerald-900/10 p-6 sm:p-8 rounded-xl border border-green-500/20 backdrop-blur-sm">
              <div className="space-y-4">
                {/* Mock job listings */}
                {[
                  {
                    title: "Senior Content Writer",
                    company: "TechFlow",
                    salary: "$75K-95K",
                    type: "Remote",
                  },
                  {
                    title: "Science Writer",
                    company: "Nature Comm",
                    salary: "$0.50/word",
                    type: "Freelance",
                  },
                  {
                    title: "Editorial Assistant",
                    company: "Literary Q",
                    salary: "$25-35/hr",
                    type: "Part-time",
                  },
                ].map((job, index) => (
                  <div
                    key={index}
                    className="bg-black/30 p-4 rounded-lg border border-green-500/10 hover:border-green-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white text-sm sm:text-base">
                        {job.title}
                      </h4>
                      <span className="text-green-400 text-xs sm:text-sm font-medium">
                        {job.salary}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-400">
                      <span className="text-green-300">{job.company}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-green-500/20 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg sm:text-xl font-bold text-green-400">
                    150+
                  </div>
                  <div className="text-xs text-gray-400">Active Jobs</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-green-400">
                    50+
                  </div>
                  <div className="text-xs text-gray-400">Companies</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-green-400">
                    $2M+
                  </div>
                  <div className="text-xs text-gray-400">Paid Out</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
