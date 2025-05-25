export interface User {
  _id?: string
  uid: string
  email: string
  name: string
  role: "admin" | "user"
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  _id?: string
  name: string
  description: string
  status: "active" | "completed" | "on-hold"
  createdBy: string
  assignedUsers: string[]
  startDate: Date
  endDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  _id?: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  projectId: string
  assignedTo: string
  createdBy: string
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  _id?: string
  taskId: string
  userId: string
  userName: string
  content: string
  createdAt: Date
}

export interface ProjectStats {
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  todoTasks: number
  completionRate: number
}
