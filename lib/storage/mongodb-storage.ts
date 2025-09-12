import { GridFSBucket } from "mongodb"
import { connectToDatabase } from "@/lib/database/mongodb"

export interface UploadResult {
  url: string
  path: string
  error?: string
}

export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Buffer,
  options?: {
    contentType?: string
    cacheControl?: string
    upsert?: boolean
  },
): Promise<UploadResult> {
  try {
    const { db } = await connectToDatabase()
    const gridFSBucket = new GridFSBucket(db, { bucketName: bucket })

    const uploadStream = gridFSBucket.openUploadStream(path, {
      metadata: {
        contentType: options?.contentType,
        cacheControl: options?.cacheControl || "3600",
        originalName: path,
      },
    })

    const fileBuffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file

    return new Promise((resolve, reject) => {
      uploadStream.end(fileBuffer, (error) => {
        if (error) {
          resolve({ url: "", path: "", error: error.message })
        } else {
          const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/files/${bucket}/${uploadStream.id}`
          resolve({ url, path })
        }
      })
    })
  } catch (error) {
    console.error("Upload error:", error)
    return { url: "", path: "", error: "Upload failed" }
  }
}

export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    const gridFSBucket = new GridFSBucket(db, { bucketName: bucket })

    const files = await gridFSBucket.find({ filename: path }).toArray()
    if (files.length > 0) {
      await gridFSBucket.delete(files[0]._id)
      return true
    }
    return false
  } catch (error) {
    console.error("Delete error:", error)
    return false
  }
}

export async function getFileUrl(bucket: string, path: string): Promise<string> {
  return `${process.env.NEXT_PUBLIC_APP_URL}/api/files/${bucket}/${path}`
}

export async function uploadCourseVideo(file: File, courseId: string, lessonId: string): Promise<UploadResult> {
  const fileExtension = file.name.split(".").pop()
  const fileName = `${lessonId}.${fileExtension}`
  const path = `courses/${courseId}/videos/${fileName}`

  return uploadFile("course-videos", path, file, {
    contentType: file.type,
    cacheControl: "86400",
  })
}

export async function uploadCourseImage(file: File, courseId: string): Promise<UploadResult> {
  const fileExtension = file.name.split(".").pop()
  const fileName = `thumbnail.${fileExtension}`
  const path = `courses/${courseId}/images/${fileName}`

  return uploadFile("course-images", path, file, {
    contentType: file.type,
    cacheControl: "86400",
  })
}

export async function uploadInstructorDocument(
  file: File,
  instructorId: string,
  documentType: "cv" | "certificate" | "portfolio",
): Promise<{ url?: string; error?: string }> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${instructorId}/${documentType}-${Date.now()}.${fileExt}`

    const result = await uploadFile("instructor-documents", fileName, file, {
      contentType: file.type,
      cacheControl: "3600",
    })

    if (result.error) {
      return { error: result.error }
    }

    return { url: result.url }
  } catch (error) {
    console.error("Upload error:", error)
    return { error: "Failed to upload document" }
  }
}

export async function uploadInstructorCV(file: File, applicationId: string): Promise<UploadResult> {
  const fileExtension = file.name.split(".").pop()
  const fileName = `cv.${fileExtension}`
  const path = `instructor-applications/${applicationId}/${fileName}`

  return uploadFile("instructor-documents", path, file, {
    contentType: file.type,
    cacheControl: "3600", // 1 hour
  })
}
