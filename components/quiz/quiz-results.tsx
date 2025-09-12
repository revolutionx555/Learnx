"use client"

import { CheckCircle, XCircle, Clock, Trophy, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface QuizResult {
  id: string
  score: number
  total_points: number
  earned_points: number
  passed: boolean
  time_spent: number
  submitted_at: string
  results: Array<{
    questionId: string
    userAnswer: any
    correctAnswer: string
    isCorrect: boolean
    points: number
  }>
}

interface QuizResultsProps {
  result: QuizResult
  quiz: any
  onRetake?: () => void
}

export function QuizResults({ result, quiz, onRetake }: QuizResultsProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <Card className={`border-2 ${result.passed ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {result.passed ? (
                <Trophy className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
              Quiz {result.passed ? "Passed" : "Failed"}
            </CardTitle>
            <Badge variant={result.passed ? "default" : "destructive"} className="text-lg px-4 py-2">
              {result.score.toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-navy-900">{result.earned_points}</div>
              <div className="text-sm text-muted-foreground">Points Earned</div>
              <div className="text-xs text-muted-foreground">out of {result.total_points}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-navy-900 flex items-center justify-center gap-1">
                <Clock className="h-5 w-5" />
                {formatTime(result.time_spent)}
              </div>
              <div className="text-sm text-muted-foreground">Time Spent</div>
              <div className="text-xs text-muted-foreground">out of {quiz.time_limit} minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-navy-900">{quiz.passing_score}%</div>
              <div className="text-sm text-muted-foreground">Passing Score</div>
              <div className="text-xs text-muted-foreground">Required to pass</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Score</span>
              <span className="text-sm text-muted-foreground">{result.score.toFixed(1)}%</span>
            </div>
            <Progress value={result.score} className="h-3" />
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">Completed on {formatDate(result.submitted_at)}</p>
            {onRetake && !result.passed && (
              <Button onClick={onRetake} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Retake Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question-by-Question Results */}
      <Card>
        <CardHeader>
          <CardTitle>Question Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.results.map((questionResult, index) => {
            const question = quiz.questions.find((q: any) => q.id === questionResult.questionId)
            if (!question) return null

            return (
              <Card key={questionResult.questionId} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {questionResult.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <Badge variant={questionResult.isCorrect ? "default" : "destructive"}>
                        {questionResult.points}/{question.points} points
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{question.question_text}</p>

                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Your Answer: </span>
                        <span className={`text-sm ${questionResult.isCorrect ? "text-green-600" : "text-red-600"}`}>
                          {typeof questionResult.userAnswer === "number"
                            ? question.options[questionResult.userAnswer]?.text || "No answer"
                            : questionResult.userAnswer || "No answer"}
                        </span>
                      </div>
                      {!questionResult.isCorrect && (
                        <div>
                          <span className="text-sm font-medium">Correct Answer: </span>
                          <span className="text-sm text-green-600">{questionResult.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
