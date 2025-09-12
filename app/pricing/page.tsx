// Pricing page with subscription plans
import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check, Star, ArrowRight, Zap } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with basic learning",
      features: [
        "Access to 50+ free courses",
        "Basic progress tracking",
        "Community forum access",
        "Mobile app access",
        "Standard video quality",
      ],
      limitations: ["No certificates", "Limited course selection", "No live sessions", "Basic support only"],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "Ideal for serious learners and professionals",
      features: [
        "Access to 1,200+ premium courses",
        "Verified certificates",
        "Live sessions with instructors",
        "AI-powered learning paths",
        "HD video quality",
        "Offline downloads",
        "Priority support",
        "Progress analytics",
      ],
      limitations: [],
      cta: "Start Pro Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "Comprehensive solution for teams and organizations",
      features: [
        "Everything in Pro",
        "Custom course creation",
        "Team management dashboard",
        "Advanced analytics",
        "SSO integration",
        "Custom branding",
        "Dedicated account manager",
        "API access",
        "SCORM compliance",
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  const faqs = [
    {
      question: "Can I switch plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. No questions asked.",
    },
    {
      question: "Are certificates included?",
      answer:
        "Verified certificates are included with Pro and Enterprise plans. Free users can purchase certificates separately.",
    },
    {
      question: "Is there a student discount?",
      answer: "Yes! Students get 50% off Pro plans with a valid student email address.",
    },
  ]

  return (
    <div className="min-h-screen">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy to-blue-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-sans mb-6">
            Simple, Transparent
            <span className="block text-gold">Pricing</span>
          </h1>
          <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-gray-200 leading-relaxed mb-8">
            Choose the perfect plan for your learning journey. Start free, upgrade when you're ready.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular
                    ? "border-2 border-gold shadow-2xl scale-105"
                    : "border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gold text-navy px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}
                <CardHeader className="text-center pb-8 pt-8">
                  <h3 className="text-2xl font-bold text-navy font-sans mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-navy">{plan.price}</span>
                    {plan.period !== "pricing" && <span className="text-gray-500 ml-2">/{plan.period}</span>}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-gold mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={`w-full ${
                      plan.popular ? "bg-gold hover:bg-gold/90 text-navy" : "bg-navy hover:bg-navy/90 text-white"
                    } font-semibold`}
                    size="lg"
                  >
                    <Link href={plan.name === "Enterprise" ? "/contact" : "/auth/register"}>
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Frequently Asked Questions</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
          </div>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-navy mb-4">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Zap className="h-16 w-16 text-gold mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-sans">Ready to Get Started?</h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Join thousands of learners who are already advancing their careers with Learn X.
          </p>
          <Button size="lg" asChild className="bg-gold hover:bg-gold/90 text-navy font-semibold text-lg px-8 py-4">
            <Link href="/auth/register">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
