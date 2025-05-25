"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Send, Calendar, User, Flag } from "lucide-react"
import type { Task, Comment, User as UserType } from "@/lib/types"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface TaskDetailDialogProps {
  task: Task
  projectName: string
  assignedUserName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
  users: UserType[]
}

export function TaskDetailDialog({
  task,
  projectName,
  assignedUserName,
  open,
  onOpenChange,
  onUpdate,
  users,
}: TaskDetailDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && task._id) {
      fetchComments()
    }
  }, [open, task._id])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/tasks/${task._id}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  const addComment = async () => {
    if (!newComment.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/tasks/${task._id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          userId: user?.uid,
          userName: user?.name,
        }),
      })

      if (response.ok) {
        setNewComment("")
        fetchComments()
        toast({
          title: "Comment added",
          description: "Your comment has been added successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Details */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Description</Label>
              <p className="mt-1 text-sm text-gray-900">{task.description || "No description provided"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Status</Label>
                <div className="mt-1">
                  <Badge variant={getStatusColor(task.status)}>{task.status.replace("-", " ")}</Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Priority</Label>
                <div className="mt-1">
                  <Badge className={getPriorityColor(task.priority)}>
                    <Flag className="w-3 h-3 mr-1" />
                    {task.priority}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Project</Label>
                <div className="mt-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{projectName}</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Assigned To</Label>
                <div className="mt-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{assignedUserName}</span>
                </div>
              </div>
            </div>

            {task.dueDate && (
              <div>
                <Label className="text-sm font-medium text-gray-500">Due Date</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Comments Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
            </div>

            {/* Add Comment */}
            <div className="space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end">
                <Button onClick={addComment} disabled={loading || !newComment.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? "Adding..." : "Add Comment"}
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {comments.map((comment) => (
                <Card key={comment._id} className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm">{comment.userName}</span>
                      <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </CardContent>
                </Card>
              ))}
              {comments.length === 0 && (
                <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
