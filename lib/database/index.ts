// Main database module exports
export * from "./connection"
export * from "./queries"

// Database initialization
export async function initializeDatabase() {
  const { getPool } = await import("./connection")

  try {
    const pool = getPool()
    await pool.query("SELECT NOW()")
    console.log("✅ Database connected successfully")
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}

// Health check
export async function checkDatabaseHealth() {
  try {
    const { query } = await import("./connection")
    const result = await query("SELECT COUNT(*) as user_count FROM users")
    return {
      status: "healthy",
      userCount: result[0]?.user_count || 0,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    }
  }
}
