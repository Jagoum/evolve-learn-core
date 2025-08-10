'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Brain,
  Play,
  Pause,
  RotateCcw,
  BarChart3,
  Edit,
  Eye,
  Plus
} from 'lucide-react'
import { formatDate, getGradeColor } from '@/lib/utils'

// Mock data - replace with real API calls
const mockQuizzes = [
  {
    id: '1',
    title: 'Algebra Fundamentals Quiz',
    subject: 'Mathematics',
    questions: 15,
    timeLimit: 30,
    difficulty: 'intermediate',
    isAI: true,
    teacherApproved: true,
    lastScore: 88,
    attempts: 3,
    dueDate: '2024-01-18T10:00:00Z'
  },
  {
    id: '2',
    title: 'Geometry Proofs Assessment',
    subject: 'Mathematics',
    questions: 10,
    timeLimit: 45,
    difficulty: 'advanced',
    isAI: false,
    teacherApproved: true,
    lastScore: 75,
    attempts: 2,
    dueDate: '2024-01-20T14:00:00Z'
  },
  {
    id: '3',
    title: 'Physics Laws Quiz',
    subject: 'Physics',
    questions: 20,
    timeLimit: 25,
    difficulty: 'beginner',
    isAI: true,
    teacherApproved: false,
    lastScore: null,
    attempts: 0,
    dueDate: '2024-01-22T09:00:00Z'
  }
]

const mockQuizQuestions = [
  {
    id: '1',
    question: 'What is the solution to the equation 2x + 5 = 13?',
    type: 'multiple_choice',
    options: ['x = 4', 'x = 5', 'x = 6', 'x = 7'],
    correctAnswer: 'x = 4',
    explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4'
  },
  {
    id: '2',
    question: 'Which of the following is a quadratic equation?',
    type: 'multiple_choice',
    options: ['x + 2 = 5', 'x² + 3x + 1 = 0', '2x + 3 = 7', 'x³ + 2 = 10'],
    correctAnswer: 'x² + 3x + 1 = 0',
    explanation: 'A quadratic equation has the form ax² + bx + c = 0 where a ≠ 0'
  },
  {
    id: '3',
    question: 'True or False: The sum of two even numbers is always even.',
    type: 'true_false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Even numbers can be written as 2n, so 2n + 2m = 2(n + m), which is even'
  }
]

