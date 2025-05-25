import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Comment } from "@/lib/types"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { content, userId, userName } = body

    const client = await clientPromise
    const db = client.db("project_management")

    const comment: Omit<Comment, "_id"> = {
      taskId: params.id,
      userId,
      userName,
      content,
      createdAt: new Date(),
    }

    const result = await db.collection("comments").insertOne(comment)

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("project_management")

    const comments = await db.collection("comments").find({ taskId: params.id }).sort({ createdAt: 1 }).toArray()

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}
