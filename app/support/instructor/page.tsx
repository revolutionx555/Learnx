import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Video, Users, BarChart3, DollarSign, BookOpen, ArrowRight } from "lucide-react"

export default function InstructorResourcesPage() {
  const resources = [
    {
      icon: Video,
      title: "Course Creation",
      description: "Learn how to create engaging courses that students love.",
      guides: [
        "Planning your course curriculum",
        "Recording high-quality videos",
        "Creating engaging assignments",
        "Setting up course pricing",
      ],
    },
    {
      icon: Users,
      title: "Student Engagement",
      description: "Build strong relationships with your students and boost completion rates.",
      guides: [
        "Best practices for student interaction",
        "Managing course discussions",
        "Providing effective feedback",
        "Building a learning community",
      ],
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Use data to improve your courses and grow your teaching business.",
      guides: [
        "Understanding your analytics dashboard",
        "Tracking student progress",
        "Identifying improvement opportunities",
        "Using feedback to enhance courses",
      ],
    },
    {
      icon: DollarSign,
      title: "Monetization",
      description: "Maximize your earnings and build a sustainable teaching business.",
      guides: [
        "Pricing strategies for courses",
        "Understanding payout schedules",
        "Tax considerations for instructors",
        "Building multiple revenue streams",
      ],
    },
  ]

  const bestPractices = [
    {
      title: "Create High-Quality Content",
      description:
        "Invest in good audio and video equipment. Clear, professional content keeps students engaged and leads to better reviews.",
    },
    {
      title: "Structure Your Courses Well",
      description:
        "Break content into digestible modules. Use clear learning objectives and provide practical exercises throughout.",
    },
    {
      title: "Engage with Your Students",
      description:
        "Respond to questions promptly and provide personalized feedback. Active instructors see higher completion rates.",
    },
    {
      title: "Keep Content Updated",
      description:
        "Regularly update your courses to reflect industry changes and incorporate student feedback for continuous improvement.",
    },
  ]

  return (
    <div className="min-h-screen">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy to-blue-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-sans mb-6">
            Instructor
            <span className="block text-gold">Resources</span>
          </h1>
          <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-gray-200 leading-relaxed mb-8">
            Everything you need to create successful courses and build a thriving teaching business on Learn X.
          </p>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Teaching Resources</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resources.map((resource, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gold/10 rounded-xl mr-4">
                      <resource.icon className="h-8 w-8 text-gold" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-navy font-sans">{resource.title}</CardTitle>
                    </div>
                  </div>
                  <p className="text-gray-600">{resource.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {resource.guides.map((guide, guideIndex) => (
                      <li key={guideIndex}>
                        <Link
                          href="#"
                          className="text-gray-700 hover:text-gold transition-colors duration-200 flex items-center"
                        >
                          <ArrowRight className="h-3 w-3 mr-2" />
                          {guide}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Best Practices</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
          </div>

          <div className="space-y-8">
            {bestPractices.map((practice, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-navy mb-4">{practice.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{practice.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payout Information */}
      <section className="py-20 bg-warm-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Payout Information</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-navy mb-4">Revenue Share</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 70% instructor revenue share</li>
                    <li>• Monthly payouts on the 15th</li>
                    <li>• Minimum payout threshold: $50</li>
                    <li>• Multiple payment methods supported</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-navy mb-4">Payment Methods</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• PayPal</li>
                    <li>• Bank transfer</li>
                    <li>• Stripe direct deposit</li>
                    <li>• International wire transfer</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Apply to Teach */}
      <section className="py-20 bg-gradient-to-r from-navy to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="h-16 w-16 text-gold mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-sans">Ready to Start Teaching?</h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Join our community of expert instructors and start sharing your knowledge with learners worldwide.
          </p>
          <Button size="lg" asChild className="bg-gold hover:bg-gold/90 text-navy font-semibold text-lg px-8 py-4">
            <Link href="/auth/instructor-application">
              Apply to Become an Instructor
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
