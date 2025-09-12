import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Download, Smartphone, Wifi, Bell, BookOpen, Play, ArrowRight } from "lucide-react"

export default function MobileAppPage() {
  const features = [
    {
      icon: Wifi,
      title: "Offline Learning",
      description: "Download courses and learn anywhere, even without internet connection.",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Stay on track with personalized reminders and progress updates.",
    },
    {
      icon: Play,
      title: "Seamless Playback",
      description: "Pick up exactly where you left off across all your devices.",
    },
    {
      icon: BookOpen,
      title: "Mobile-Optimized Content",
      description: "Content designed specifically for mobile learning experiences.",
    },
  ]

  return (
    <div className="min-h-screen">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-sans mb-6">
                Learn Anywhere
                <span className="block text-gold">Anytime</span>
              </h1>
              <div className="w-24 h-1 bg-gold rounded-full mb-8"></div>
              <p className="text-xl text-gray-200 leading-relaxed mb-8">
                Take your learning on the go with the Learn X mobile app. Download courses, track progress, and never
                miss a lesson.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-gold hover:bg-gold/90 text-navy font-semibold">
                  <Link href="#" className="flex items-center">
                    <Download className="mr-2 h-5 w-5" />
                    Download for iOS
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-gold text-gold hover:bg-gold hover:text-navy bg-transparent"
                >
                  <Link href="#" className="flex items-center">
                    <Download className="mr-2 h-5 w-5" />
                    Download for Android
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/professional-learning-dashboard.png"
                alt="Learn X Mobile App"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Mobile Learning Features</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you love about Learn X, optimized for your mobile device.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-8">
                  <div className="p-4 bg-gold/10 rounded-2xl inline-block mb-6">
                    <feature.icon className="h-10 w-10 text-gold" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-4 font-sans">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Smartphone className="h-16 w-16 text-gold mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-sans">Coming Soon</h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Our mobile app is currently in development. Sign up to be notified when it's available!
          </p>
          <Button size="lg" asChild className="bg-gold hover:bg-gold/90 text-navy font-semibold text-lg px-8 py-4">
            <Link href="/auth/student-signup">
              Get Notified
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
