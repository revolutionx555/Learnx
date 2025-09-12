import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Video, Award, MessageSquare, Settings, ArrowRight } from "lucide-react"

export default function StudentSupportPage() {
  const supportTopics = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn how to navigate Learn X and make the most of your learning experience.",
      articles: [
        "Creating your student account",
        "Setting up your profile",
        "Finding and enrolling in courses",
        "Understanding your dashboard",
      ],
    },
    {
      icon: Video,
      title: "Taking Courses",
      description: "Everything you need to know about accessing and completing courses.",
      articles: [
        "How to watch course videos",
        "Taking notes and bookmarks",
        "Downloading for offline viewing",
        "Tracking your progress",
      ],
    },
    {
      icon: Award,
      title: "Certificates & Achievements",
      description: "Learn about earning and managing your course certificates.",
      articles: [
        "How to earn certificates",
        "Downloading your certificates",
        "Sharing on LinkedIn",
        "Certificate verification",
      ],
    },
    {
      icon: Settings,
      title: "Account Management",
      description: "Manage your account settings, billing, and preferences.",
      articles: ["Updating your profile", "Managing subscriptions", "Changing your password", "Notification settings"],
    },
  ]

  const quickLinks = [
    { title: "Reset Password", href: "/auth/reset-password" },
    { title: "Update Payment Method", href: "/account/billing" },
    { title: "Download Mobile App", href: "/mobile" },
    { title: "Contact Support", href: "/contact" },
  ]

  return (
    <div className="min-h-screen">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy to-blue-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-sans mb-6">
            Student
            <span className="block text-gold">Support</span>
          </h1>
          <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-gray-200 leading-relaxed mb-8">
            Get help with your courses, account, and learning journey. We're here to support your success.
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Quick Help</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <Button asChild variant="ghost" className="w-full h-auto p-4 text-navy hover:text-gold">
                    <Link href={link.href} className="flex items-center justify-center">
                      {link.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Topics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Support Topics</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {supportTopics.map((topic, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gold/10 rounded-xl mr-4">
                      <topic.icon className="h-8 w-8 text-gold" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-navy font-sans">{topic.title}</CardTitle>
                    </div>
                  </div>
                  <p className="text-gray-600">{topic.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {topic.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <Link
                          href="#"
                          className="text-gray-700 hover:text-gold transition-colors duration-200 flex items-center"
                        >
                          <ArrowRight className="h-3 w-3 mr-2" />
                          {article}
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

      {/* Study Tips */}
      <section className="py-20 bg-warm-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Study Tips for Success</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
          </div>

          <div className="space-y-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-navy mb-4">Set a Learning Schedule</h3>
                <p className="text-gray-700 leading-relaxed">
                  Consistency is key to successful online learning. Set aside dedicated time each day or week for your
                  courses and stick to it.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-navy mb-4">Take Notes and Practice</h3>
                <p className="text-gray-700 leading-relaxed">
                  Use our built-in note-taking feature to capture key concepts. Apply what you learn through practice
                  exercises and real-world projects.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-navy mb-4">Engage with the Community</h3>
                <p className="text-gray-700 leading-relaxed">
                  Join discussions, ask questions, and connect with fellow learners. Learning is more effective when
                  you're part of a community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-gradient-to-r from-navy to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MessageSquare className="h-16 w-16 text-gold mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-sans">Still Need Help?</h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Our support team is here to help you succeed. Get personalized assistance with your learning journey.
          </p>
          <Button size="lg" asChild className="bg-gold hover:bg-gold/90 text-navy font-semibold text-lg px-8 py-4">
            <Link href="/contact">
              Contact Student Support
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
