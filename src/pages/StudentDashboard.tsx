import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  BarChart3, 
  Play, 
  Pause, 
  Headphones, 
  Brain, 
  Target, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Video,
  Users,
  Calendar,
  Lightbulb,
  BookMarked,
  Zap,
  Eye
} from 'lucide-react'

// Mock data - replace with real API calls
const mockSubjects = [
  {
    name: 'Mathematics',
    progress: 85,
    grade: 'A-',
    currentTopic: 'Geometric Proofs',
    nextTopic: 'Trigonometry',
    studyTime: '2.5 hours',
    lastQuizScore: 78,
    improvement: '+12%'
  },
  {
    name: 'Physics',
    progress: 72,
    grade: 'B+',
    currentTopic: 'Mechanics',
    nextTopic: 'Thermodynamics',
    studyTime: '1.8 hours',
    lastQuizScore: 82,
    improvement: '+8%'
  },
  {
    name: 'English',
    progress: 80,
    grade: 'A',
    currentTopic: 'Essay Writing',
    nextTopic: 'Literature Analysis',
    studyTime: '2.0 hours',
    lastQuizScore: 88,
    improvement: '+15%'
  },
  {
    name: 'History',
    progress: 75,
    grade: 'B',
    currentTopic: 'World War II',
    nextTopic: 'Cold War',
    studyTime: '1.5 hours',
    lastQuizScore: 75,
    improvement: '+5%'
  }
]

const mockQuizzes = [
  {
    id: '1',
    title: 'Algebra Fundamentals Quiz',
    subject: 'Mathematics',
    questions: 15,
    timeLimit: 20,
    difficulty: 'Medium',
    status: 'available',
    lastAttempt: null,
    bestScore: null
  },
  {
    id: '2',
    title: 'Physics Mechanics Test',
    subject: 'Physics',
    questions: 20,
    timeLimit: 30,
    difficulty: 'Hard',
    status: 'completed',
    lastAttempt: '2024-01-14T10:00:00Z',
    bestScore: 82
  },
  {
    id: '3',
    title: 'English Grammar Review',
    subject: 'English',
    questions: 12,
    timeLimit: 15,
    difficulty: 'Easy',
    status: 'available',
    lastAttempt: null,
    bestScore: null
  },
  {
    id: '4',
    title: 'History Timeline Quiz',
    subject: 'History',
    questions: 18,
    timeLimit: 25,
    difficulty: 'Medium',
    status: 'available',
    lastAttempt: null,
    bestScore: null
  }
]

const mockAIStudySuggestions = [
  {
    id: '1',
    type: 'study_plan',
    title: 'Mathematics Focus Session',
    content: 'Based on your recent quiz performance, focus on geometric proofs for the next 30 minutes. Use visual aids and practice with step-by-step problem solving.',
    priority: 'high',
    estimatedTime: '30 minutes',
    subject: 'Mathematics',
    teacherApproved: true,
    teacherNote: 'Great suggestion! Alex should focus on geometric reasoning.'
  },
  {
    id: '2',
    type: 'research',
    title: 'Physics Research Project',
    content: 'Research real-world applications of Newton\'s laws. Find examples in sports, transportation, or everyday activities. This will help solidify your understanding.',
    priority: 'medium',
    estimatedTime: '45 minutes',
    subject: 'Physics',
    teacherApproved: true,
    teacherNote: 'Excellent idea for practical application!'
  },
  {
    id: '3',
    type: 'practice',
    title: 'English Writing Exercise',
    content: 'Practice writing a 5-paragraph essay on a topic of your choice. Focus on thesis statements and topic sentences.',
    priority: 'low',
    estimatedTime: '20 minutes',
    subject: 'English',
    teacherApproved: false,
    teacherNote: 'Consider focusing on current essay requirements instead.'
  }
]

const mockStudyGroups = [
  {
    id: '1',
    name: 'Math Study Group',
    subject: 'Mathematics',
    members: 6,
    nextMeeting: '2024-01-16T15:00:00Z',
    status: 'active'
  },
  {
    id: '2',
    name: 'Physics Lab Partners',
    subject: 'Physics',
    members: 4,
    nextMeeting: '2024-01-17T14:00:00Z',
    status: 'active'
  }
]

