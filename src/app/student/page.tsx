'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock, 
  Play,
  Headphones,
  Brain,
  Calendar,
  Award,
  Lightbulb,
  Users
} from 'lucide-react'
import { formatDate, calculateProgress } from '@/lib/utils'

// Mock data - replace with real API calls
const mockProgress = {
  overall: 78,
  mathematics: 85,
  physics: 72,
  english: 80,
  history: 75
}

const mockRecentActivities = [
  {
    id: '1',
    type: 'quiz',
    subject: 'Mathematics',
    title: 'Algebra Quiz #3',
    score: 88,
    completed: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    type: 'study',
    subject: 'Physics',
    title: 'Newton\'s Laws',
    duration: 45,
    completed: '2024-01-15T12:00:00Z'
  },
  {
    id: '3',
    type: 'assignment',
    subject: 'English',
    title: 'Essay on Shakespeare',
    status: 'completed',
    completed: '2024-01-14T16:00:00Z'
  }
]

const mockUpcomingTasks = [
  {
    id: '1',
    type: 'quiz',
    subject: 'Mathematics',
    title: 'Geometry Quiz',
    dueDate: '2024-01-16T10:00:00Z',
    priority: 'high'
  },
  {
    id: '2',
    type: 'assignment',
    subject: 'Physics',
    title: 'Lab Report',
    dueDate: '2024-01-17T14:00:00Z',
    priority: 'medium'
  }
]

const mockRecommendations = [
  {
    id: '1',
    type: 'practice',
    subject: 'Mathematics',
    title: 'Practice Geometric Proofs',
    reason: 'Based on your recent quiz performance',
    estimatedTime: 30
  },
  {
    id: '2',
    type: 'review',
    subject: 'Physics',
    title: 'Review Newton\'s Third Law',
    reason: 'You spent less time on this topic',
    estimatedTime: 20
  }
]

export default function StudentDashboard() {
  const [selectedSubject, setSelectedSubject] = useState('overall')

  const getSubjectColor = (subject: string) => {
    const colors = {
      mathematics: 'text-blue-600',
      physics: 'text-green-600',
      english: 'text-purple-600',
      history: 'text-orange-600',
      overall: 'text-indigo-600'
    }
    return colors[subject as keyof typeof colors] || 'text-gray-600'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <MainLayout userRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, Alex!</h1>
            <p className="text-gray-600">Let's continue your learning journey</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Headphones className="mr-2 h-4 w-4" />
              Voice Mode
            </Button>
            <Button>
              <Play className="mr-2 h-4 w-4" />
              Continue Learning
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Track your learning journey across subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(mockProgress).map(([subject, progress]) => (
                <div key={subject} className="text-center">
                  <div className={`text-2xl font-bold ${getSubjectColor(subject)}`}>
                    {progress}%
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    {subject === 'overall' ? 'Overall' : subject}
                  </div>
                  <Progress value={progress} className="mt-2 h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your latest learning sessions and achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockRecentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'quiz' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'study' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {activity.type === 'quiz' ? <Target className="h-4 w-4" /> :
                     activity.type === 'study' ? <BookOpen className="h-4 w-4" /> :
                     <Lightbulb className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{activity.title}</div>
                    <div className="text-sm text-gray-600">
                      {activity.subject} • {formatDate(activity.completed)}
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.type === 'quiz' && (
                      <div className="text-lg font-bold text-blue-600">{activity.score}%</div>
                    )}
                    {activity.type === 'study' && (
                      <div className="text-sm text-gray-600">{activity.duration} min</div>
                    )}
                    {activity.type === 'assignment' && (
                      <Badge variant="outline" className="text-green-600">
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Stay on top of your assignments and quizzes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockUpcomingTasks.map((task) => (
                <div key={task.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{task.title}</div>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    {task.subject} • Due: {formatDate(task.dueDate)}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm">
                      Start Now
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-purple-600" />
              AI Learning Recommendations
            </CardTitle>
            <CardDescription>Personalized suggestions to improve your learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockRecommendations.map((rec) => (
                <div key={rec.id} className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium">{rec.title}</div>
                    <Badge variant="outline" className="text-purple-600">
                      {rec.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-1 h-4 w-4" />
                      {rec.estimatedTime} min
                    </div>
                    <Button size="sm" variant="outline">
                      Start
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump back into your learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <BookOpen className="h-6 w-6 mb-2" />
                Study Room
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Target className="h-6 w-6 mb-2" />
                Take Quiz
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Users className="h-6 w-6 mb-2" />
                Study Groups
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Calendar className="h-6 w-6 mb-2" />
                Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
} 