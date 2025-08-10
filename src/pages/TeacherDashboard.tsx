import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { fastapiClient } from '@/integrations/fastapi/client'
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
  Clock,
  Sparkles,
  Target,
  Lightbulb,
  Loader2
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
  const [showAIContentDialog, setShowAIContentDialog] = useState(false)
  const [showStudentAnalysisDialog, setShowStudentAnalysisDialog] = useState(false)
  const [newClass, setNewClass] = useState({
    name: '',
    type: 'online',
    maxStudents: 30,
    description: ''
  })
  
  // AI Integration States
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [isAnalyzingStudent, setIsAnalyzingStudent] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [aiContentPrompt, setAiContentPrompt] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [selectedStudentForAnalysis, setSelectedStudentForAnalysis] = useState('')
  const [studentAnalysis, setStudentAnalysis] = useState('')

  // Enhanced AI Functions
  const handleGenerateAIContent = async () => {
    if (!aiContentPrompt.trim()) return
    
    setIsGeneratingContent(true)
    try {
      const response = await fastapiClient.generateContent({
        prompt: aiContentPrompt,
        content_type: 'lesson',
        difficulty: 'intermediate',
        max_length: 800
      })
      
      if (response.data) {
        setGeneratedContent(response.data)
        toast({
          title: "Content Generated",
          description: "AI has generated new learning content for you",
        })
      } else {
        throw new Error("Failed to generate content")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingContent(false)
    }
  }

  const handleAnalyzeStudent = async () => {
    if (!selectedStudentForAnalysis) return
    
    setIsAnalyzingStudent(true)
    try {
      const response = await fastapiClient.explainConcept(
        `Analyze the learning progress and provide recommendations for student: ${selectedStudentForAnalysis}. Include strengths, weaknesses, and specific improvement strategies.`,
        'intermediate',
        600
      )
      
      if (response.data) {
        setStudentAnalysis(response.data)
        toast({
          title: "Analysis Complete",
          description: "AI has analyzed the student's performance",
        })
      } else {
        throw new Error("Failed to analyze student")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzingStudent(false)
    }
  }

  const handleGenerateAIReport = async (studentId: string, studentName: string) => {
    setIsGeneratingReport(true)
    try {
      const response = await fastapiClient.generateContent({
        prompt: `Generate a comprehensive progress report for ${studentName}. Include academic performance, behavioral observations, areas of strength, areas for improvement, and specific recommendations for parents and teachers.`,
        content_type: 'report',
        difficulty: 'intermediate',
        max_length: 1000
      })
      
      if (response.data) {
        setModifiedReport(response.data)
        setSelectedReport({ studentName, content: response.data })
        setShowReportDialog(true)
        toast({
          title: "Report Generated",
          description: "AI has generated a comprehensive progress report",
        })
      } else {
        throw new Error("Failed to generate report")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const handleSendToParent = async (studentId: string, reportContent: string) => {
    try {
      // In a real app, this would send via email/notification system
      toast({
        title: "Report Sent",
        description: "Progress report has been sent to parent successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send report to parent",
        variant: "destructive",
      })
    }
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
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="text-muted-foreground">Monitor student progress and manage your classes</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setShowClassDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Class
            </Button>
            <Button variant="outline" onClick={() => setShowAIContentDialog(true)}>
              <Sparkles className="mr-2 h-4 w-4" />
              AI Content Generator
            </Button>
            <Button variant="outline" onClick={() => setShowStudentAnalysisDialog(true)}>
              <Brain className="mr-2 h-4 w-4" />
              Student Analysis
            </Button>
            <Button variant="outline" onClick={() => navigate('/teacher/calendar')}>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Class
            </Button>
          </div>
        </div>

        {/* AI-Powered Quick Actions */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Sparkles className="h-5 w-5" />
              AI-Powered Teaching Tools
            </CardTitle>
            <CardDescription className="text-blue-700">
              Leverage AI to enhance your teaching experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2 border-blue-300 hover:bg-blue-100"
                onClick={() => setShowAIContentDialog(true)}
              >
                <Sparkles className="h-8 w-8 text-blue-600" />
                <span className="font-medium">Generate Content</span>
                <span className="text-xs text-muted-foreground">AI-powered lesson materials</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2 border-blue-300 hover:bg-blue-100"
                onClick={() => setShowStudentAnalysisDialog(true)}
              >
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="font-medium">Student Analysis</span>
                <span className="text-xs text-muted-foreground">AI insights on performance</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2 border-blue-300 hover:bg-blue-100"
                onClick={() => navigate('/teacher/quizzes')}
              >
                <Target className="h-8 w-8 text-blue-600" />
                <span className="font-medium">Create Quizzes</span>
                <span className="text-xs text-muted-foreground">AI-generated assessments</span>
              </Button>
            </div>
          </CardContent>
        </Card>

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

        {/* Enhanced AI Progress Reports */}
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
              {mockStudents.map((student) => (
                <div key={student.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{student.name}</h3>
                        <Badge variant={student.needsAttention ? 'destructive' : 'default'}>
                          {student.grade}
                        </Badge>
                        <Badge variant="outline">
                          {student.progress}% Progress
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Subject: {student.subject} • Last Active: {student.lastActive}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium">Recent Quiz Score:</span>
                        <Badge variant={student.recentQuizScore >= 80 ? 'default' : student.recentQuizScore >= 70 ? 'secondary' : 'destructive'}>
                          {student.recentQuizScore}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateAIReport(student.id, student.name)}
                      disabled={isGeneratingReport}
                    >
                      {isGeneratingReport ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Brain className="mr-2 h-4 w-4" />
                      )}
                      Generate AI Report
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedStudentForAnalysis(student.name)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/teacher/students`)}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Manage Student
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

        {/* AI Content Generation Dialog */}
        <Dialog open={showAIContentDialog} onOpenChange={setShowAIContentDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Content Generator
              </DialogTitle>
              <DialogDescription>
                Generate engaging lesson content, activities, and materials using AI.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Content Prompt</label>
                <Textarea
                  value={aiContentPrompt}
                  onChange={(e) => setAiContentPrompt(e.target.value)}
                  placeholder="Describe the content you want to generate (e.g., 'Create a lesson plan for teaching quadratic equations to 9th graders')"
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleGenerateAIContent} 
                  disabled={!aiContentPrompt.trim() || isGeneratingContent}
                >
                  {isGeneratingContent ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Content
                </Button>
              </div>
              
              {generatedContent && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">Generated Content</label>
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{generatedContent}</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => navigator.clipboard.writeText(generatedContent)}>
                      Copy to Clipboard
                    </Button>
                    <Button onClick={() => setGeneratedContent('')}>
                      Generate New
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Student Analysis Dialog */}
        <Dialog open={showStudentAnalysisDialog} onOpenChange={setShowStudentAnalysisDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Student Analysis
              </DialogTitle>
              <DialogDescription>
                Get AI-powered insights and recommendations for individual students.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Student</label>
                <select
                  value={selectedStudentForAnalysis}
                  onChange={(e) => setSelectedStudentForAnalysis(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                >
                  <option value="">Choose a student...</option>
                  {mockStudents.map((student) => (
                    <option key={student.id} value={student.name}>
                      {student.name} - {student.subject}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleAnalyzeStudent} 
                  disabled={!selectedStudentForAnalysis || isAnalyzingStudent}
                >
                  {isAnalyzingStudent ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Brain className="mr-2 h-4 w-4" />
                  )}
                  Analyze Student
                </Button>
              </div>
              
              {studentAnalysis && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">AI Analysis & Recommendations</label>
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{studentAnalysis}</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => navigator.clipboard.writeText(studentAnalysis)}>
                      Copy Analysis
                    </Button>
                    <Button onClick={() => setStudentAnalysis('')}>
                      Analyze Another Student
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
} 