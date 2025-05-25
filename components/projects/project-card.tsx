"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Users, Calendar, CheckSquare } from "lucide-react"
import type { Project, ProjectStats } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/providers/auth-provider"
import Link from "next/link"

interface ProjectCardProps {
  project: Project
  stats?: ProjectStats
  onUpdate: () => void
}

export function ProjectCard({ project, stats, onUpdate }: ProjectCardProps) {
  const { user } = useAuth()
  const completionRate = stats ? Math.round(stats.completionRate) : 0

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

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <CardDescription className="line-clamp-2">{project.description}</CardDescription>
          </div>
          {user?.role === "admin" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Project</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Delete Project</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <Badge variant={getStatusColor(project.status)} className="w-fit">
          {project.status}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {stats && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center mb-1">
              <CheckSquare className="h-4 w-4 text-gray-500" />
            </div>
            <p className="text-sm font-medium">{stats?.totalTasks || 0}</p>
            <p className="text-xs text-gray-500">Tasks</p>
          </div>
          <div>
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-gray-500" />
            </div>
            <p className="text-sm font-medium">{project.assignedUsers?.length || 0}</p>
            <p className="text-xs text-gray-500">Members</p>
          </div>
          <div>
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-gray-500" />
            </div>
            <p className="text-sm font-medium">
              {project.endDate ? new Date(project.endDate).toLocaleDateString() : "No due date"}
            </p>
            <p className="text-xs text-gray-500">Due Date</p>
          </div>
        </div>

        <Link href={`/dashboard/projects/${project._id}`}>
          <Button className="w-full" variant="outline">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
