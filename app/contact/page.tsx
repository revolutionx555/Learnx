// Contact page with form and company information
import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, MessageSquare, Users, Briefcase } from "lucide-react"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "wearetribex@proton.me",
      description: "Send us an email and we'll respond within 24 hours",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+234 (916) 667-5912",
      description: "Monday to Friday, 9 AM to 6 PM PST",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "Abuja, Nigeria",
      description: "Our headquarters in Abuja, Nigeria",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon-Fri: 9 AM - 6 PM PST",
      description: "We're here to help during business hours",
    },
  ]

  const departments = [
    {
      icon: MessageSquare,
      title: "General Inquiries",
      description: "Questions about our platform, courses, or getting started",
    },
    {
      icon: Users,
      title: "Student Support",
      description: "Help with courses, technical issues, or account problems",
    },
    {
      icon: Briefcase,
      title: "Enterprise Sales",
      description: "Custom solutions for teams and organizations",
    },
  ]

  return (
    <div className="min-h-screen">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy to-blue-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-sans mb-6">
            Get in
            <span className="block text-gold">Touch</span>
          </h1>
          <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-gray-200 leading-relaxed mb-8">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-navy font-sans">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input id="company" placeholder="Your company name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="What can we help you with?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="sales">Enterprise Sales</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="press">Press & Media</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Tell us more about your inquiry..." className="min-h-[120px]" />
                  </div>

                  <Button className="w-full bg-navy hover:bg-navy/90 text-white font-semibold" size="lg">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-navy mb-6 font-sans">Contact Information</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="p-3 bg-gold/10 rounded-xl">
                        <info.icon className="h-6 w-6 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy mb-1">{info.title}</h3>
                        <p className="text-navy font-medium mb-1">{info.details}</p>
                        <p className="text-gray-600 text-sm">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-navy mb-4 font-sans">How Can We Help?</h3>
                <div className="space-y-4">
                  {departments.map((dept, index) => (
                    <Card key={index} className="border border-gold/20 hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <dept.icon className="h-5 w-5 text-gold mt-1" />
                          <div>
                            <h4 className="font-semibold text-navy mb-1">{dept.title}</h4>
                            <p className="text-gray-600 text-sm">{dept.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 font-sans">Quick Answers</h2>
            <div className="w-24 h-1 bg-gold rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">Common questions we receive from our community</p>
          </div>

          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-navy mb-3">How quickly will I receive a response?</h3>
              <p className="text-gray-600">
                We typically respond to all inquiries within 24 hours during business days. For urgent technical
                support, Pro and Enterprise users can access our priority support channels.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-navy mb-3">Do you offer phone support?</h3>
              <p className="text-gray-600">
                Yes! Phone support is available for Pro and Enterprise customers during business hours (9 AM - 6 PM PST,
                Monday-Friday). Free users can reach us via email or our community forums.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-navy mb-3">Can I schedule a demo?</h3>
              <p className="text-gray-600">
                We offer personalized demos for teams and organizations interested in our Enterprise solutions. Select
                "Enterprise Sales" in the form above to get started.
              </p>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