export default function StudentDashboard() {
  const [selectedSubject, setSelectedSubject] = useState('overall')
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const getSubjectColor = (subject: string) => {
    const colors = {
      mathematics: 'text-blue-600',
      physics: 'text-green-600',
      english: 'text-purple-600',
      history: 'text-orange-600',
      overall: 'text-indigo-600'
    }
    return colors[subject.toLowerCase() as keyof typeof colors] || 'text-gray-600'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    }
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const handleStartQuiz = (quizId: string) => {
    // TODO: Navigate to quiz
    console.log('Starting quiz:', quizId)
  }

  const handleJoinStudyGroup = (groupId: string) => {
    // TODO: Join study group
    console.log('Joining study group:', groupId)
  }

  const overallProgress = mockSubjects.reduce((acc, subject) => acc + subject.progress, 0) / mockSubjects.length

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="ai-suggestions">AI Suggestions</TabsTrigger>
            <TabsTrigger value="study-groups">Study Groups</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Overall Progress
                </CardTitle>
                <CardDescription>
                  Your learning progress across all subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm text-gray-600">{Math.round(overallProgress)}%</span>
                      </div>
                      <Progress value={overallProgress} className="h-3" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {mockSubjects.map((subject) => (
                        <div key={subject.name} className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{subject.grade}</div>
                          <div className="text-sm font-medium">{subject.name}</div>
                          <div className="text-xs text-gray-600">{subject.progress}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Current Focus</h3>
                    <div className="space-y-3">
                      {mockSubjects.slice(0, 2).map((subject) => (
                        <div key={subject.name} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{subject.name}</span>
                            <Badge variant="outline">{subject.currentTopic}</Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            Next: {subject.nextTopic}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Study time: {subject.studyTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subject Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>
                  Detailed breakdown of your academic performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSubjects.map((subject) => (
                    <div key={subject.name} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{subject.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{subject.grade}</Badge>
                          <Badge variant="secondary" className="text-green-700 bg-green-100">
                            {subject.improvement}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Progress</div>
                          <Progress value={subject.progress} className="h-2" />
                          <div className="text-xs text-gray-500 mt-1">{subject.progress}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Last Quiz</div>
                          <div className="text-lg font-bold">{subject.lastQuizScore}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Study Time</div>
                          <div className="text-lg font-bold">{subject.studyTime}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Available Quizzes
                </CardTitle>
                <CardDescription>
                  AI-generated quizzes to test your understanding. Take quizzes to get personalized study suggestions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {mockQuizzes.map((quiz) => (
                    <div key={quiz.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{quiz.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{quiz.subject}</Badge>
                            <Badge className={getDifficultyColor(quiz.difficulty)}>
                              {quiz.difficulty}
                            </Badge>
                          </div>
                        </div>
                        {quiz.status === 'completed' && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {quiz.questions} questions
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {quiz.timeLimit} min
                        </div>
                      </div>
                      
                      {quiz.status === 'completed' && quiz.bestScore && (
                        <div className="text-sm">
                          <span className="text-gray-600">Best Score: </span>
                          <span className="font-semibold text-green-600">{quiz.bestScore}%</span>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        {quiz.status === 'available' ? (
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleStartQuiz(quiz.id)}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Start Quiz
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleStartQuiz(quiz.id)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Retake Quiz
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Suggestions Tab */}
          <TabsContent value="ai-suggestions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  AI Study Suggestions
                </CardTitle>
                <CardDescription>
                  Personalized learning recommendations moderated by your teachers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAIStudySuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{suggestion.title}</h3>
                            <Badge className={getPriorityColor(suggestion.priority)}>
                              {suggestion.priority} Priority
                            </Badge>
                            <Badge variant="outline">{suggestion.subject}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{suggestion.content}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {suggestion.estimatedTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <Lightbulb className="h-4 w-4" />
                              {suggestion.type.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {suggestion.teacherApproved && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-green-800">
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-medium">Teacher Approved</span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">{suggestion.teacherNote}</p>
                        </div>
                      )}
                      
                      {!suggestion.teacherApproved && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-yellow-800">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-medium">Teacher Modified</span>
                          </div>
                          <p className="text-sm text-yellow-700 mt-1">{suggestion.teacherNote}</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <BookMarked className="mr-2 h-4 w-4" />
                          Start Learning
                        </Button>
                        <Button size="sm" variant="outline">
                          <Zap className="mr-2 h-4 w-4" />
                          Save for Later
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Study Groups Tab */}
          <TabsContent value="study-groups" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Study Groups
                </CardTitle>
                <CardDescription>
                  Collaborate with other students in your subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {mockStudyGroups.map((group) => (
                    <div key={group.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{group.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{group.subject}</Badge>
                            <Badge variant="secondary">{group.members} members</Badge>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {group.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        Next meeting: {new Date(group.nextMeeting).toLocaleString()}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleJoinStudyGroup(group.id)}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Join Group
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
} 