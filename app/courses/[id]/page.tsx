"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Star, Clock, Users, Play, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CourseDetail {
  id: string
  title: string
  description: string
  thumbnail_url: string
  price: number
  difficulty_level: string
  category: string
  instructor_name: string
  instructor_email: string
  instructor_avatar: string
  instructor_bio: string
  enrollment_count: number
  average_rating: number
  review_count: number
  lessons: Array<{
    id: string
    title: string
    description: string
    duration: number
    video_url: string
    is_free: boolean
  }>
  reviews: Array<{
    id: string
    rating: number
    comment: string
    created_at: string
    user_name: string
    user_avatar: string
  }>
}

export default function CourseDetailPage() {
  const params = useParams()
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${params.id}`)
        if (!response.ok) throw new Error("Course not found")

        const data = await response.json()
        setCourse(data)
      } catch (error) {
        console.error("Error fetching course:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCourse()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
          <p className="text-muted-foreground">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `$${price}`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const totalDuration = course.lessons.reduce((acc, lesson) => acc + lesson.duration, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-navy-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-gold-500 text-navy-900">
                  {course.category}
                </Badge>
                <Badge variant="outline" className="border-white text-white">
                  {course.difficulty_level}
                </Badge>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-gray-300 mb-6">{course.description}</p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {course.average_rating ? course.average_rating.toFixed(1) : "New"}
                  </span>
                  <span className="text-gray-300">({course.review_count} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-5 w-5" />
                  <span>{course.enrollment_count} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-5 w-5" />
                  <span>{formatDuration(totalDuration)}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={course.instructor_avatar || "/placeholder.svg"} />
                  <AvatarFallback>{course.instructor_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{course.instructor_name}</p>
                  <p className="text-gray-300">Instructor</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={course.thumbnail_url || `/placeholder.svg?height=200&width=350&query=course-preview`}
                      alt={course.title}
                      width={350}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="text-3xl font-bold text-navy-900 mb-4">{formatPrice(course.price)}</div>

                  <Button className="w-full mb-4" size="lg">
                    Enroll Now
                  </Button>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Lessons:</span>
                      <span>{course.lessons.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{formatDuration(totalDuration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Level:</span>
                      <span className="capitalize">{course.difficulty_level}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="curriculum" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum" className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
            <div className="space-y-2">
              {course.lessons.map((lesson, index) => (
                <Card key={lesson.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-navy-100 text-navy-900 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold">{lesson.title}</h3>
                          <p className="text-sm text-muted-foreground">{lesson.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{formatDuration(lesson.duration)}</span>
                        {lesson.is_free ? (
                          <Play className="h-4 w-4 text-green-600" />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="instructor" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={course.instructor_avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">{course.instructor_name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{course.instructor_name}</CardTitle>
                    <p className="text-muted-foreground">{course.instructor_email}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {course.instructor_bio || "No bio available for this instructor."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Student Reviews</h2>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-lg">
                  {course.average_rating ? course.average_rating.toFixed(1) : "No ratings yet"}
                </span>
                <span className="text-muted-foreground">({course.review_count} reviews)</span>
              </div>
            </div>

            <div className="space-y-4">
              {course.reviews.length > 0 ? (
                course.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.user_avatar || "/placeholder.svg"} />
                          <AvatarFallback>{review.user_name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{review.user_name}</span>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No reviews yet. Be the first to review this course!
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
