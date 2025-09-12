import { DiscussionForum } from "@/components/discussions/discussion-forum"
import { ProtectedRoute } from "@/components/auth/protected-route"

interface CourseDiscussionsPageProps {
  params: { id: string }
}

export default function CourseDiscussionsPage({ params }: CourseDiscussionsPageProps) {
  return (
    <ProtectedRoute allowedRoles={["student", "instructor"]}>
      <div className="max-w-4xl mx-auto p-6">
        <DiscussionForum courseId={params.id} />
      </div>
    </ProtectedRoute>
  )
}
