"use client"

import { useState, useEffect } from "react"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

interface Question {
  id: string
  question_text: string
  question_type: string
  points: number
  options: Array<{ id: string; text: string; isCorrect: boolean }>
}

interface Quiz {
  id: string
  title: string
  description: string
  time_limit: number
  passing_score: number
  questions: Question[]
}

interface QuizTakerProps {
  quiz: Quiz
  onSubmit: (answers: Record<string, any>, timeSpent: number) => void
}

export function QuizTaker({ quiz, onSubmit }: QuizTakerProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(quiz.time_limit * 60) // Convert to seconds
  const [startTime] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handleSubmit = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    onSubmit(answers, timeSpent)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100
  const answeredQuestions = Object.keys(answers).length

  if (quiz.questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No questions available for this quiz.</p>
        </CardContent>
      </Card>
    )
  }

  const question = quiz.questions[currentQuestion]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{quiz.title}</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4" />
                <span>
                  {answeredQuestions}/{quiz.questions.length} answered
                </span>
              </div>
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="h-4 w-4" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </CardTitle>
          <p className="text-muted-foreground">
            {question.points} point{question.points !== 1 ? "s" : ""}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg leading-relaxed">{question.question_text}</p>

          {question.question_type === "multiple_choice" && (
            <RadioGroup
              value={answers[question.id]?.toString() || ""}
              onValueChange={(value) => handleAnswerChange(question.id, Number.parseInt(value))}
            >
              {question.options.map((option, index) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.question_type === "true_false" && (
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="True" id="true" />
                <Label htmlFor="true" className="cursor-pointer">
                  True
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="False" id="false" />
                <Label htmlFor="false" className="cursor-pointer">
                  False
                </Label>
              </div>
            </RadioGroup>
          )}

          {question.question_type === "short_answer" && (
            <Textarea
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Enter your answer here..."
              rows={4}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {quiz.questions.map((_, index) => (
            <Button
              key={index}
              variant={
                index === currentQuestion ? "default" : answers[quiz.questions[index].id] ? "secondary" : "outline"
              }
              size="sm"
              onClick={() => setCurrentQuestion(index)}
              className="w-10 h-10"
            >
              {index + 1}
            </Button>
          ))}
        </div>

        {currentQuestion === quiz.questions.length - 1 ? (
          <Button onClick={handleSubmit} className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}>
            Next
          </Button>
        )}
      </div>

      {/* Warning for unanswered questions */}
      {answeredQuestions < quiz.questions.length && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                You have {quiz.questions.length - answeredQuestions} unanswered question
                {quiz.questions.length - answeredQuestions !== 1 ? "s" : ""}.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
