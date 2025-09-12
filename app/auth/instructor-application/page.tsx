import { InstructorApplicationForm } from "@/components/auth/instructor-application-form"
import Link from "next/link"
import Image from "next/image"

export default function InstructorApplicationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Image src="/learn-x-logo.png" alt="Learn X" width={60} height={60} className="mx-auto" />
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Learn X</h1>
          <p className="mt-2 text-sm text-gray-600">Share your knowledge with the world</p>
        </div>

        <InstructorApplicationForm />

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Want to learn instead?{" "}
            <Link href="/auth/student-signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up as a student
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
