// About page showcasing company story and team
import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Target, Users, Award, Globe, ArrowRight, Heart } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We believe education should be accessible, engaging, and transformative for everyone.",
    },
    {
      icon: Users,
      title: "Community-First",
      description: "Learning is better together. We foster connections between learners and instructors worldwide.",
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description: "Every course is carefully curated and regularly updated to meet the highest standards.",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "We're building a world where anyone, anywhere can access world-class education.",
    },
  ]

  const team = [
    {
      name: "Dannie Spencer",
      role: "CEO & Founder",
      bio: "Visionary leader with 10+ years in EdTech, passionate about democratizing quality education globally.",
      image: "/professional-man-cto.png",
    },
    {
      name: "Winner Sumaila",
      role: "CTO & Co-Founder",
      bio: "Full-stack engineer and AI specialist, expert in scalable learning platforms and educational technology.",
      image: "/professional-woman-professor.png",
    },
    {
      name: "Daniel Barnabas",
      role: "Head of Product",
      bio: "Product strategist focused on creating intuitive learning experiences that drive student success.",
      image: "/professional-man-product.png",
    },
    {
      name: "Daniel Israel",
      role: "Lead Developer",
      bio: "Senior software engineer specializing in modern web technologies and educational platform architecture.",
      image: "/instructor-testimonial-1.png",
    },
  ]

  const stats = [
    { number: "2025", label: "Founded" },
    { number: "10+", label: "Active Learners" },
    { number: "20+", label: "Expert Instructors" },
    { number: "5+", label: "Countries Served" },
  ]

  return (
    <div className="min-h-screen">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy to-blue-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-sans mb-6">
            Empowering Learners
            <span className="block text-gold">Worldwide</span>
          </h1>
          <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-gray-200 leading-relaxed mb-8">
            Learn X was born from a simple belief: everyone deserves access to world-class education, regardless of
            their location, background, or circumstances.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-6 font-sans">Our Story</h2>
              <div className="w-24 h-1 bg-gold rounded-full mb-8"></div>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  Founded in 2025 by Learn X, our learning platform emerged from a shared vision to revolutionize online
                  education through innovative technology and exceptional user experience.
                </p>
                <p>
                  Led by CEO Dannie Spencer and CTO Winner Sumaila, our team combines deep expertise in education
                  technology with a passion for creating meaningful learning experiences that transform lives.
                </p>
                <p>
                  Today, we're building the future of education with our dedicated team including Product Head Daniel
                  Barnabas and Lead Developer Daniel Israel, delivering cutting-edge learning solutions to students
                  worldwide.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/diverse-students-online-learning.png"
                alt="Learn X team collaboration"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-gold/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-sky-blue/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Our Values</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do, from product development to customer support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-8">
                  <div className="p-4 bg-gold/10 rounded-2xl inline-block mb-6">
                    <value.icon className="h-10 w-10 text-gold" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-4 font-sans">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-sans">Learn X by the Numbers</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-gold mb-2">{stat.number}</div>
                <div className="text-gray-300 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Meet Our Team</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're the Learn X team - passionate educators, engineers, and innovators united by our mission to
              transform online learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-navy mb-2 font-sans">{member.name}</h3>
                  <p className="text-gold font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-16 w-16 text-gold mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-sans">Join Our Mission</h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Be part of a global community that's transforming education and empowering learners worldwide.
          </p>
          <Button size="lg" asChild className="bg-gold hover:bg-gold/90 text-navy font-semibold text-lg px-8 py-4">
            <Link href="/auth/register">
              Start Learning Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
