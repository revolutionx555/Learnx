// Features page showcasing platform capabilities
import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Brain,
  Users,
  Award,
  Video,
  MessageSquare,
  BarChart3,
  Smartphone,
  Globe,
  Shield,
  Zap,
  BookOpen,
  ArrowRight,
} from "lucide-react"

export default function FeaturesPage() {
  const coreFeatures = [
    {
      icon: Video,
      title: "HD Video Learning",
      description:
        "Crystal-clear video content with interactive transcripts, playback speed control, and offline downloads.",
    },
    {
      icon: Brain,
      title: "AI-Powered Paths",
      description: "Personalized learning journeys that adapt to your pace, preferences, and career goals.",
    },
    {
      icon: Users,
      title: "Live Sessions",
      description: "Join live classes, workshops, and Q&A sessions with expert instructors and fellow learners.",
    },
    {
      icon: Award,
      title: "Blockchain Certificates",
      description: "Earn tamper-proof, verifiable certificates that employers can trust and validate instantly.",
    },
    {
      icon: MessageSquare,
      title: "Community Forums",
      description: "Engage in discussions, get help from peers, and build lasting professional relationships.",
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Track your learning progress with detailed analytics and personalized recommendations.",
    },
  ]

  const advancedFeatures = [
    {
      icon: Smartphone,
      title: "Mobile Learning",
      description: "Learn on-the-go with our mobile app. Download courses for offline access anywhere, anytime.",
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Access courses in multiple languages with auto-generated subtitles and translations.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with SSO integration, GDPR compliance, and data encryption.",
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "Get immediate feedback on assignments and quizzes with AI-powered grading systems.",
    },
  ]

  return (
    <div className="min-h-screen">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-sans mb-6">
              Powerful Features for
              <span className="block text-gold">Modern Learning</span>
            </h1>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-200 leading-relaxed mb-8">
              Discover the comprehensive suite of tools and features that make Learn X the most advanced learning
              management system for professionals and students alike.
            </p>
            <Button size="lg" asChild className="bg-gold hover:bg-gold/90 text-navy font-semibold text-lg px-8 py-4">
              <Link href="/auth/register">
                Try All Features Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Core Learning Features</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for an exceptional learning experience, built with modern technology and pedagogy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-4 bg-gold/10 rounded-2xl group-hover:bg-gold/20 transition-colors duration-300">
                      <feature.icon className="h-10 w-10 text-gold" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-4 font-sans">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Advanced Capabilities</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge features that set Learn X apart from traditional learning platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {advancedFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="p-3 bg-gold/10 rounded-xl flex-shrink-0">
                    <feature.icon className="h-8 w-8 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-navy mb-2 font-sans">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative">
              <img
                src="/advanced-learning-dashboard.png"
                alt="Advanced Features Dashboard"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-gold/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-sky-blue/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="h-16 w-16 text-gold mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-sans">Experience All Features Today</h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Don't just read about our features — experience them yourself with a free 14-day trial. No credit card
            required.
          </p>
          <Button size="lg" asChild className="bg-gold hover:bg-gold/90 text-navy font-semibold text-lg px-8 py-4">
            <Link href="/auth/register">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
