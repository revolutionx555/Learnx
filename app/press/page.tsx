import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, ImageIcon, FileText, Users } from "lucide-react"

export default function PressKitPage() {
  const assets = [
    {
      type: "Logo",
      items: [
        { name: "Learn X Logo (PNG)", size: "High Resolution", format: "PNG" },
        { name: "Learn X Logo (SVG)", size: "Vector", format: "SVG" },
        { name: "Learn X Logo (White)", size: "High Resolution", format: "PNG" },
      ],
    },
    {
      type: "Brand Colors",
      items: [
        { name: "Primary Navy", size: "#1e3a8a", format: "HEX" },
        { name: "Gold Accent", size: "#f59e0b", format: "HEX" },
        { name: "Warm Gray", size: "#f9fafb", format: "HEX" },
      ],
    },
    {
      type: "Screenshots",
      items: [
        { name: "Dashboard Screenshot", size: "1920x1080", format: "PNG" },
        { name: "Course Page Screenshot", size: "1920x1080", format: "PNG" },
        { name: "Mobile App Screenshot", size: "375x812", format: "PNG" },
      ],
    },
  ]

  const facts = [
    { label: "Founded", value: "2025" },
    { label: "Headquarters", value: "Abuja, Nigeria" },
    { label: "Active Learners", value: "10,000+" },
    { label: "Expert Instructors", value: "500+" },
    { label: "Course Completion Rate", value: "87%" },
    { label: "Countries Served", value: "25+" },
  ]

  return (
    <div className="min-h-screen">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy to-blue-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-sans mb-6">
            Press
            <span className="block text-gold">Kit</span>
          </h1>
          <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-gray-200 leading-relaxed mb-8">
            Download our brand assets, company information, and media resources.
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-6 font-sans">About Learn X</h2>
              <div className="w-24 h-1 bg-gold rounded-full mb-8"></div>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  Learn X is a cutting-edge learning management system that democratizes access to high-quality
                  education worldwide. Founded in 2025, we're transforming how people learn and grow professionally.
                </p>
                <p>
                  Our platform combines innovative technology with expert instruction to deliver personalized learning
                  experiences that drive real career outcomes for students and professionals globally.
                </p>
                <p>
                  With features like AI-powered learning paths, blockchain certificates, and mobile-first design, Learn
                  X is setting the standard for modern online education.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/professional-learning-dashboard.png"
                alt="Learn X Platform"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Company Facts */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Company Facts</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {facts.map((fact, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gold mb-2">{fact.value}</div>
                <div className="text-gray-600">{fact.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Assets */}
      <section className="py-20 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Brand Assets</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Download our official brand assets for media coverage and partnerships.
            </p>
          </div>

          <div className="space-y-12">
            {assets.map((category, index) => (
              <div key={index}>
                <h3 className="text-2xl font-bold text-navy mb-6 font-sans">{category.type}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item, itemIndex) => (
                    <Card key={itemIndex} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-gold/10 rounded-xl">
                            {category.type === "Logo" && <ImageIcon className="h-6 w-6 text-gold" />}
                            {category.type === "Brand Colors" && <div className="h-6 w-6 rounded-full bg-gold" />}
                            {category.type === "Screenshots" && <FileText className="h-6 w-6 text-gold" />}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gold text-gold hover:bg-gold hover:text-navy bg-transparent"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                        <h4 className="font-semibold text-navy mb-2">{item.name}</h4>
                        <div className="text-sm text-gray-600">
                          <div>{item.size}</div>
                          <div>{item.format}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact for Press */}
      <section className="py-20 bg-gradient-to-r from-navy to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="h-16 w-16 text-gold mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-sans">Media Inquiries</h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            For press inquiries, interviews, or additional information, please contact our media team.
          </p>
          <div className="space-y-4">
            <p className="text-lg">
              <strong>Press Contact:</strong> press@learnx.com
            </p>
            <p className="text-lg">
              <strong>Phone:</strong> +234 (916) 667-5912
            </p>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
