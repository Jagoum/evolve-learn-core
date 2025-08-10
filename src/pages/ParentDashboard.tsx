import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Bell, 
  TrendingUp, 
  BookOpen, 
  Target, 
  Lightbulb, 
  MessageSquare, 
  Phone, 
  Mail, 
  Calendar,
  BarChart3,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Users,
  BookMarked,
  FileText,
  Video,
  Download,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square
} from 'lucide-react'

// Mock data for parent dashboard
const mockChildData = {
  name: 'Alex Johnson',
  grade: '10th Grade',
  school: 'Riverside High School',
  overallProgress: 78,
  subjects: [
    {
      name: 'Mathematics',
      progress: 85,
      grade: 'A-',
      lastAssessment: '2024-01-15',
      skills: ['Algebra', 'Geometry', 'Calculus'],
      weakAreas: ['Trigonometry'],
      recommendations: ['Practice trigonometric functions daily', 'Use online resources for visual learning']
    },
    {
      name: 'Physics',
      progress: 72,
      grade: 'B+',
      lastAssessment: '2024-01-10',
      skills: ['Mechanics', 'Thermodynamics'],
      weakAreas: ['Electromagnetism', 'Quantum Physics'],
      recommendations: ['Focus on electromagnetic concepts', 'Practice problem-solving regularly']
    },
    {
      name: 'English Literature',
      progress: 88,
      grade: 'A',
      lastAssessment: '2024-01-12',
      skills: ['Essay Writing', 'Critical Analysis', 'Poetry'],
      weakAreas: ['Grammar'],
      recommendations: ['Review grammar rules weekly', 'Practice writing exercises']
    }
  ],
  recentActivities: [
    {
      id: 1,
      type: 'quiz_completed',
      subject: 'Mathematics',
      score: 85,
      date: '2024-01-15',
      message: 'Completed Calculus Quiz with 85% score'
    },
    {
      id: 2,
      type: 'assignment_submitted',
      subject: 'Physics',
      score: 90,
      date: '2024-01-14',
      message: 'Submitted Electromagnetism Assignment'
    },
    {
      id: 3,
      type: 'study_session',
      subject: 'English',
      duration: '45 minutes',
      date: '2024-01-13',
      message: 'Completed study session on Poetry Analysis'
    }
  ],
  notifications: [
    {
      id: 1,
      type: 'performance_alert',
      title: 'Physics Performance Alert',
      message: 'Alex needs help with Electromagnetism concepts',
      priority: 'high',
      date: '2024-01-15',
      read: false
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Mathematics Achievement',
      message: 'Alex improved in Calculus by 15%',
      priority: 'low',
      date: '2024-01-14',
      read: false
    },
    {
      id: 3,
      type: 'teacher_contact',
      title: 'Teacher Contact Request',
      message: 'Ms. Rodriguez would like to discuss Alex\'s progress',
      priority: 'medium',
      date: '2024-01-13',
      read: true
    }
  ]
}

// Mock TTS functionality
const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentText, setCurrentText] = useState('')
  const [speechRate, setSpeechRate] = useState(1)
  const [speechPitch, setSpeechPitch] = useState(1)

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = speechRate
      utterance.pitch = speechPitch
      
      utterance.onstart = () => {
        setIsSpeaking(true)
        setCurrentText(text)
      }
      
      utterance.onend = () => {
        setIsSpeaking(false)
        setCurrentText('')
      }
      
      utterance.onerror = () => {
        setIsSpeaking(false)
        setCurrentText('')
      }
      
      window.speechSynthesis.speak(utterance)
    }
  }

  const stop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setCurrentText('')
    }
  }

  const pause = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause()
    }
  }

  const resume = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume()
    }
  }

  return { speak, stop, pause, resume, isSpeaking, currentText, speechRate, setSpeechRate, speechPitch, setSpeechPitch }
}

