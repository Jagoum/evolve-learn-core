'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  MessageSquare,
  Eye,
  Edit,
  Send,
  Plus
} from 'lucide-react'
import { formatDate, calculateProgress } from '@/lib/utils'

// Mock data - replace with real API calls
const mockStudents = [
  {
    id: '1',
    name: 'Alice Johnson',
    grade: 'A',
    progress: 85,
    lastActive: '2024-01-15',
    needsAttention: true,
    subject: 'Mathematics',
    recentQuizScore: 78
  },
  {
    id: '2',
    name: 'Bob Smith',
    grade: 'B+',
    progress: 92,
    lastActive: '2024-01-15',
    needsAttention: false,
    subject: 'Mathematics',
    recentQuizScore: 88
  },
  {
    id: '3',
    name: 'Carol Davis',
    grade: 'C+',
    progress: 65,
    lastActive: '2024-01-14',
    needsAttention: true,
    subject: 'Mathematics',
    recentQuizScore: 62
  }
]

const mockClasses = [
  {
    id: '1',
    name: 'Advanced Mathematics',
    students: 24,
    activeStudents: 18,
    nextSession: '2024-01-16T10:00:00Z'
  },
  {
    id: '2',
    name: 'Physics Fundamentals',
    students: 20,
    activeStudents: 15,
    nextSession: '2024-01-16T14:00:00Z'
  }
]

const mockAIReports = [
  {
    id: '1',
    studentName: 'Alice Johnson',
    type: 'performance',
    content: 'Alice shows strong understanding in algebra but struggles with geometry concepts. Recommend additional practice with geometric proofs.',
    generated: '2024-01-15T09:00:00Z',
    needsReview: true
  },
  {
    id: '2',
    studentName: 'Carol Davis',
    type: 'behavior',
    content: 'Carol has been consistently late to online sessions and shows decreased engagement. Consider reaching out to parent.',
    generated: '2024-01-14T16:00:00Z',
    needsReview: false
  }
]

export default function TeacherDashboard() {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [showAIReport, setShowAIReport] = useState(false)

  const handleGenerateReport = (studentId: string) => {
    // TODO: Implement AI report generation
    console.log('Generating report for student:', studentId)
  }

  const handleSendToParent = (studentId: string) => {
    // TODO: Implement sending report to parent
    console.log('Sending report to parent for student:', studentId)
  }

  const handleModifyReport = (reportId: string) => {
    // TODO: Implement report modification
    console.log('Modifying report:', reportId)
  }

  return (
    <MainLayout userRole="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
            <p className="text-gray-600">Monitor student progress and manage your classes</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Class
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">44</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">2 sessions today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">+5% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Reports</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 need review</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Student Progress Overview</CardTitle>
              <CardDescription>Recent activity and performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="font-medium">{student.name}</div>
                      <Badge variant={student.needsAttention ? "destructive" : "secondary"}>
                        {student.grade}
                      </Badge>
                      {student.needsAttention && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {student.subject} • Last active: {formatDate(student.lastActive)}
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{student.progress}%</span>
                      </div>
                      <Progress value={student.progress} className="h-2" />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateReport(student.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedStudent(student.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Reports */}
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Reports</CardTitle>
              <CardDescription>Student insights and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAIReports.map((report) => (
                <div key={report.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{report.studentName}</div>
                    <Badge variant={report.type === 'performance' ? 'default' : 'secondary'}>
                      {report.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {report.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>Generated: {formatDate(report.generated)}</span>
                    {report.needsReview && (
                      <Badge variant="outline" className="text-orange-600">
                        Needs Review
                      </Badge>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleModifyReport(report.id)}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Modify
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSendToParent(report.id)}
                    >
                      <Send className="mr-1 h-3 w-3" />
                      Send to Parent
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>Today's schedule and session details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockClasses.map((classItem) => (
                <div key={classItem.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{classItem.name}</h3>
                    <Badge variant="outline">
                      {classItem.activeStudents}/{classItem.students} Active
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Next session: {formatDate(classItem.nextSession)}
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm">
                      Start Session
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
} 