export default function QuizDashboard() {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null)
  const [isQuizActive, setIsQuizActive] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [quizResults, setQuizResults] = useState<any>(null)
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student')

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isQuizActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isQuizActive, timeRemaining])

  const startQuiz = (quizId: string) => {
    const quiz = mockQuizzes.find(q => q.id === quizId)
    if (quiz) {
      setSelectedQuiz(quizId)
      setTimeRemaining(quiz.timeLimit * 60)
      setIsQuizActive(true)
      setCurrentQuestion(0)
      setAnswers({})
      setQuizResults(null)
    }
  }

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < mockQuizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmitQuiz = () => {
    const totalQuestions = mockQuizQuestions.length
    const correctAnswers = mockQuizQuestions.filter(q => 
      answers[q.id] === q.correctAnswer
    ).length
    const score = Math.round((correctAnswers / totalQuestions) * 100)

    setQuizResults({
      score,
      totalQuestions,
      correctAnswers,
      timeSpent: (mockQuizzes.find(q => q.id === selectedQuiz)?.timeLimit || 0) * 60 - timeRemaining
    })
    setIsQuizActive(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    }
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (isQuizActive && selectedQuiz) {
    const quiz = mockQuizzes.find(q => q.id === selectedQuiz)
    const question = mockQuizQuestions[currentQuestion]
    
    return (
      <MainLayout userRole="student">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Quiz Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{quiz?.title}</CardTitle>
                  <CardDescription>
                    Question {currentQuestion + 1} of {mockQuizQuestions.length}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {formatTime(timeRemaining)}
                    </div>
                    <div className="text-sm text-gray-600">Time Remaining</div>
                  </div>
                  <Button variant="outline" onClick={() => setIsQuizActive(false)}>
                    Exit Quiz
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Question */}
          <Card>
            <CardContent className="pt-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">{question.question}</h3>
                
                <RadioGroup
                  value={answers[question.id] || ''}
                  onValueChange={(value) => handleAnswerSelect(question.id, value)}
                >
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value={option} id={`q${question.id}-${index}`} />
                      <Label htmlFor={`q${question.id}-${index}`} className="text-base cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-2">
                  {currentQuestion < mockQuizQuestions.length - 1 ? (
                    <Button onClick={handleNextQuestion}>
                      Next Question
                    </Button>
                  ) : (
                    <Button onClick={handleSubmitQuiz}>
                      Submit Quiz
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  if (quizResults) {
    return (
      <MainLayout userRole="student">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Quiz Results</CardTitle>
              <CardDescription>Here's how you performed</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="text-6xl font-bold" style={{ color: getGradeColor(quizResults.score) }}>
                {quizResults.score}%
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{quizResults.correctAnswers}</div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">
                    {quizResults.totalQuestions - quizResults.correctAnswers}
                  </div>
                  <div className="text-sm text-gray-600">Incorrect</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(quizResults.timeSpent / 60)}
                  </div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
              </div>

              <div className="space-y-3">
                <Button onClick={() => setQuizResults(null)} className="w-full">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retake Quiz
                </Button>
                <Button variant="outline" onClick={() => {
                  setQuizResults(null)
                  setSelectedQuiz(null)
                }} className="w-full">
                  Back to Quizzes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout userRole={userRole}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quiz Dashboard</h1>
            <p className="text-gray-600">
              {userRole === 'teacher' ? 'Create and manage quizzes' : 'Take quizzes and track your progress'}
            </p>
          </div>
          <div className="flex space-x-2">
            {userRole === 'teacher' && (
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Quiz
              </Button>
            )}
            <Button variant="outline" onClick={() => setUserRole(prev => prev === 'student' ? 'teacher' : 'student')}>
              Switch to {userRole === 'student' ? 'Teacher' : 'Student'} View
            </Button>
          </div>
        </div>

        {/* Quiz List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockQuizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <CardDescription>{quiz.subject}</CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    {quiz.isAI && (
                      <Badge variant="outline" className="text-blue-600">
                        <Brain className="mr-1 h-3 w-3" />
                        AI
                      </Badge>
                    )}
                    <Badge className={getDifficultyColor(quiz.difficulty)}>
                      {quiz.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-medium">{quiz.questions}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Time Limit:</span>
                    <span className="font-medium">{quiz.timeLimit} min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium">{formatDate(quiz.dueDate)}</span>
                  </div>
                  {quiz.lastScore !== null && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last Score:</span>
                      <span className={`font-medium ${getGradeColor(quiz.lastScore)}`}>
                        {quiz.lastScore}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  {userRole === 'student' ? (
                    <>
                      <Button 
                        onClick={() => startQuiz(quiz.id)}
                        className="flex-1"
                        disabled={!quiz.teacherApproved}
                      >
                        <Play className="mr-1 h-3 w-3" />
                        {quiz.teacherApproved ? 'Start Quiz' : 'Pending Approval'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="flex-1">
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Quiz Generation (Teacher View) */}
        {userRole === 'teacher' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-purple-600" />
                AI Quiz Generation
              </CardTitle>
              <CardDescription>Generate personalized quizzes using AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>English</option>
                    <option>History</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Question Count</label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option>5</option>
                    <option>10</option>
                    <option>15</option>
                    <option>20</option>
                  </select>
                </div>
              </div>
              <Button className="mt-4 w-full">
                <Brain className="mr-2 h-4 w-4" />
                Generate AI Quiz
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
} 