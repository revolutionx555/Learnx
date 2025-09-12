import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search, BookOpen, Users, Video, Award, MessageSquare, ArrowRight } from "lucide-react"

export default function HelpCenterPage() {
  const categories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics of using Learn X",
      articles: [
        "How to create your account",
        "Navigating your dashboard",
        "Finding and enrolling in courses",
        "Setting up your profile",
      ],
    },
    {
      icon: Video,
      title: "Taking Courses",
      description: "Make the most of your learning experience",
      articles: [
        "How to watch course videos",
        "Tracking your progress",
        "Taking notes and bookmarks",
        "Downloading for offline viewing",
      ],
    },
    {
      icon: Award,
      title: "Certificates",
      description: "Everything about course completion",
      articles: [
        "How to earn certificates",
        "Downloading your certificates",
        "Sharing certificates on LinkedIn",
        "Certificate verification",
      ],
    },
    {
      icon: Users,
      title: "Account Management",
      description: "Managing your Learn X account",
      articles: [
        "Updating your profile",
        "Changing your password",
        "Managing notifications",
        "Billing and subscriptions",
      ],
    },
    {
      icon: MessageSquare,
      title: "Community",
      description: "Connecting with other learners",
      articles: [
        "Using discussion forums",
        "Asking questions effectively",
        "Following instructors",
        "Building your network",
      ],
    },
  ]

  const popularArticles = [
    "How to reset your password",
    "Troubleshooting video playback issues",
    "How to get a refund",
    "Downloading certificates",
    "Using Learn X on mobile devices",
    "Contacting instructor support",
  ]

  return (
    <div className="min-h-screen">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy to-blue-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-sans mb-6">
            Help
            <span className="block text-gold">Center</span>
          </h1>
          <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-gray-200 leading-relaxed mb-8">
            Find answers to your questions and get the most out of Learn X.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for help articles..."
              className="pl-12 py-4 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-300"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gold hover:bg-gold/90 text-navy">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Popular Articles</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularArticles.map((article, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <Link href="#" className="text-navy hover:text-gold font-medium flex items-center justify-between">
                    {article}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Browse by Category</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="p-4 bg-gold/10 rounded-2xl inline-block mb-4">
                    <category.icon className="h-10 w-10 text-gold" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-navy font-sans">{category.title}</CardTitle>
                  <p className="text-gray-600">{category.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.articles.map((article, articleIndex) => (
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

      {/* Contact Support */}
      <section className="py-20 bg-gradient-to-r from-navy to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MessageSquare className="h-16 w-16 text-gold mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-sans">Still Need Help?</h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Button size="lg" asChild className="bg-gold hover:bg-gold/90 text-navy font-semibold text-lg px-8 py-4">
            <Link href="/contact">
              Contact Support
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
