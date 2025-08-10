import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
  Plus,
  Brain,
  Calendar,
  Video,
  FileText,
  Headphones,
  CheckCircle,
  Clock
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

// Mock data - replace with real API calls
const mockStudents = [
  {
    id: '1',
    name: 'Alice Johnson',
    grade: 'A-',
    progress: 85,
    lastActive: '2024-01-15',
    needsAttention: true,
    subject: 'Mathematics',
    recentQuizScore: 78,
    parentEmail: 'parent1@example.com',
    parentPhone: '+1-555-0123'
  },
  {
    id: '2',
    name: 'Bob Smith',
    grade: 'B+',
    progress: 92,
    lastActive: '2024-01-15',
    needsAttention: false,
    subject: 'Mathematics',
    recentQuizScore: 88,
    parentEmail: 'parent2@example.com',
    parentPhone: '+1-555-0124'
  },
  {
    id: '3',
    name: 'Carol Davis',
    grade: 'C+',
    progress: 65,
    lastActive: '2024-01-14',
    needsAttention: true,
    subject: 'Mathematics',
    recentQuizScore: 62,
    parentEmail: 'parent3@example.com',
    parentPhone: '+1-555-0125'
  }
]

const mockClasses = [
  {
    id: '1',
    name: 'Advanced Mathematics',
    students: 24,
    activeStudents: 18,
    nextSession: '2024-01-16T10:00:00Z',
    type: 'online',
    status: 'scheduled'
  },
  {
    id: '2',
    name: 'Physics Fundamentals',
    students: 20,
    activeStudents: 15,
    nextSession: '2024-01-16T14:00:00Z',
    type: 'offline',
    status: 'scheduled'
  }
]

const mockAIReports = [
  {
    id: '1',
    studentName: 'Alice Johnson',
    type: 'performance',
    content: 'Alice shows strong understanding in algebra but struggles with geometry concepts. Recommend additional practice with geometric proofs and visual learning aids. Her recent quiz performance indicates a 15% improvement in algebraic concepts but a 20% decline in geometric reasoning.',
    generated: '2024-01-15T09:00:00Z',
    needsReview: true,
    aiConfidence: 0.89,
    recommendations: [
      'Provide additional geometry practice problems',
      'Use visual aids for geometric concepts',
      'Consider one-on-one session for geometry review'
    ]
  },
  {
    id: '2',
    studentName: 'Carol Davis',
    type: 'behavior',
    content: 'Carol has been consistently late to online sessions and shows decreased engagement. Her study time has dropped by 30% in the last two weeks. Consider reaching out to parent to discuss potential issues at home or learning environment.',
    generated: '2024-01-14T16:00:00Z',
    needsReview: false,
    aiConfidence: 0.92,
    recommendations: [
      'Schedule parent-teacher conference',
      'Provide additional support materials',
      'Consider flexible scheduling options'
    ]
  }
]

export default function TeacherDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [modifiedReport, setModifiedReport] = useState('')
  const [showClassDialog, setShowClassDialog] = useState(false)
  const [newClass, setNewClass] = useState({
    name: '',
    type: 'online',
    maxStudents: 30,
    description: ''
  })

  const handleGenerateReport = (studentId: string) => {
    // TODO: Implement AI report generation
    console.log('Generating report for student:', studentId)
  }

  const handleSendToParent = (studentId: string, reportContent: string) => {
    // TODO: Implement sending report to parent
    console.log('Sending report to parent for student:', studentId, reportContent)
  }

  const handleModifyReport = (report: any) => {
    setSelectedReport(report)
    setModifiedReport(report.content)
    setShowReportDialog(true)
  }

  const handleSaveModifiedReport = () => {
    if (selectedReport) {
      // TODO: Save modified report
      console.log('Saving modified report:', modifiedReport)
      setShowReportDialog(false)
    }
  }

  const handleCreateClass = () => {
    // TODO: Implement class creation
    console.log('Creating new class:', newClass)
    setShowClassDialog(false)
    setNewClass({ name: '', type: 'online', maxStudents: 30, description: '' })
  }

  const getClassTypeIcon = (type: string) => {
    return type === 'online' ? <Video className="h-4 w-4" /> : <FileText className="h-4 w-4" />
  }

  const getClassStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
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
          <div className="flex space-x-2">
            <Button onClick={() => setShowClassDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Class
            </Button>
            <Button variant="outline" onClick={() => navigate('/teacher/calendar')}>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Class
            </Button>
          </div>
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
              <CardTitle className="text-sm font-medium">AI Reports</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 need review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">+5% from last week</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Progress Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  AI-Generated Progress Reports
                </CardTitle>
                <CardDescription>
                  AI-generated insights about student performance. Review and modify before sending to parents.
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {mockAIReports.filter(r => r.needsReview).length} Need Review
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAIReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{report.studentName}</h3>
                        <Badge variant={report.type === 'performance' ? 'default' : 'secondary'}>
                          {report.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(report.aiConfidence * 100)}% Confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{report.content}</p>
                      
                      {report.recommendations && (
                        <div className="mb-3">
                          <h4 className="text-sm font-medium mb-2">AI Recommendations:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {report.recommendations.map((rec, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        Generated: {new Date(report.generated).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleModifyReport(report)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Modify Report
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSendToParent(report.studentName, report.content)}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send to Parent
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/teacher/students`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Student
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Class Management */}
        <Card>
          <CardHeader>
            <CardTitle>Class Management</CardTitle>
            <CardDescription>
              Manage your online and offline classes. Create resources and schedule sessions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {mockClasses.map((cls) => (
                <div key={cls.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{cls.name}</h3>
                    <Badge className={getClassStatusColor(cls.status)}>
                      {cls.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {getClassTypeIcon(cls.type)}
                    <span className="capitalize">{cls.type} Class</span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {cls.students} students • {cls.activeStudents} active
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Next: {new Date(cls.nextSession).toLocaleString()}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Add Resources
                    </Button>
                    <Button size="sm" variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Students
                    </Button>
                    <Button size="sm">
                      <Video className="mr-2 h-4 w-4" />
                      Start Session
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Modification Dialog */}
        <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modify AI Report</DialogTitle>
              <DialogDescription>
                Review and modify the AI-generated report before sending to parents.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Report Content</label>
                <Textarea
                  value={modifiedReport}
                  onChange={(e) => setModifiedReport(e.target.value)}
                  rows={8}
                  placeholder="Modify the report content..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveModifiedReport}>
                  Save & Send
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Class Dialog */}
        <Dialog open={showClassDialog} onOpenChange={setShowClassDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
              <DialogDescription>
                Set up a new class for your students.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Class Name</label>
                <input
                  type="text"
                  value={newClass.name}
                  onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="e.g., Advanced Mathematics"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Class Type</label>
                <select
                  value={newClass.type}
                  onChange={(e) => setNewClass({...newClass, type: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                >
                  <option value="online">Online (Live)</option>
                  <option value="offline">Offline (Resources)</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Max Students</label>
                <input
                  type="number"
                  value={newClass.maxStudents}
                  onChange={(e) => setNewClass({...newClass, maxStudents: parseInt(e.target.value)})}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  min="1"
                  max="100"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newClass.description}
                  onChange={(e) => setNewClass({...newClass, description: e.target.value})}
                  placeholder="Class description and objectives..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowClassDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateClass}>
                  Create Class
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
} 