import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const quizId = params.id

    // Get quiz details
    const quiz = await db.query("SELECT * FROM quizzes WHERE id = $1", [quizId])

    if (quiz.rows.length === 0) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Get questions with options
    const questions = await db.query(
      `SELECT qq.*, 
       COALESCE(
         json_agg(
           json_build_object(
             'id', qao.id,
             'text', qao.option_text,
             'isCorrect', qao.is_correct,
             'orderIndex', qao.order_index
           ) ORDER BY qao.order_index
         ) FILTER (WHERE qao.id IS NOT NULL), 
         '[]'
       ) as options
       FROM quiz_questions qq
       LEFT JOIN quiz_answer_options qao ON qq.id = qao.question_id
       WHERE qq.quiz_id = $1
       GROUP BY qq.id
       ORDER BY qq.order_index`,
      [quizId],
    )

    return NextResponse.json({
      ...quiz.rows[0],
      questions: questions.rows,
    })
  } catch (error) {
    console.error("Error fetching quiz:", error)
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 })
  }
}
