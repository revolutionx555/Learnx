import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { verifyToken } from "@/lib/auth/jwt"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { quizId, answers, timeSpent } = await request.json()

    // Get quiz and questions
    const quiz = await db.query("SELECT * FROM quizzes WHERE id = $1", [quizId])
    if (quiz.rows.length === 0) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    const questions = await db.query(
      `SELECT qq.*, qao.is_correct, qao.option_text
       FROM quiz_questions qq
       LEFT JOIN quiz_answer_options qao ON qq.id = qao.question_id
       WHERE qq.quiz_id = $1
       ORDER BY qq.order_index, qao.order_index`,
      [quizId],
    )

    // Calculate score
    let totalPoints = 0
    let earnedPoints = 0
    const results = []

    const questionMap = new Map()
    questions.rows.forEach((q) => {
      if (!questionMap.has(q.id)) {
        questionMap.set(q.id, {
          ...q,
          options: [],
        })
        totalPoints += q.points
      }
      if (q.option_text) {
        questionMap.get(q.id).options.push({
          text: q.option_text,
          isCorrect: q.is_correct,
        })
      }
    })

    for (const [questionId, answer] of Object.entries(answers)) {
      const question = questionMap.get(questionId)
      if (!question) continue

      let isCorrect = false
      let correctAnswer = ""

      if (question.question_type === "multiple_choice") {
        const selectedOption = question.options[answer as number]
        const correctOption = question.options.find((opt: any) => opt.isCorrect)
        isCorrect = selectedOption?.isCorrect || false
        correctAnswer = correctOption?.text || ""
      } else if (question.question_type === "true_false") {
        // For true/false, the correct answer should be stored in the first option
        const correctOption = question.options.find((opt: any) => opt.isCorrect)
        isCorrect = answer === correctOption?.text
        correctAnswer = correctOption?.text || ""
      } else if (question.question_type === "short_answer") {
        // For short answer, we'll need manual grading or keyword matching
        // For now, we'll mark as correct if not empty
        isCorrect = (answer as string).trim().length > 0
        correctAnswer = "Manual review required"
      }

      if (isCorrect) {
        earnedPoints += question.points
      }

      results.push({
        questionId,
        userAnswer: answer,
        correctAnswer,
        isCorrect,
        points: isCorrect ? question.points : 0,
      })
    }

    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0
    const passed = score >= quiz.rows[0].passing_score

    // Save submission
    const submission = await db.query(
      `INSERT INTO quiz_submissions (quiz_id, user_id, score, total_points, earned_points, passed, time_spent, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [quizId, payload.userId, score, totalPoints, earnedPoints, passed, timeSpent],
    )

    const submissionId = submission.rows[0].id

    // Save individual answers
    for (const result of results) {
      await db.query(
        `INSERT INTO quiz_answers (submission_id, question_id, user_answer, is_correct, points_earned)
         VALUES ($1, $2, $3, $4, $5)`,
        [submissionId, result.questionId, JSON.stringify(result.userAnswer), result.isCorrect, result.points],
      )
    }

    return NextResponse.json({
      ...submission.rows[0],
      results,
    })
  } catch (error) {
    console.error("Error submitting quiz:", error)
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 })
  }
}
