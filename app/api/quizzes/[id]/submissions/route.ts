import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"
import { getUserById, getQuizById, createQuizSubmission, getQuizSubmissions } from "@/lib/database/queries"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const user = await getUserById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { answers, timeSpent } = await request.json()
    const quiz = await getQuizById(params.id)
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Calculate score
    let totalPoints = 0
    let earnedPoints = 0

    quiz.questions.forEach((question: any, index: number) => {
      totalPoints += question.points
      const userAnswer = answers[index]

      if (question.type === "multiple_choice") {
        const correctOptions = question.options.filter((opt: any) => opt.isCorrect)
        const userSelectedCorrect = userAnswer?.every((selected: number) => question.options[selected]?.isCorrect)
        const userSelectedIncorrect = userAnswer?.some((selected: number) => !question.options[selected]?.isCorrect)

        if (userSelectedCorrect && !userSelectedIncorrect && userAnswer?.length === correctOptions.length) {
          earnedPoints += question.points
        }
      } else if (question.type === "true_false") {
        const correctAnswer = question.options.find((opt: any) => opt.isCorrect)?.text
        if (userAnswer === correctAnswer) {
          earnedPoints += question.points
        }
      }
      // Short answer questions need manual grading
    })

    const score = Math.round((earnedPoints / totalPoints) * 100)
    const passed = score >= quiz.passingScore

    const submission = await createQuizSubmission({
      quizId: params.id,
      userId: user.id,
      answers,
      score,
      passed,
      timeSpent,
      submittedAt: new Date(),
    })

    return NextResponse.json({
      submissionId: submission.id,
      score,
      passed,
      earnedPoints,
      totalPoints,
    })
  } catch (error) {
    console.error("Error submitting quiz:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const user = await getUserById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const submissions = await getQuizSubmissions(params.id, user.id)
    return NextResponse.json(submissions)
  } catch (error) {
    console.error("Error fetching quiz submissions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
