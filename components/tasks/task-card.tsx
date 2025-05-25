"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Calendar, User, Flag } from "lucide-react"
import type { Task } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface TaskCardProps {
  task: Task
  projectName: string
  assignedUserName: string
  onUpdate: () => void
  onClick: () => void
}

export function TaskCard({ task, projectName, assignedUserName, onUpdate, onClick }: TaskCardProps) {
  const { user } = useAuth()
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "outline"
      case "in-progress":
        return "secondary"
      case "done":
        return "default"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const updateTaskStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: "Task updated",
          description: `Task status changed to ${newStatus}`,
        })
        onUpdate()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      })
    }
  }

  const deleteTask = async () => {
    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Task deleted",
          description: "Task has been successfully deleted",
        })
        onUpdate()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg line-clamp-2">{task.title}</CardTitle>
            <CardDescription className="line-clamp-2">{task.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  updateTaskStatus("todo")
                }}
              >
                Mark as To Do
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  updateTaskStatus("in-progress")
                }}
              >
                Mark as In Progress
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  updateTaskStatus("done")
                }}
              >
                Mark as Done
              </DropdownMenuItem>
              {(user?.role === "admin" || task.createdBy === user?.uid) && (
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteTask()
                  }}
                >
                  Delete Task
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2">
          <Badge variant={getStatusColor(task.status)}>{task.status.replace("-", " ")}</Badge>
          <Badge className={getPriorityColor(task.priority)}>
            <Flag className="w-3 h-3 mr-1" />
            {task.priority}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4" />
            <span>Project: {projectName}</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4" />
            <span>Assigned to: {assignedUserName}</span>
          </div>
          {task.dueDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
