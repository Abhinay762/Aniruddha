import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Task } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, status, priority, projectId, assignedTo, createdBy, dueDate } = body

    const client = await clientPromise
    const db = client.db("project_management")

    const task: Omit<Task, "_id"> = {
      title,
      description,
      status,
      priority,
      projectId,
      assignedTo,
      createdBy,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("tasks").insertOne(task)

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("project_management")

    const tasks = await db.collection("tasks").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}
