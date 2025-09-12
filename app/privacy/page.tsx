import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy to-blue-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold font-sans mb-6">Privacy Policy</h1>
          <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-gray-200 leading-relaxed">Last updated: January 2025</p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 prose prose-lg max-w-none">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">1. Information We Collect</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We collect information you provide directly to us, such as when you create an account, enroll in
                    courses, or contact us for support. This includes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Personal information (name, email address, profile information)</li>
                    <li>Account credentials and preferences</li>
                    <li>Course progress and completion data</li>
                    <li>Payment information (processed securely by third-party providers)</li>
                    <li>Communications with our support team</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">2. How We Use Your Information</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">We use the information we collect to:</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Send technical notices, updates, and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Personalize your learning experience</li>
                    <li>Monitor and analyze usage patterns to improve our platform</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">3. Information Sharing</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We do not sell, trade, or otherwise transfer your personal information to third parties except as
                    described in this policy:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>With your consent or at your direction</li>
                    <li>With service providers who assist us in operating our platform</li>
                    <li>To comply with legal obligations or protect our rights</li>
                    <li>In connection with a business transfer or acquisition</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">4. Data Security</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We implement appropriate technical and organizational measures to protect your personal information
                    against unauthorized access, alteration, disclosure, or destruction. However, no method of
                    transmission over the internet is 100% secure.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">5. Your Rights</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Access and update your personal information</li>
                    <li>Request deletion of your account and data</li>
                    <li>Opt out of marketing communications</li>
                    <li>Request a copy of your data</li>
                    <li>Object to processing of your personal information</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">6. Cookies and Tracking</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We use cookies and similar technologies to enhance your experience, analyze usage, and provide
                    personalized content. You can control cookie settings through your browser preferences.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">7. Contact Us</h2>
                  <p className="text-gray-700 leading-relaxed">
                    If you have questions about this Privacy Policy, please contact us at privacy@learnx.com or through
                    our contact page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
