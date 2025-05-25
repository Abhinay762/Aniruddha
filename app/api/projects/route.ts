import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Project } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, status, createdBy, endDate } = body

    const client = await clientPromise
    const db = client.db("project_management")

    const project: Omit<Project, "_id"> = {
      name,
      description,
      status,
      createdBy,
      assignedUsers: [createdBy],
      startDate: new Date(),
      endDate: endDate ? new Date(endDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("projects").insertOne(project)

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("project_management")

    const projects = await db.collection("projects").find({}).sort({ createdAt: -1 }).toArray()

    // Get stats for each project
    const projectStats: Record<string, any> = {}

    for (const project of projects) {
      const tasks = await db.collection("tasks").find({ projectId: project._id.toString() }).toArray()

      const totalTasks = tasks.length
      const completedTasks = tasks.filter((task) => task.status === "done").length
      const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length
      const todoTasks = tasks.filter((task) => task.status === "todo").length
      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

      projectStats[project._id.toString()] = {
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        completionRate,
      }
    }

    return NextResponse.json({ projects, stats: projectStats })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}
