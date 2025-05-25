import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("project_management")

    // Get total projects
    const totalProjects = await db.collection("projects").countDocuments()

    // Get total tasks
    const totalTasks = await db.collection("tasks").countDocuments()

    // Get completed tasks
    const completedTasks = await db.collection("tasks").countDocuments({ status: "done" })

    // Get in-progress tasks
    const inProgressTasks = await db.collection("tasks").countDocuments({ status: "in-progress" })

    // Get total users
    const totalUsers = await db.collection("users").countDocuments()

    // Get recent projects (last 5)
    const recentProjects = await db.collection("projects").find({}).sort({ createdAt: -1 }).limit(5).toArray()

    // Get recent tasks (last 5)
    const recentTasks = await db.collection("tasks").find({}).sort({ createdAt: -1 }).limit(5).toArray()

    return NextResponse.json({
      totalProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      totalUsers,
      recentProjects,
      recentTasks,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
