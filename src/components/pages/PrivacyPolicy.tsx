import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "../layout/container";
import { BackgroundEffects } from "../ui/background-effects";
import { SectionHeader } from "../ui/section-header";
import { ArrowLeft, Shield } from "lucide-react";

export function PrivacyPolicy() {
  const currentYear = new Date().getFullYear();
  const launchDate = "August 3, 2025";
  const platformName = "Writers Ecosystem";
  const domain = "writersecosystem.com";
  const supportEmail = "support@writersecosystem.com";
  const navigate = useNavigate();

  // Set page title and meta description
  useEffect(() => {
    document.title = `Privacy Policy - ${platformName}`;

    // Type-safe meta description handling
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      "content",
      `Learn how ${platformName} collects, uses, and protects your personal data`
    );

    return () => {
      document.title = platformName;
      if (metaDescription && metaDescription.parentNode) {
        document.head.removeChild(metaDescription);
      }
    };
  }, [platformName]);

  return (
    <section className="bg-black text-white py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <BackgroundEffects variant="animated" />
      <BackgroundEffects variant="particles" />

      <Container className="relative m-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 mb-4 sm:mb-6 group lg:ml-60"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-base sm:text-lg font-medium">Back</span>
        </button>
        {/* Header */}
        <SectionHeader
          badge={{ icon: Shield, text: "Data Protection" }}
          title="Privacy Policy"
          description="How we collect, use, and protect your personal information"
        />

        <div className="max-w-4xl mx-auto mt-12">
          <div className="mb-8 p-6 bg-gradient-to-br from-blue-900/30 to-purple-900/20 rounded-xl border border-blue-500/30">
            <p className="text-gray-300">
              <span className="font-medium text-white">Effective Date:</span>{" "}
              {launchDate}
              <br />
              <span className="font-medium text-white">Platform:</span>{" "}
              {platformName} (
              <Link to="/" className="text-blue-400 hover:underline">
                https://{domain}
              </Link>
              )<br />
              <span className="font-medium text-white">Owner:</span> Vedant
              Chaturvedi (Founder)
            </p>
          </div>

          <div className="space-y-8">
            {/* Section 1 */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-gray-900/30 to-gray-800/20 border border-gray-700/30 hover:border-gray-600/60 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {platformName} ("we", "our", or "us") is committed to
                safeguarding your privacy. This Privacy Policy outlines how we
                collect, use, store, and protect your personal data when you
                interact with our website, mobile services, and platform.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                By using our platform, you consent to the terms of this Privacy
                Policy.
              </p>
            </div>

            {/* Section 2 */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-gray-900/30 to-gray-800/20 border border-gray-700/30 hover:border-gray-600/60 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4">
                2. Legal Compliance
              </h2>
              <p className="text-gray-300 leading-relaxed">
                This Privacy Policy is governed under the Information Technology
                Act, 2000 and its amendments, specifically the Information
                Technology (Reasonable Security Practices and Procedures and
                Sensitive Personal Data or Information) Rules, 2011 (SPDI
                Rules).
              </p>
            </div>

            {/* Section 3 */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-gray-900/30 to-gray-800/20 border border-gray-700/30 hover:border-gray-600/60 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4">
                3. Information We Collect
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may collect the following personal and non-personal
                information:
              </p>

              <h3 className="text-lg font-semibold text-white mb-2">
                a. Personal Information
              </h3>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-300">
                <li>Full Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>UPI ID or Bank details (for payouts)</li>
                <li>Social media links (if submitted)</li>
                <li>IP address</li>
                <li>Device/browser information</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mb-2">
                b. Content & Usage Data
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Articles, eBooks, comments, or any content submitted</li>
                <li>Participation in battles, job listings, or submissions</li>
                <li>Purchase and payout history</li>
                <li>Clickstream data for platform improvement</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-gray-900/30 to-gray-800/20 border border-gray-700/30 hover:border-gray-600/60 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4">
                4. How We Collect Data
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Direct input via forms and dashboards</li>
                <li>
                  Automatic tracking through cookies, Supabase logs, and session
                  data
                </li>
                <li>
                  Third-party integrations (e.g., Razorpay, email automation)
                </li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-gray-900/30 to-gray-800/20 border border-gray-700/30 hover:border-gray-600/60 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4">
                5. Use of Data
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use your data for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Platform operations and feature delivery</li>
                <li>Reward distribution and eBook payouts</li>
                <li>Verifying authorship and originality</li>
                <li>
                  Sending service updates, feature notifications, or promotional
                  content
                </li>
                <li>Detecting fraud or policy violations</li>
                <li>Improving user experience and platform analytics</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-gray-900/30 to-gray-800/20 border border-gray-700/30 hover:border-gray-600/60 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4">
                6. Disclosure of Information
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We do not sell your personal data. We may share data with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>
                  Internal employees or service providers (e.g., hosting or
                  analytics)
                </li>
                <li>
                  Payment processors (e.g., Razorpay, for financial
                  transactions)
                </li>
                <li>
                  Law enforcement or government agencies (only when required by
                  law)
                </li>
              </ul> 
            </div>

            {/* Section 7 */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-gray-900/30 to-gray-800/20 border border-gray-700/30 hover:border-gray-600/60 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4">
                7. Data Storage and Security
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Your data is securely stored via Supabase, hosted on encrypted,
                access-controlled servers.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                We implement reasonable security practices as per Indian IT
                Rules and industry standards, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>HTTPS encryption</li>
                <li>Role-based access control</li>
                <li>Activity monitoring</li>
                <li>Routine backups</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                However, we cannot guarantee 100% security in digital
                transmission.
              </p>
            </div>

            {/* Continue with remaining sections in same pattern... */}

            {/* Contact Section */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-blue-900/30 to-purple-900/20 border border-blue-500/30 hover:border-blue-400/60 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                For any concerns, queries, or requests regarding your data or
                privacy, contact:
              </p>
              <div className="p-4 bg-black/30 rounded-lg">
                <p className="text-gray-300">
                  <span className="font-medium text-white">{platformName}</span>
                  <br />
                  <span className="font-medium text-white">Email:</span>{" "}
                  <a
                    href={`mailto:${supportEmail}`}
                    className="text-blue-400 hover:underline"
                  >
                    {supportEmail}
                  </a>
                  <br />
                  <span className="font-medium text-white">Founder:</span>{" "}
                  Vedant Chaturvedi
                  <br />
                  <span className="font-medium text-white">Website:</span>{" "}
                  <Link to="/" className="text-blue-400 hover:underline">
                    https://{domain}
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
            <p>
              &copy; {currentYear} {platformName}. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
