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

    const { title, description, lessonId, timeLimit, passingScore, questions } = await request.json()

    // Create quiz
    const quiz = await db.query(
      `INSERT INTO quizzes (title, description, lesson_id, time_limit, passing_score, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [title, description, lessonId, timeLimit, passingScore, payload.userId],
    )

    const quizId = quiz.rows[0].id

    // Create questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      const questionResult = await db.query(
        `INSERT INTO quiz_questions (quiz_id, question_text, question_type, points, order_index)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [quizId, question.text, question.type, question.points, i],
      )

      const questionId = questionResult.rows[0].id

      // Create answer options for multiple choice questions
      if (question.type === "multiple_choice" && question.options) {
        for (let j = 0; j < question.options.length; j++) {
          const option = question.options[j]
          await db.query(
            `INSERT INTO quiz_answer_options (question_id, option_text, is_correct, order_index)
             VALUES ($1, $2, $3, $4)`,
            [questionId, option.text, option.isCorrect, j],
          )
        }
      }
    }

    return NextResponse.json(quiz.rows[0])
  } catch (error) {
    console.error("Error creating quiz:", error)
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get("lessonId")

    if (!lessonId) {
      return NextResponse.json({ error: "Lesson ID required" }, { status: 400 })
    }

    const quizzes = await db.query(
      `SELECT q.*, COUNT(qs.id) as submission_count
       FROM quizzes q
       LEFT JOIN quiz_submissions qs ON q.id = qs.quiz_id
       WHERE q.lesson_id = $1
       GROUP BY q.id
       ORDER BY q.created_at DESC`,
      [lessonId],
    )

    return NextResponse.json(quizzes.rows)
  } catch (error) {
    console.error("Error fetching quizzes:", error)
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 })
  }
}
