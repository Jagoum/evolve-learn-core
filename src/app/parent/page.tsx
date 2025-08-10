'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Calendar,
  BookOpen,
  Target,
  AlertCircle,
  Eye,
  Phone,
  Mail
} from 'lucide-react'
import { formatDate, calculateProgress } from '@/lib/utils'

// Mock data - replace with real API calls
const mockChildren = [
  {
    id: '1',
    name: 'Alex Johnson',
    grade: '8th Grade',
    age: 13,
    overallProgress: 78,
    subjects: [
      { name: 'Mathematics', progress: 85, grade: 'A-' },
      { name: 'Science', progress: 72, grade: 'B+' },
      { name: 'English', progress: 80, grade: 'A' },
      { name: 'History', progress: 75, grade: 'B' }
    ],
    lastActive: '2024-01-15T16:00:00Z',
    needsAttention: false
  },
  {
    id: '2',
    name: 'Emma Johnson',
    grade: '6th Grade',
    age: 11,
    overallProgress: 92,
    subjects: [
      { name: 'Mathematics', progress: 95, grade: 'A+' },
      { name: 'Science', progress: 88, grade: 'A' },
      { name: 'English', progress: 90, grade: 'A' },
      { name: 'History', progress: 89, grade: 'A-' }
    ],
    lastActive: '2024-01-15T17:30:00Z',
    needsAttention: false
  }
]

const mockAIReports = [
  {
    id: '1',
    childName: 'Alex Johnson',
    type: 'performance',
    title: 'Mathematics Progress Report',
    content: 'Alex shows strong understanding in algebra but struggles with geometry concepts. He would benefit from additional practice with geometric proofs and spatial reasoning exercises.',
    recommendations: [
      'Practice geometric proofs for 15 minutes daily',
      'Use visual aids and diagrams when studying geometry',
      'Consider additional geometry practice problems'
    ],
    generated: '2024-01-15T09:00:00Z',
    teacherModified: true,
    priority: 'medium'
  },
  {
    id: '2',
    childName: 'Alex Johnson',
    type: 'behavior',
    title: 'Study Habits Analysis',
    content: 'Alex has been consistently completing assignments on time and shows good engagement during online sessions. However, he could benefit from more structured study breaks.',
    recommendations: [
      'Encourage 5-minute breaks every 25 minutes of study',
      'Create a quiet, distraction-free study environment',
      'Set specific study goals for each session'
    ],
    generated: '2024-01-14T16:00:00Z',
    teacherModified: false,
    priority: 'low'
  }
]

const mockUpcomingEvents = [
  {
    id: '1',
    type: 'parent-teacher',
    title: 'Parent-Teacher Conference',
    child: 'Alex Johnson',
    date: '2024-01-20T14:00:00Z',
    duration: 30
  },
  {
    id: '2',
    type: 'quiz',
    title: 'Mathematics Quiz',
    child: 'Alex Johnson',
    date: '2024-01-18T10:00:00Z',
    duration: 45
  }
]

export default function ParentDashboard() {
  const [selectedChild, setSelectedChild] = useState(mockChildren[0]?.id)
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  const handleContactTeacher = (childId: string) => {
    // TODO: Implement teacher contact functionality
    console.log('Contacting teacher for child:', childId)
  }

  const handleViewDetailedReport = (reportId: string) => {
    setSelectedReport(reportId)
  }

  const selectedChildData = mockChildren.find(child => child.id === selectedChild)

  return (
    <MainLayout userRole="parent">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
            <p className="text-gray-600">Monitor your children's learning progress</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact Teachers
            </Button>
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Button>
          </div>
        </div>

        {/* Children Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockChildren.map((child) => (
            <Card key={child.id} className={selectedChild === child.id ? 'ring-2 ring-blue-500' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{child.name}</CardTitle>
                    <CardDescription>{child.grade} • Age {child.age}</CardDescription>
                  </div>
                  {child.needsAttention && (
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-2xl font-bold text-blue-600">{child.overallProgress}%</span>
                  </div>
                  <Progress value={child.overallProgress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {child.subjects.map((subject) => (
                    <div key={subject.name} className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-sm font-medium">{subject.name}</div>
                      <div className="text-lg font-bold text-blue-600">{subject.grade}</div>
                      <Progress value={subject.progress} className="h-1 mt-1" />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Last active: {formatDate(child.lastActive)}</span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedChild(child.id)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleContactTeacher(child.id)}
                  >
                    <MessageSquare className="mr-1 h-3 w-3" />
                    Contact Teacher
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Reports */}
        <Card>
          <CardHeader>
            <CardTitle>AI-Generated Reports</CardTitle>
            <CardDescription>Insights and recommendations for your children's learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAIReports.map((report) => (
                <div key={report.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-medium text-lg">{report.title}</div>
                      <div className="text-sm text-gray-600">
                        {report.childName} • {formatDate(report.generated)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={report.priority === 'high' ? 'destructive' : 
                                   report.priority === 'medium' ? 'default' : 'secondary'}>
                        {report.priority}
                      </Badge>
                      {report.teacherModified && (
                        <Badge variant="outline" className="text-green-600">
                          Teacher Modified
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{report.content}</p>
                  
                  <div className="mb-4">
                    <div className="font-medium text-sm mb-2">Recommendations:</div>
                    <ul className="space-y-1">
                      {report.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {report.teacherModified ? 'Modified by teacher' : 'AI generated'}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="mr-1 h-3 w-3" />
                        View Full Report
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="mr-1 h-3 w-3" />
                        Discuss with Teacher
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Important dates and meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUpcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      event.type === 'parent-teacher' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {event.type === 'parent-teacher' ? <Users className="h-4 w-4" /> : <Target className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-600">
                        {event.child} • {formatDate(event.date)} • {event.duration} min
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Calendar className="mr-1 h-3 w-3" />
                      Add to Calendar
                    </Button>
                    {event.type === 'parent-teacher' && (
                      <Button size="sm">
                        <Phone className="mr-1 h-3 w-3" />
                        Join Meeting
                      </Button>
                    )}
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
            <CardDescription>Common tasks and communications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <MessageSquare className="h-6 w-6 mb-2" />
                Message Teacher
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Phone className="h-6 w-6 mb-2" />
                Schedule Call
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <BookOpen className="h-6 w-6 mb-2" />
                View Resources
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Calendar className="h-6 w-6 mb-2" />
                Book Meeting
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
} 