import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy to-blue-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold font-sans mb-6">Terms of Service</h1>
          <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-gray-200 leading-relaxed">Last updated: January 2025</p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 prose prose-lg max-w-none">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing and using Learn X, you accept and agree to be bound by the terms and provision of this
                    agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">2. Use License</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Permission is granted to temporarily access Learn X for personal, non-commercial transitory viewing
                    only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for commercial purposes or public display</li>
                    <li>Attempt to reverse engineer any software contained on the platform</li>
                    <li>Remove any copyright or proprietary notations from the materials</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">3. User Accounts</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    When you create an account with us, you must provide information that is accurate, complete, and
                    current at all times. You are responsible for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Safeguarding your password and account information</li>
                    <li>All activities that occur under your account</li>
                    <li>Notifying us immediately of any unauthorized use</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">4. Course Content and Intellectual Property</h2>
                  <p className="text-gray-700 leading-relaxed">
                    All course content, including videos, text, images, and other materials, is protected by copyright
                    and other intellectual property laws. You may access course content solely for your personal,
                    non-commercial use.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">5. Payment and Refunds</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Payment terms vary by subscription plan. We offer a 30-day money-back guarantee for paid
                    subscriptions. Refund requests must be submitted within the specified timeframe.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">6. Prohibited Uses</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">You may not use our service:</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                    <li>
                      To violate any international, federal, provincial, or state regulations, rules, laws, or local
                      ordinances
                    </li>
                    <li>
                      To infringe upon or violate our intellectual property rights or the intellectual property rights
                      of others
                    </li>
                    <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                    <li>To submit false or misleading information</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">7. Termination</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may terminate or suspend your account and bar access to the service immediately, without prior
                    notice or liability, under our sole discretion, for any reason whatsoever including breach of the
                    Terms.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">8. Disclaimer</h2>
                  <p className="text-gray-700 leading-relaxed">
                    The information on this platform is provided on an 'as is' basis. To the fullest extent permitted by
                    law, Learn X excludes all representations, warranties, conditions and terms.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">9. Contact Information</h2>
                  <p className="text-gray-700 leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us at legal@learnx.com.
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
