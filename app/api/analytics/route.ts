import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = Number.parseInt(searchParams.get("timeRange") || "30")

    const client = await clientPromise
    const db = client.db("project_management")

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - timeRange)

    // Get all tasks
    const tasks = await db.collection("tasks").find({}).toArray()
    const projects = await db.collection("projects").find({}).toArray()
    const users = await db.collection("users").find({}).toArray()

    // Task status distribution
    const tasksByStatus = [
      { name: "To Do", value: tasks.filter((t) => t.status === "todo").length, color: "#FF8042" },
      { name: "In Progress", value: tasks.filter((t) => t.status === "in-progress").length, color: "#FFBB28" },
      { name: "Done", value: tasks.filter((t) => t.status === "done").length, color: "#00C49F" },
    ]

    // Task priority distribution
    const tasksByPriority = [
      { name: "Low", value: tasks.filter((t) => t.priority === "low").length },
      { name: "Medium", value: tasks.filter((t) => t.priority === "medium").length },
      { name: "High", value: tasks.filter((t) => t.priority === "high").length },
    ]

    // Tasks by project
    const tasksByProject = projects.map((project) => {
      const projectTasks = tasks.filter((t) => t.projectId === project._id.toString())
      return {
        name: project.name,
        total: projectTasks.length,
        completed: projectTasks.filter((t) => t.status === "done").length,
        inProgress: projectTasks.filter((t) => t.status === "in-progress").length,
        todo: projectTasks.filter((t) => t.status === "todo").length,
      }
    })

    // User productivity
    const userProductivity = users.map((user) => {
      const userTasks = tasks.filter((t) => t.assignedTo === user.uid)
      return {
        name: user.name,
        assigned: userTasks.length,
        completed: userTasks.filter((t) => t.status === "done").length,
      }
    })

    // Productivity trend (simplified - last 7 days)
    const productivityTrend = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const dayTasks = tasks.filter((t) => {
        const taskDate = new Date(t.createdAt).toISOString().split("T")[0]
        return taskDate === dateStr
      })

      const completedTasks = tasks.filter((t) => {
        const taskDate = new Date(t.updatedAt).toISOString().split("T")[0]
        return taskDate === dateStr && t.status === "done"
      })

      productivityTrend.push({
        date: date.toLocaleDateString(),
        created: dayTasks.length,
        completed: completedTasks.length,
      })
    }

    // Overall stats
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((t) => t.status === "done").length
    const overdueTasks = tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done",
    ).length
    const activeUsers = users.length
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    const avgTasksPerUser = activeUsers > 0 ? totalTasks / activeUsers : 0

    const overallStats = {
      totalTasks,
      completedTasks,
      overdueTasks,
      activeUsers,
      completionRate,
      avgTasksPerUser,
    }

    return NextResponse.json({
      tasksByStatus,
      tasksByPriority,
      tasksByProject,
      userProductivity,
      productivityTrend,
      overallStats,
    })
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}
