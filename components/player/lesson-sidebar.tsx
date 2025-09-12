"use client"

import { useState } from "react"
import { Check, Play, Lock, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface Lesson {
  id: string
  title: string
  description: string
  duration: number
  video_url: string
  is_free: boolean
  completed?: boolean
}

interface LessonSidebarProps {
  lessons: Lesson[]
  currentLessonId: string
  onLessonSelect: (lesson: Lesson) => void
  progress: Record<string, { completed: boolean; watch_time: number }>
}

export function LessonSidebar({ lessons, currentLessonId, onLessonSelect, progress }: LessonSidebarProps) {
  const [isOpen, setIsOpen] = useState(true)

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const completedLessons = lessons.filter((lesson) => progress[lesson.id]?.completed).length
  const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Course Content</CardTitle>
          <span className="text-sm text-muted-foreground">
            {completedLessons}/{lessons.length} lessons
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </CardHeader>

      <CardContent className="p-0">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-4 h-auto">
              <span className="font-medium">Lessons ({lessons.length})</span>
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="space-y-1">
              {lessons.map((lesson, index) => {
                const isCompleted = progress[lesson.id]?.completed
                const isCurrent = lesson.id === currentLessonId
                const isLocked =
                  !lesson.is_free && !isCompleted && index > 0 && !progress[lessons[index - 1]?.id]?.completed

                return (
                  <Button
                    key={lesson.id}
                    variant={isCurrent ? "secondary" : "ghost"}
                    className={`w-full justify-start p-4 h-auto text-left ${
                      isCurrent ? "bg-navy-50 border-l-4 border-l-navy-600" : ""
                    }`}
                    onClick={() => !isLocked && onLessonSelect(lesson)}
                    disabled={isLocked}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 mt-1">
                        {isLocked ? (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : isCompleted ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : isCurrent ? (
                          <Play className="h-4 w-4 text-navy-600" />
                        ) : (
                          <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm mb-1 ${isCurrent ? "text-navy-900" : ""}`}>
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{lesson.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{formatDuration(lesson.duration)}</span>
                          {lesson.is_free && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Free</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
