// Enhanced homepage with professional marketing design
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { Users, Award, Clock, Shield, Star, ArrowRight, Play, CheckCircle, GraduationCap, Zap } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: GraduationCap,
      title: "Expert-Led Courses",
      description: "Learn from industry professionals with years of real-world experience and proven track records.",
    },
    {
      icon: Users,
      title: "Interactive Community",
      description: "Connect with fellow learners, participate in discussions, and build your professional network.",
    },
    {
      icon: Award,
      title: "Verified Certificates",
      description: "Earn blockchain-verified certificates that showcase your achievements to employers worldwide.",
    },
    {
      icon: Zap,
      title: "AI-Powered Learning",
      description: "Personalized learning paths powered by AI to optimize your educational journey.",
    },
    {
      icon: Clock,
      title: "Learn at Your Pace",
      description: "Flexible scheduling that fits your lifestyle. Access courses 24/7 from any device.",
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "All courses are carefully curated and regularly updated to meet industry standards.",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      content: "Learn X transformed my career. The React course was incredibly comprehensive and practical.",
      rating: 5,
      avatar: "/instructor-avatar.png",
    },
    {
      name: "Marcus Johnson",
      role: "Data Scientist at Microsoft",
      content: "The AI-powered learning paths helped me focus on exactly what I needed to advance my skills.",
      rating: 5,
      avatar: "/professional-man-cto.png",
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer at Airbnb",
      content:
        "Outstanding instructors and a supportive community. I landed my dream job after completing the UX course.",
      rating: 5,
      avatar: "/female-instructor-avatar.png",
    },
  ]

  return (
    <div className="min-h-screen">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/abstract-learning-pattern.png')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-sans leading-tight">
                  Your Next Step
                  <span className="block text-gold">Starts Here</span>
                </h1>
                <div className="w-24 h-1 bg-gold rounded-full"></div>
              </div>
              <p className="text-xl text-gray-200 leading-relaxed max-w-lg">
                Learn X gives you the tools, mentorship, and flexibility to achieve your goals — wherever you are. Join
                thousands advancing their careers with our expert-led courses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-gold hover:bg-gold/90 text-navy font-semibold text-lg px-8 py-4"
                >
                  <Link href="/auth/student-signup">
                    Start Learning Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gold text-gold hover:bg-gold hover:text-navy font-semibold text-lg px-8 py-4 bg-transparent"
                >
                  <Play className="mr-2 h-5 w-5" />
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/new%20placement.jpg-sS7TZk5T1s9cNssPxRapcs4NpqhqXu.jpeg"
                  alt="Learn X Platform Dashboard"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gold/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-sky-blue/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Why Choose Learn X?</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've built the most comprehensive learning platform that adapts to your needs and accelerates your
              growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gold/10 rounded-xl group-hover:bg-gold/20 transition-colors duration-300">
                      <feature.icon className="h-8 w-8 text-gold" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-3 font-sans">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">
              Trusted by Professionals Worldwide
            </h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of learners who have transformed their careers with Learn X.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-gold fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <div className="font-semibold text-navy">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-sans">Ready to Transform Your Career?</h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Join professionals who have already started their learning journey with Learn X. Your future self will thank
            you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-gold hover:bg-gold/90 text-navy font-semibold text-lg px-8 py-4">
              <Link href="/auth/student-signup">
                Start Learning Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-navy font-semibold text-lg px-8 py-4 bg-transparent"
            >
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center space-x-4 text-sm text-gray-300">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-gold mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-gold mr-2" />
              Free course previews
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-gold mr-2" />
              Lifetime access
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