export default function ParentDashboard() {
  const { speak, stop, pause, resume, isSpeaking, currentText, speechRate, setSpeechRate, speechPitch, setSpeechPitch } = useTTS()
  const [selectedSubject, setSelectedSubject] = useState(mockChildData.subjects[0])
  const [unreadNotifications, setUnreadNotifications] = useState(
    mockChildData.notifications.filter(n => !n.read).length
  )

  const handleNotificationRead = (notificationId: number) => {
    // In a real app, this would update the backend
    setUnreadNotifications(prev => Math.max(0, prev - 1))
  }

  const handleSpeakProgress = () => {
    const progressText = `${mockChildData.name} is currently at ${mockChildData.overallProgress}% overall progress. In ${selectedSubject.name}, they have achieved ${selectedSubject.progress}% with a grade of ${selectedSubject.grade}. Areas for improvement include ${selectedSubject.weakAreas.join(', ')}. Recommendations: ${selectedSubject.recommendations.join('. ')}`
    speak(progressText)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'default'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4" />
      case 'medium': return <Clock className="h-4 w-4" />
      case 'low': return <CheckCircle className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Parent Dashboard</h1>
          <p className="text-muted-foreground">Monitor your child's learning progress and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {unreadNotifications} unread
          </Badge>
        </div>
      </div>

      {/* Child Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {mockChildData.name} - {mockChildData.grade}
          </CardTitle>
          <CardDescription>{mockChildData.school}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{mockChildData.overallProgress}%</div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">A-</div>
              <div className="text-sm text-muted-foreground">Average Grade</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">3</div>
              <div className="text-sm text-muted-foreground">Active Subjects</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subject Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Subject Progress
              </CardTitle>
              <CardDescription>Track performance across all subjects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockChildData.subjects.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{subject.name}</span>
                      <Badge variant={subject.progress >= 80 ? 'default' : subject.progress >= 70 ? 'secondary' : 'destructive'}>
                        {subject.grade}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Last assessment: {subject.lastAssessment}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activities
              </CardTitle>
              <CardDescription>Latest learning activities and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockChildData.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="p-2 rounded-full bg-primary/10">
                      {activity.type === 'quiz_completed' && <Target className="h-4 w-4 text-primary" />}
                      {activity.type === 'assignment_submitted' && <FileText className="h-4 w-4 text-primary" />}
                      {activity.type === 'study_session' && <BookOpen className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.message}</div>
                      <div className="text-sm text-muted-foreground">{activity.date}</div>
                    </div>
                    {activity.score && (
                      <Badge variant="outline">{activity.score}%</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Important updates and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockChildData.notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      !notification.read ? 'bg-primary/5 border-primary/20' : 'bg-muted/50'
                    }`}
                    onClick={() => handleNotificationRead(notification.id)}
                  >
                    <div className="flex items-start gap-2">
                      {getPriorityIcon(notification.priority)}
                      <div className="flex-1">
                        <div className="font-medium text-sm">{notification.title}</div>
                        <div className="text-xs text-muted-foreground">{notification.message}</div>
                        <div className="text-xs text-muted-foreground mt-1">{notification.date}</div>
                      </div>
                      <Badge variant={getPriorityColor(notification.priority) as any} className="text-xs">
                        {notification.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* TTS Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Text-to-Speech
              </CardTitle>
              <CardDescription>Listen to progress reports and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Speech Rate</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">{speechRate}x</div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Speech Pitch</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechPitch}
                  onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">{speechPitch}x</div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSpeakProgress} 
                  disabled={isSpeaking}
                  className="flex-1"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Speak Progress
                </Button>
                {isSpeaking && (
                  <>
                    <Button variant="outline" onClick={pause} size="sm">
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={stop} size="sm">
                      <Square className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common parent activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Teacher
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="mr-2 h-4 w-4" />
                Schedule Call
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Skills and Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Skills Analysis & Recommendations
          </CardTitle>
          <CardDescription>Detailed breakdown of strengths and areas for improvement</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="skills" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="skills">Skills Overview</TabsTrigger>
              <TabsTrigger value="recommendations">Help Recommendations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="skills" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockChildData.subjects.map((subject, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="font-semibold">{subject.name}</h4>
                    <div>
                      <div className="text-sm font-medium mb-2">Strong Skills:</div>
                      <div className="space-y-1">
                        {subject.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="default" className="mr-1 mb-1">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2 text-destructive">Areas for Improvement:</div>
                      <div className="space-y-1">
                        {subject.weakAreas.map((area, areaIndex) => (
                          <Badge key={areaIndex} variant="destructive" className="mr-1 mb-1">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockChildData.subjects.map((subject, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="font-semibold">{subject.name}</h4>
                    <div className="space-y-2">
                      {subject.recommendations.map((rec, recIndex) => (
                        <div key={recIndex} className="p-3 rounded-lg bg-muted/50 border-l-4 border-l-primary">
                          <div className="text-sm">{rec}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 