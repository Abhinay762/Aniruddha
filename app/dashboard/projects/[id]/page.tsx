"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Users, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Project {
  _id: string
  name: string
  description: string
  status: string
  assignedUsers: string[]
  startDate: string
  endDate?: string
  createdAt: string
  updatedAt: string
}

interface ProjectStats {
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  todoTasks: number
  completionRate: number
}

export default function ProjectDetailsPage() {
  const { id } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [stats, setStats] = useState<ProjectStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch("/api/projects")
        const data = await res.json()

        const foundProject = data.projects.find((proj: Project) => proj._id === id)
        const projectStats = data.stats[id]

        setProject(foundProject)
        setStats(projectStats)
      } catch (err) {
        console.error("Failed to fetch project details:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "on-hold":
        return "outline"
      default:
        return "outline"
    }
  }

  if (loading) return <p className="p-4">Loading project details...</p>

  if (!project) return <p className="p-4">Project not found.</p>

  return (
    <div className="max-w-3xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{project.name}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
          <Badge variant={getStatusColor(project.status)} className="mt-2">
            {project.status}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          {stats && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(stats.completionRate)}%</span>
              </div>
              <Progress value={Math.round(stats.completionRate)} className="h-2" />
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <CheckSquare className="mx-auto mb-1 h-5 w-5 text-gray-500" />
              <p className="text-sm font-medium">{stats?.totalTasks || 0}</p>
              <p className="text-xs text-gray-500">Tasks</p>
            </div>
            <div>
              <Users className="mx-auto mb-1 h-5 w-5 text-gray-500" />
              <p className="text-sm font-medium">{project.assignedUsers.length}</p>
              <p className="text-xs text-gray-500">Members</p>
            </div>
            <div>
              <Calendar className="mx-auto mb-1 h-5 w-5 text-gray-500" />
              <p className="text-sm font-medium">
                {project.endDate ? new Date(project.endDate).toLocaleDateString() : "No due date"}
              </p>
              <p className="text-xs text-gray-500">Due Date</p>
            </div>
          </div>

          <Link href="/dashboard/projects">
            <Button variant="outline" className="w-full">Back to Projects</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
