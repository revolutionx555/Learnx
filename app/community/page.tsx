import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, MessageSquare, Heart, Globe, ArrowRight, ExternalLink } from "lucide-react"

export default function CommunityPage() {
  const communities = [
    {
      platform: "Discord",
      title: "Learn X Discord Server",
      description: "Join real-time discussions, get help from peers, and connect with instructors.",
      members: "5,000+",
      link: "https://discord.gg/learnx",
      icon: MessageSquare,
    },
    {
      platform: "Facebook",
      title: "Learn X Community",
      description: "Share your learning journey, celebrate achievements, and network with professionals.",
      members: "12,000+",
      link: "https://facebook.com/groups/learnx",
      icon: Users,
    },
    {
      platform: "LinkedIn",
      title: "Learn X Professionals",
      description: "Connect with fellow learners in your industry and share career opportunities.",
      members: "8,000+",
      link: "https://linkedin.com/groups/learnx",
      icon: Globe,
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
            <span className="block text-gold">Community</span>
          </h1>
          <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-gray-200 leading-relaxed mb-8">
            Connect with thousands of learners worldwide. Share knowledge, get support, and grow together.
          </p>
        </div>
      </section>

      {/* Community Platforms */}
      <section className="py-20 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Where to Find Us</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our vibrant communities across different platforms and connect with learners who share your
              interests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {communities.map((community, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="p-4 bg-gold/10 rounded-2xl inline-block mb-4">
                    <community.icon className="h-10 w-10 text-gold" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-navy font-sans">{community.title}</CardTitle>
                  <p className="text-gold font-medium">{community.members} members</p>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6 leading-relaxed">{community.description}</p>
                  <Button asChild className="w-full bg-navy hover:bg-navy/90 text-white font-semibold">
                    <Link href={community.link} target="_blank" rel="noopener noreferrer">
                      Join {community.platform}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Community Guidelines</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-navy mb-3">Be Respectful</h3>
                  <p className="text-gray-700">
                    Treat all community members with respect and kindness. We welcome learners from all backgrounds and
                    experience levels.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-navy mb-3">Stay On Topic</h3>
                  <p className="text-gray-700">
                    Keep discussions relevant to learning, courses, and professional development. Off-topic
                    conversations should be moved to appropriate channels.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-navy mb-3">Help Others</h3>
                  <p className="text-gray-700">
                    Share your knowledge and help fellow learners. Answer questions when you can and provide
                    constructive feedback.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-navy mb-3">No Spam or Self-Promotion</h3>
                  <p className="text-gray-700">
                    Avoid excessive self-promotion or spam. Share resources that benefit the community, not just your
                    own interests.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-16 w-16 text-gold mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-sans">Ready to Connect?</h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Join thousands of learners who are building their skills and advancing their careers together.
          </p>
          <Button size="lg" asChild className="bg-gold hover:bg-gold/90 text-navy font-semibold text-lg px-8 py-4">
            <Link href="/auth/student-signup">
              Join Learn X Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
