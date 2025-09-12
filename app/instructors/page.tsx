import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Star, Users, BookOpen, Award, ArrowRight } from "lucide-react"

export default function InstructorsPage() {
  const featuredInstructors = [
    {
      name: "Dr. Sarah Chen",
      title: "Data Science Expert",
      image: "/female-instructor-avatar.png",
      rating: 4.9,
      students: 12500,
      courses: 8,
      specialties: ["Machine Learning", "Python", "Statistics"],
      bio: "Former Google AI researcher with 10+ years experience in machine learning and data science.",
    },
    {
      name: "Marcus Johnson",
      title: "Full Stack Developer",
      image: "/instructor-avatar.png",
      rating: 4.8,
      students: 9800,
      courses: 12,
      specialties: ["React", "Node.js", "AWS"],
      bio: "Senior engineer at Microsoft, passionate about teaching modern web development.",
    },
    {
      name: "Elena Rodriguez",
      title: "UX Design Lead",
      image: "/professional-woman-professor.png",
      rating: 4.9,
      students: 7600,
      courses: 6,
      specialties: ["UI/UX Design", "Figma", "Design Systems"],
      bio: "Design lead at Airbnb, helping students create beautiful and functional user experiences.",
    },
    {
      name: "David Kim",
      title: "Digital Marketing Strategist",
      image: "/professional-man-product.png",
      rating: 4.7,
      students: 11200,
      courses: 10,
      specialties: ["SEO", "Social Media", "Analytics"],
      bio: "Marketing director with expertise in growth hacking and digital strategy.",
    },
  ]

  const stats = [
    { number: "500+", label: "Expert Instructors" },
    { number: "50+", label: "Countries" },
    { number: "4.8", label: "Average Rating" },
    { number: "95%", label: "Student Satisfaction" },
  ]

  return (
    <div className="min-h-screen">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy to-blue-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-sans mb-6">
            World-Class
            <span className="block text-gold">Instructors</span>
          </h1>
          <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-gray-200 leading-relaxed mb-8">
            Learn from industry experts, thought leaders, and practitioners who are passionate about sharing their
            knowledge.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-gold mb-2">{stat.number}</div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Instructors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Featured Instructors</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet some of our top-rated instructors who are transforming careers and inspiring learners worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredInstructors.map((instructor, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <img
                    src={instructor.image || "/placeholder.svg"}
                    alt={instructor.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-navy mb-2 font-sans">{instructor.name}</h3>
                  <p className="text-gold font-medium mb-4">{instructor.title}</p>

                  <div className="flex items-center justify-center mb-4">
                    <Star className="h-4 w-4 text-gold fill-current mr-1" />
                    <span className="text-sm font-medium">{instructor.rating}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center justify-center">
                      <Users className="h-4 w-4 mr-1" />
                      {instructor.students.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {instructor.courses} courses
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {instructor.specialties.slice(0, 2).map((specialty, specIndex) => (
                      <Badge key={specIndex} variant="secondary" className="text-xs bg-gold/10 text-gold">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{instructor.bio}</p>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-gold text-gold hover:bg-gold hover:text-navy bg-transparent"
                  >
                    <Link href={`/instructors/${instructor.name.toLowerCase().replace(/\s+/g, "-")}`}>
                      View Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Become an Instructor CTA */}
      <section className="py-20 bg-gradient-to-r from-navy to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="h-16 w-16 text-gold mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-sans">Become an Instructor</h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Share your expertise with learners worldwide. Join our community of passionate educators and make a
            meaningful impact.
          </p>
          <div className="space-y-4">
            <Button size="lg" asChild className="bg-gold hover:bg-gold/90 text-navy font-semibold text-lg px-8 py-4">
              <Link href="/auth/instructor-application">
                Apply to Teach
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-gray-300 text-sm">Earn up to 70% revenue share • Flexible schedule • Global reach</p>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
