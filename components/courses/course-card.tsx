import Image from "next/image"
import Link from "next/link"
import { Star, Clock, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    thumbnail_url: string
    price: number
    difficulty_level: string
    category: string
    instructor_name: string
    instructor_avatar: string
    enrollment_count: number
    average_rating: number
    review_count: number
    duration: number
  }
}

export function CourseCard({ course }: CourseCardProps) {
  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `$${price}`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={course.thumbnail_url || `/placeholder.svg?height=200&width=350&query=course-${course.category}`}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-navy-900">
            {course.category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge
            variant={
              course.difficulty_level === "beginner"
                ? "default"
                : course.difficulty_level === "intermediate"
                  ? "secondary"
                  : "destructive"
            }
            className="bg-white/90"
          >
            {course.difficulty_level}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">
              {course.average_rating ? course.average_rating.toFixed(1) : "New"}
            </span>
            <span className="text-sm text-muted-foreground">({course.review_count})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm">{course.enrollment_count}</span>
          </div>
        </div>

        <Link href={`/courses/${course.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-navy-600 transition-colors">
            {course.title}
          </h3>
        </Link>

        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{course.description}</p>

        <div className="flex items-center gap-2 mb-3">
          <Image
            src={course.instructor_avatar || `/placeholder.svg?height=24&width=24&query=instructor`}
            alt={course.instructor_name}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm text-muted-foreground">{course.instructor_name}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{formatDuration(course.duration)}</span>
          </div>
          <div className="text-lg font-bold text-navy-900">{formatPrice(course.price)}</div>
        </div>
      </CardContent>
    </Card>
  )
}
