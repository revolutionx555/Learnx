import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MapPin, Clock, Users, Heart, Zap, Globe, ArrowRight } from "lucide-react"

export default function CareersPage() {
  const openPositions = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote / Abuja, Nigeria",
      type: "Full-time",
      description: "Build scalable learning platforms using React, Node.js, and modern web technologies.",
      requirements: ["5+ years experience", "React/Node.js expertise", "EdTech experience preferred"],
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote / Abuja, Nigeria",
      type: "Full-time",
      description: "Design intuitive learning experiences that delight students and instructors worldwide.",
      requirements: ["3+ years UX/UI design", "Figma proficiency", "Mobile design experience"],
    },
    {
      title: "Content Marketing Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Create compelling content that showcases our platform and attracts new learners.",
      requirements: ["Content marketing experience", "SEO knowledge", "EdTech background preferred"],
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      description: "Help our enterprise customers succeed with Learn X and drive platform adoption.",
      requirements: ["Customer success experience", "SaaS background", "Excellent communication skills"],
    },
  ]

  const benefits = [
    {
      icon: Globe,
      title: "Remote-First Culture",
      description: "Work from anywhere in the world with flexible hours and async collaboration.",
    },
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental health support, and wellness stipends.",
    },
    {
      icon: Zap,
      title: "Learning Budget",
      description: "$2,000 annual learning budget for courses, conferences, and professional development.",
    },
    {
      icon: Users,
      title: "Equity & Growth",
      description: "Competitive equity package and clear career progression paths for all roles.",
    },
  ]

  return (
    <div className="min-h-screen">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy to-blue-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-sans mb-6">
            Join Our
            <span className="block text-gold">Mission</span>
          </h1>
          <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-gray-200 leading-relaxed mb-8">
            Help us democratize education and empower learners worldwide. Build the future of online learning with a
            passionate, global team.
          </p>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-6 font-sans">Why Work at Learn X?</h2>
              <div className="w-24 h-1 bg-gold rounded-full mb-8"></div>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  At Learn X, we're not just building a platform – we're transforming how the world learns. Our team is
                  passionate about education, innovation, and creating meaningful impact in people's lives.
                </p>
                <p>
                  We believe in remote-first culture, continuous learning, and empowering every team member to do their
                  best work. Join us in building the future of education technology.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/diverse-students-online-learning.png"
                alt="Learn X team culture"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Benefits & Perks</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We invest in our team's success with comprehensive benefits and a supportive work environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-8">
                  <div className="p-4 bg-gold/10 rounded-2xl inline-block mb-6">
                    <benefit.icon className="h-10 w-10 text-gold" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-4 font-sans">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Open Positions</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our growing team and help shape the future of online education.
            </p>
          </div>

          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <h3 className="text-2xl font-semibold text-navy font-sans">{position.title}</h3>
                        <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20">
                          {position.department}
                        </Badge>
                      </div>

                      <p className="text-gray-600 mb-4 leading-relaxed">{position.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {position.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {position.type}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {position.requirements.map((req, reqIndex) => (
                          <Badge key={reqIndex} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 lg:mt-0 lg:ml-8">
                      <Button asChild className="bg-navy hover:bg-navy/90 text-white font-semibold">
                        <Link href={`mailto:careers@learnx.com?subject=Application for ${position.title}`}>
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
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
          <Users className="h-16 w-16 text-gold mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-sans">Don't See Your Role?</h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            We're always looking for talented individuals who share our passion for education. Send us your resume and
            let's talk!
          </p>
          <Button size="lg" asChild className="bg-gold hover:bg-gold/90 text-navy font-semibold text-lg px-8 py-4">
            <Link href="mailto:careers@learnx.com?subject=General Application">
              Send Your Resume
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
