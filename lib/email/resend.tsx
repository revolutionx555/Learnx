import { Resend } from "resend"
import { emailConfig } from "@/lib/config/environment"

const resend = new Resend(emailConfig.apiKey)

export interface EmailTemplate {
  to: string
  subject: string
  html: string
  text?: string
}

export interface WelcomeEmailData {
  firstName: string
  verificationUrl: string
}

export interface InstructorApplicationEmailData {
  firstName: string
  lastName: string
  applicationId: string
}

export interface CourseEnrollmentEmailData {
  firstName: string
  courseName: string
  courseUrl: string
  instructorName: string
}

export interface PasswordResetEmailData {
  firstName: string
  resetUrl: string
}

export const emailTemplates = {
  welcome: (data: WelcomeEmailData): EmailTemplate => ({
    to: "",
    subject: `Welcome to ${emailConfig.fromName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to Learn X!</h1>
        <p>Hi ${data.firstName},</p>
        <p>Thank you for joining Learn X! We're excited to have you as part of our learning community.</p>
        <p>To get started, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationUrl}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">${data.verificationUrl}</p>
        <p>Best regards,<br>The Learn X Team</p>
      </div>
    `,
    text: `Welcome to Learn X! Please verify your email: ${data.verificationUrl}`,
  }),

  instructorApplication: (data: InstructorApplicationEmailData): EmailTemplate => ({
    to: "",
    subject: "Instructor Application Received",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Application Received!</h1>
        <p>Hi ${data.firstName} ${data.lastName},</p>
        <p>Thank you for applying to become an instructor on Learn X!</p>
        <p>We've received your application (ID: ${data.applicationId}) and our team will review it within 2-3 business days.</p>
        <p>What happens next:</p>
        <ul>
          <li>Our team will review your qualifications and experience</li>
          <li>We may reach out for additional information if needed</li>
          <li>You'll receive an email with our decision</li>
          <li>If approved, you'll get access to create and publish courses</li>
        </ul>
        <p>We appreciate your interest in sharing your knowledge with our community!</p>
        <p>Best regards,<br>The Learn X Team</p>
      </div>
    `,
    text: `Your instructor application has been received. Application ID: ${data.applicationId}. We'll review it within 2-3 business days.`,
  }),

  courseEnrollment: (data: CourseEnrollmentEmailData): EmailTemplate => ({
    to: "",
    subject: `You're enrolled in ${data.courseName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Course Enrollment Confirmed!</h1>
        <p>Hi ${data.firstName},</p>
        <p>Congratulations! You've successfully enrolled in <strong>${data.courseName}</strong> by ${data.instructorName}.</p>
        <p>You can start learning right away by accessing your course:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.courseUrl}" 
             style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Start Learning
          </a>
        </div>
        <p>Your course includes:</p>
        <ul>
          <li>Lifetime access to course materials</li>
          <li>Progress tracking and certificates</li>
          <li>Direct access to instructor support</li>
          <li>Mobile-friendly learning experience</li>
        </ul>
        <p>Happy learning!</p>
        <p>Best regards,<br>The Learn X Team</p>
      </div>
    `,
    text: `You're enrolled in ${data.courseName}! Start learning: ${data.courseUrl}`,
  }),

  passwordReset: (data: PasswordResetEmailData): EmailTemplate => ({
    to: "",
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Reset Your Password</h1>
        <p>Hi ${data.firstName},</p>
        <p>We received a request to reset your password for your Learn X account.</p>
        <p>Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetUrl}" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>The Learn X Team</p>
      </div>
    `,
    text: `Reset your password: ${data.resetUrl}`,
  }),
}

export async function sendEmail(template: EmailTemplate) {
  try {
    if (!emailConfig.apiKey) {
      console.warn("Resend API key not configured, email not sent")
      return { success: false, error: "Email service not configured" }
    }

    const result = await resend.emails.send({
      from: `${emailConfig.fromName} <${emailConfig.fromEmail}>`,
      to: template.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error("Email sending failed:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function sendWelcomeEmail(to: string, data: WelcomeEmailData) {
  const template = emailTemplates.welcome(data)
  template.to = to
  return sendEmail(template)
}

export async function sendInstructorApplicationEmail(to: string, data: InstructorApplicationEmailData) {
  const template = emailTemplates.instructorApplication(data)
  template.to = to
  return sendEmail(template)
}

export async function sendCourseEnrollmentEmail(to: string, data: CourseEnrollmentEmailData) {
  const template = emailTemplates.courseEnrollment(data)
  template.to = to
  return sendEmail(template)
}

export async function sendPasswordResetEmail(to: string, data: PasswordResetEmailData) {
  const template = emailTemplates.passwordReset(data)
  template.to = to
  return sendEmail(template)
}

export async function sendAdminNotification(subject: string, message: string) {
  const adminEmail = "admin@learnx.com" // Configure this in environment

  const template: EmailTemplate = {
    to: adminEmail,
    subject: `[Learn X Admin] ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">Admin Notification</h1>
        <p>${message}</p>
        <p>Time: ${new Date().toISOString()}</p>
      </div>
    `,
    text: message,
  }

  return sendEmail(template)
}
