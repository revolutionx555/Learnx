"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { QuizTaker } from "@/components/quiz/quiz-taker"
import { QuizResults } from "@/components/quiz/quiz-results"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock, Target } from "lucide-react"

export default function QuizPage() {
  const params = useParams()
  const [quiz, setQuiz] = useState<any>(null)
  const [result, setResult] = useState<any>(null)
  const [started, setStarted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuiz()
  }, [params.id])

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quizzes/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setQuiz(data)
      }
    } catch (error) {
      console.error("Error fetching quiz:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (answers: Record<string, any>, timeSpent: number) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/quiz-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quizId: params.id,
          answers,
          timeSpent,
        }),
      })

      if (response.ok) {
        const submissionResult = await response.json()
        setResult(submissionResult)
        setStarted(false)
      }
    } catch (error) {
      console.error("Error submitting quiz:", error)
    }
  }

  const handleRetake = () => {
    setResult(null)
    setStarted(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600"></div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Quiz Not Found</h1>
          <p className="text-muted-foreground">The quiz you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <QuizResults result={result} quiz={quiz} onRetake={handleRetake} />
        </div>
      </div>
    )
  }

  if (started) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <QuizTaker quiz={quiz} onSubmit={handleSubmit} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-navy-900 mb-2">{quiz.title}</h1>
                  <p className="text-muted-foreground text-lg">{quiz.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-navy-100 rounded-full mx-auto mb-2">
                      <Play className="h-6 w-6 text-navy-600" />
                    </div>
                    <div className="text-2xl font-bold text-navy-900">{quiz.questions.length}</div>
                    <div className="text-sm text-muted-foreground">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-navy-100 rounded-full mx-auto mb-2">
                      <Clock className="h-6 w-6 text-navy-600" />
                    </div>
                    <div className="text-2xl font-bold text-navy-900">{quiz.time_limit}</div>
                    <div className="text-sm text-muted-foreground">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-navy-100 rounded-full mx-auto mb-2">
                      <Target className="h-6 w-6 text-navy-600" />
                    </div>
                    <div className="text-2xl font-bold text-navy-900">{quiz.passing_score}%</div>
                    <div className="text-sm text-muted-foreground">To Pass</div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">Instructions</h3>
                  <ul className="text-sm text-yellow-700 space-y-1 text-left">
                    <li>• You have {quiz.time_limit} minutes to complete this quiz</li>
                    <li>• You need {quiz.passing_score}% or higher to pass</li>
                    <li>• You can navigate between questions before submitting</li>
                    <li>• Make sure to answer all questions before time runs out</li>
                  </ul>
                </div>

                <Button size="lg" onClick={() => setStarted(true)} className="w-full md:w-auto">
                  <Play className="h-5 w-5 mr-2" />
                  Start Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
