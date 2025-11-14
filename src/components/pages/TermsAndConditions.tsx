import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "../layout/container";
import { BackgroundEffects } from "../ui/background-effects";
import { SectionHeader } from "../ui/section-header";
import { ArrowLeft, FileText } from "lucide-react";

export function TermsAndConditions() {
  const currentYear = new Date().getFullYear();
  const launchDate = "August 3, 2025";
  const platformName = "Writers Ecosystem";
  const domain = "writersecosystem.com";
  const supportEmail = "support@writersecosystem.com";
  const navigate = useNavigate();

  // Set page title and meta description
  useEffect(() => {
    document.title = `Terms and Conditions - ${platformName}`;

    // Type-safe meta description handling
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      "content",
      `Read the terms and conditions for using ${platformName}`
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
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 mb-4 sm:mb-6 group lg:ml-60"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-base sm:text-lg font-medium">Back</span>
        </button>
        <SectionHeader
          badge={{ icon: FileText, text: "Legal Documentation" }}
          title="Terms & Conditions"
          description="Please read these terms carefully before using our platform"
        />

        <div className="max-w-4xl mx-auto mt-12">
          <div className="mb-8 p-6 bg-gradient-to-br from-blue-900/30 to-purple-900/20 rounded-xl border border-blue-500/30">
            <p className="text-gray-300">
              <span className="font-medium text-white">Effective Date:</span>{" "}
              {launchDate}
              <br />
              <span className="font-medium text-white">
                Platform Name:
              </span>{" "}
              {platformName} (
              <Link to="/" className="text-blue-400 hover:underline">
                https://{domain}
              </Link>
              )<br />
              <span className="font-medium text-white">Owner:</span> Vedant
              Chaturvedi
            </p>
          </div>

          <div className="space-y-8">
            {/* Section 1 */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-gray-900/30 to-gray-800/20 border border-gray-700/30 hover:border-gray-600/60 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing or using {platformName} ("Platform", "We", "Us"),
                users ("You", "User", "Author", "Employer") agree to comply with
                these Terms & Conditions and our{" "}
                <Link to="/privacy" className="text-blue-400 hover:underline">
                  Privacy Policy
                </Link>
                . If you disagree, please do not use this platform.
              </p>
            </div>

            {/* Section 2 */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-gray-900/30 to-gray-800/20 border border-gray-700/30 hover:border-gray-600/60 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4">
                2. Eligibility
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Use of this platform is restricted to individuals aged 13 years
                and above. By using the platform, you confirm that you meet this
                age requirement and are legally capable of entering into a
                binding contract under Indian law.
              </p>
            </div>

            {/* Section 3 */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-gray-900/30 to-gray-800/20 border border-gray-700/30 hover:border-gray-600/60 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4">
                3. User Accounts
              </h2>
              <p className="text-gray-300 leading-relaxed">
                You are responsible for maintaining the confidentiality of your
                account and password. We reserve the right to suspend,
                terminate, or delete accounts at our sole discretion, especially
                in cases of abuse, violation of these terms, or suspected
                illegal activity.
              </p>
            </div>

            {/* Section 4 */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-gray-900/30 to-gray-800/20 border border-gray-700/30 hover:border-gray-600/60 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4">
                4. Content Ownership and Licensing
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                All original content (articles, eBooks, posts, job listings,
                comments) created by users remains their intellectual property.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                However, by publishing on {platformName}, you grant us a
                royalty-free, worldwide, non-exclusive license to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-300">
                <li>
                  Display, promote, distribute, monetize, and adapt your content
                </li>
                <li>Use it in marketing and branding material</li>
                <li>
                  Retain a permanent, archived version (even after deletion)
                </li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                Platform reserves the right to remove or modify any content that
                violates policies, law, or quality standards — at our sole
                discretion.
              </p>
            </div>

            {/* Section 5 */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-gray-900/30 to-gray-800/20 border border-gray-700/30 hover:border-gray-600/60 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4">
                5. Revenue Sharing & Platform Fees
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {platformName} takes a flat 20% commission only on eBook sales.
                The remaining 80% is transferred to the author within 24 hours
                via UPI, as per our payout system.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                Other platform features like battles, job listings, or future
                monetized services may follow a separate model, which will be
                introduced with prior notice.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                All earnings and deductions will be transparently shown in the
                user's dashboard.
              </p>
            </div>

            {/* Contact Section */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-blue-900/30 to-purple-900/20 border border-blue-500/30 hover:border-blue-400/60 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                For queries or legal concerns, contact:
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
