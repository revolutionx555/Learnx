// MongoDB Schema Setup for Learn X Platform
// This script defines the collections and indexes for the learning management system

// Collections will be created automatically when first document is inserted
// This file serves as documentation and can be used to set up indexes

const collections = {
  // Users collection (replaces Supabase auth.users)
  users: {
    _id: "ObjectId", // MongoDB auto-generated ID
    email: "string (unique)",
    name: "string",
    role: "string (student|instructor|admin)", // default: student
    avatar_url: "string",
    bio: "string",
    password_hash: "string", // for authentication
    email_verified: "boolean", // default: false
    created_at: "Date",
    updated_at: "Date",
  },

  // Courses collection
  courses: {
    _id: "ObjectId",
    title: "string",
    description: "string",
    instructor_id: "ObjectId (ref: users._id)",
    price: "number", // default: 0
    category: "string",
    difficulty: "string (beginner|intermediate|advanced)", // default: beginner
    duration: "number", // in minutes, default: 0
    thumbnail_url: "string",
    status: "string (draft|published|archived)", // default: draft
    created_at: "Date",
    updated_at: "Date",
  },

  // Lessons collection
  lessons: {
    _id: "ObjectId",
    course_id: "ObjectId (ref: courses._id)",
    title: "string",
    description: "string",
    video_url: "string",
    content: "string",
    duration: "number", // in minutes, default: 0
    order_index: "number",
    is_free: "boolean", // default: false
    created_at: "Date",
    updated_at: "Date",
  },

  // Enrollments collection
  enrollments: {
    _id: "ObjectId",
    user_id: "ObjectId (ref: users._id)",
    course_id: "ObjectId (ref: courses._id)",
    progress: "number", // 0-100, default: 0
    completed_at: "Date",
    created_at: "Date",
    updated_at: "Date",
    // Compound unique index on user_id + course_id
  },

  // Progress collection
  progress: {
    _id: "ObjectId",
    user_id: "ObjectId (ref: users._id)",
    lesson_id: "ObjectId (ref: lessons._id)",
    completed: "boolean", // default: false
    completed_at: "Date",
    created_at: "Date",
    updated_at: "Date",
    // Compound unique index on user_id + lesson_id
  },

  // Certificates collection
  certificates: {
    _id: "ObjectId",
    user_id: "ObjectId (ref: users._id)",
    course_id: "ObjectId (ref: courses._id)",
    certificate_url: "string",
    issued_at: "Date",
    // Compound unique index on user_id + course_id
  },

  // Reviews collection
  reviews: {
    _id: "ObjectId",
    user_id: "ObjectId (ref: users._id)",
    course_id: "ObjectId (ref: courses._id)",
    rating: "number", // 1-5
    comment: "string",
    created_at: "Date",
    updated_at: "Date",
    // Compound unique index on user_id + course_id
  },
}

// MongoDB Indexes to create for optimal performance
const indexes = [
  // Users indexes
  { collection: "users", index: { email: 1 }, options: { unique: true } },
  { collection: "users", index: { role: 1 } },

  // Courses indexes
  { collection: "courses", index: { instructor_id: 1 } },
  { collection: "courses", index: { category: 1 } },
  { collection: "courses", index: { status: 1 } },
  { collection: "courses", index: { created_at: -1 } },

  // Lessons indexes
  { collection: "lessons", index: { course_id: 1 } },
  { collection: "lessons", index: { course_id: 1, order_index: 1 } },

  // Enrollments indexes
  { collection: "enrollments", index: { user_id: 1 } },
  { collection: "enrollments", index: { course_id: 1 } },
  { collection: "enrollments", index: { user_id: 1, course_id: 1 }, options: { unique: true } },

  // Progress indexes
  { collection: "progress", index: { user_id: 1 } },
  { collection: "progress", index: { lesson_id: 1 } },
  { collection: "progress", index: { user_id: 1, lesson_id: 1 }, options: { unique: true } },

  // Certificates indexes
  { collection: "certificates", index: { user_id: 1 } },
  { collection: "certificates", index: { course_id: 1 } },
  { collection: "certificates", index: { user_id: 1, course_id: 1 }, options: { unique: true } },

  // Reviews indexes
  { collection: "reviews", index: { course_id: 1 } },
  { collection: "reviews", index: { user_id: 1, course_id: 1 }, options: { unique: true } },
  { collection: "reviews", index: { rating: 1 } },
]

// Function to create indexes (run this after connecting to MongoDB)
async function createIndexes(db) {
  for (const indexDef of indexes) {
    try {
      await db.collection(indexDef.collection).createIndex(indexDef.index, indexDef.options || {})
      console.log(`Created index for ${indexDef.collection}:`, indexDef.index)
    } catch (error) {
      console.error(`Error creating index for ${indexDef.collection}:`, error)
    }
  }
}

module.exports = { collections, indexes, createIndexes }
