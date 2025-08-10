import { useState, useEffect, useRef } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { 
  BookOpen, 
  Headphones, 
  Mic, 
  Play, 
  Pause, 
  StopCircle, 
  Brain, 
  Target, 
  TrendingUp,
  Volume2,
  VolumeX,
  Settings,
  Lightbulb,
  BookMarked,
  FileText,
  Video,
  Users,
  Calendar,
  Search,
  Download,
  Share2,
  BookOpenCheck,
  Timer,
  Zap
} from 'lucide-react'

// Mock study content
const mockStudyContent = [
  {
    id: '1',
    title: 'Introduction to Calculus',
    subject: 'Mathematics',
    topic: 'Calculus',
    content: `Calculus is a branch of mathematics that deals with continuous change. It has two major branches: differential calculus and integral calculus.

Differential calculus studies the rate of change of quantities, while integral calculus studies the accumulation of quantities. These two branches are related to each other by the fundamental theorem of calculus.

Key concepts in calculus include:
- Limits: The value that a function approaches as the input approaches some value
- Derivatives: The rate of change of a function
- Integrals: The accumulation of quantities over an interval

Calculus is fundamental to many fields including physics, engineering, economics, and computer science.`,
    format: 'text',
    duration: '15 minutes',
    difficulty: 'intermediate',
    aiGenerated: true,
    teacherApproved: true
  },
  {
    id: '2',
    title: 'Newton\'s Laws of Motion',
    subject: 'Physics',
    topic: 'Mechanics',
    content: `Newton's three laws of motion are fundamental principles that describe the relationship between forces acting on a body and the motion of that body.

First Law (Law of Inertia): An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.

Second Law (Force and Acceleration): The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. F = ma

Third Law (Action and Reaction): For every action, there is an equal and opposite reaction.

These laws form the foundation of classical mechanics and are essential for understanding how objects move in our universe.`,
    format: 'text',
    duration: '20 minutes',
    difficulty: 'beginner',
    aiGenerated: true,
    teacherApproved: true
  },
  {
    id: '3',
    title: 'Essay Writing Fundamentals',
    subject: 'English',
    topic: 'Writing',
    content: `A well-structured essay consists of three main parts: introduction, body, and conclusion.

The introduction should:
- Hook the reader's attention
- Provide background information
- Present a clear thesis statement

The body paragraphs should:
- Each focus on one main idea
- Include topic sentences
- Provide supporting evidence and examples
- Use transitions between paragraphs

The conclusion should:
- Restate the thesis
- Summarize main points
- Leave a lasting impression

Remember to revise and edit your work for clarity, coherence, and correctness.`,
    format: 'text',
    duration: '25 minutes',
    difficulty: 'beginner',
    aiGenerated: true,
    teacherApproved: false
  }
]

const mockAIStudyPlans = [
  {
    id: '1',
    title: 'Calculus Study Session',
    subject: 'Mathematics',
    duration: '45 minutes',
    focus: 'Understanding derivatives and their applications',
    activities: [
      'Review basic derivative rules (15 min)',
      'Practice problems with real-world applications (20 min)',
      'Self-assessment quiz (10 min)'
    ],
    aiConfidence: 0.92,
    teacherApproved: true
  },
  {
    id: '2',
    title: 'Physics Lab Preparation',
    subject: 'Physics',
    duration: '30 minutes',
    focus: 'Preparing for tomorrow\'s mechanics lab',
    activities: [
      'Review Newton\'s laws (10 min)',
      'Read lab procedure (15 min)',
      'Prepare questions for instructor (5 min)'
    ],
    aiConfidence: 0.88,
    teacherApproved: true
  }
]

// TTS Hook for reading study content
const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentText, setCurrentText] = useState('')
  const [speechRate, setSpeechRate] = useState(0.9)
  const [speechPitch, setSpeechPitch] = useState(1.0)

  const speak = (text: string) => {
    if (typeof window === 'undefined') return
    
    if (!("speechSynthesis" in window)) {
      alert("Speech Synthesis not supported in this browser.")
      return
    }

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

  const stop = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setCurrentText('')
    }
  }

  const pause = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.pause()
    }
  }

  const resume = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.resume()
    }
  }

  return { 
    speak, 
    stop, 
    pause, 
    resume, 
    isSpeaking, 
    currentText, 
    speechRate, 
    setSpeechRate, 
    speechPitch, 
    setSpeechPitch 
  }
}

// STT Hook for voice notes
const useSTT = () => {
  const recognitionRef = useRef<any | null>(null)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')

  useEffect(() => {
    const Rec = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (Rec) {
      recognitionRef.current = new Rec()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'
    }
  }, [])

  const start = () => {
    const rec = recognitionRef.current
    if (!rec) {
      alert("Speech Recognition not supported in this browser.")
      return
    }
    
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join(" ")
      setTranscript(prev => prev + (prev ? "\n" : "") + transcript)
    }
    
    rec.onend = () => setListening(false)
    rec.start()
    setListening(true)
  }

  const stop = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  return { start, stop, listening, transcript, setTranscript }
}

export default function StudyRoom() {
  const [selectedContent, setSelectedContent] = useState(mockStudyContent[0])
  const [activeTab, setActiveTab] = useState('study')
  const [notes, setNotes] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [studyTimer, setStudyTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<'text' | 'speech'>('text')

  const { speak, stop, pause, resume, isSpeaking, currentText, speechRate, setSpeechRate, speechPitch, setSpeechPitch } = useTTS()
  const { start: startSTT, stop: stopSTT, listening, transcript, setTranscript } = useSTT()

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        setStudyTimer(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning])

  const startTimer = () => {
    setIsTimerRunning(true)
  }

  const pauseTimer = () => {
    setIsTimerRunning(false)
  }

  const resetTimer = () => {
    setStudyTimer(0)
    setIsTimerRunning(false)
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleContentSelect = (content: any) => {
    setSelectedContent(content)
    setSelectedFormat('text')
    // Stop any current speech when switching content
    if (isSpeaking) {
      stop()
    }
  }

  const handleSpeakContent = () => {
    if (isSpeaking && currentText === selectedContent.content) {
      stop()
    } else {
      speak(selectedContent.content)
    }
  }

  const handleFormatChange = (format: 'text' | 'speech') => {
    setSelectedFormat(format)
    if (format === 'speech') {
      speak(selectedContent.content)
    } else {
      stop()
    }
  }

  const filteredContent = mockStudyContent.filter(content =>
    content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.topic.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    }
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <MainLayout userRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Study Room</h1>
            <p className="text-gray-600">AI-powered learning environment with voice assistance</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatTime(studyTimer)}</div>
              <div className="text-sm text-gray-600">Study Time</div>
            </div>
            <div className="flex gap-2">
              {!isTimerRunning ? (
                <Button size="sm" onClick={startTimer}>
                  <Play className="mr-2 h-4 w-4" />
                  Start
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={pauseTimer}>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={resetTimer}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="study">Study Content</TabsTrigger>
            <TabsTrigger value="ai-plans">AI Study Plans</TabsTrigger>
            <TabsTrigger value="notes">My Notes</TabsTrigger>
          </TabsList>

          {/* Study Content Tab */}
          <TabsContent value="study" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Content List */}
              <div className="lg:col-span-1 space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Search study content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-3">
                  {filteredContent.map((content) => (
                    <Card 
                      key={content.id} 
                      className={`cursor-pointer transition-all ${
                        selectedContent?.id === content.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                      }`}
                      onClick={() => handleContentSelect(content)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm">{content.title}</h3>
                            <Badge className={getDifficultyColor(content.difficulty)}>
                              {content.difficulty}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600">
                            {content.subject} • {content.topic}
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{content.duration}</span>
                            <div className="flex items-center gap-1">
                              {content.aiGenerated && (
                                <Badge variant="outline" className="text-xs">
                                  <Brain className="h-3 w-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                              {content.teacherApproved ? (
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                  ✓ Approved
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                                  ⚠ Modified
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Content Viewer */}
              <div className="lg:col-span-2">
                {selectedContent && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            {selectedContent.title}
                          </CardTitle>
                          <CardDescription>
                            {selectedContent.subject} • {selectedContent.topic} • {selectedContent.duration}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getDifficultyColor(selectedContent.difficulty)}>
                            {selectedContent.difficulty}
                          </Badge>
                          <Button
                            size="sm"
                            variant={isSpeaking && currentText === selectedContent.content ? "destructive" : "outline"}
                            onClick={handleSpeakContent}
                          >
                            {isSpeaking && currentText === selectedContent.content ? (
                              <>
                                <Pause className="mr-2 h-4 w-4" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Headphones className="mr-2 h-4 w-4" />
                                Listen
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Format Selection */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Learning Format:</span>
                        <Button
                          size="sm"
                          variant={selectedFormat === 'text' ? 'default' : 'outline'}
                          onClick={() => handleFormatChange('text')}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Text
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedFormat === 'speech' ? 'default' : 'outline'}
                          onClick={() => handleFormatChange('speech')}
                        >
                          <Headphones className="mr-2 h-4 w-4" />
                          Speech
                        </Button>
                      </div>

                      {/* Content Display */}
                      {selectedFormat === 'text' ? (
                        <div className="prose max-w-none">
                          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                            {selectedContent.content}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Headphones className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                          <p className="text-gray-600">
                            {isSpeaking ? 'Listening to content...' : 'Click "Listen" to hear the content'}
                          </p>
                          {isSpeaking && (
                            <div className="mt-4 space-y-2">
                              <Button variant="outline" onClick={pause}>
                                <Pause className="mr-2 h-4 w-4" />
                                Pause
                              </Button>
                              <Button variant="outline" onClick={resume}>
                                <Play className="mr-2 h-4 w-4" />
                                Resume
                              </Button>
                                      <Button variant="outline" onClick={stop}>
          <StopCircle className="mr-2 h-4 w-4" />
          Stop
        </Button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* AI and Teacher Information */}
                      <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Brain className="h-4 w-4" />
                          <span>AI-Generated Content</span>
                        </div>
                        {selectedContent.teacherApproved ? (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <BookOpenCheck className="h-4 w-4" />
                            <span>Teacher Approved</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-yellow-600">
                            <Lightbulb className="h-4 w-4" />
                            <span>Teacher Modified</span>
                          </div>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <BookMarked className="mr-2 h-4 w-4" />
                          Bookmark
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* AI Study Plans Tab */}
          <TabsContent value="ai-plans" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  AI-Generated Study Plans
                </CardTitle>
                <CardDescription>
                  Personalized learning plans created by AI and approved by your teachers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {mockAIStudyPlans.map((plan) => (
                    <Card key={plan.id} className="border-2 border-blue-100">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{plan.title}</CardTitle>
                            <CardDescription>
                              {plan.subject} • {plan.duration}
                            </CardDescription>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            {Math.round(plan.aiConfidence * 100)}% AI Confidence
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Focus Area:</h4>
                          <p className="text-sm text-gray-600">{plan.focus}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Activities:</h4>
                          <ul className="space-y-1">
                            {plan.activities.map((activity, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {plan.teacherApproved ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              ✓ Teacher Approved
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                              ⚠ Pending Approval
                            </Badge>
                          )}
                        </div>
                        
                        <Button className="w-full">
                          <Play className="mr-2 h-4 w-4" />
                          Start Study Plan
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookMarked className="h-5 w-4" />
                  Study Notes
                </CardTitle>
                <CardDescription>
                  Capture your thoughts and insights while studying
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Voice Notes */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Voice Notes</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {!listening ? (
                        <Button onClick={startSTT} className="flex items-center gap-2">
                          <Mic className="h-4 w-4" />
                          Start Recording
                        </Button>
                      ) : (
                                <Button onClick={stopSTT} variant="destructive" className="flex items-center gap-2">
          <StopCircle className="h-4 w-4" />
          Stop Recording
        </Button>
                      )}
                      {listening && (
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                          Recording...
                        </div>
                      )}
                    </div>
                    
                    {transcript && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium mb-2">Transcript:</div>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">{transcript}</div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setTranscript('')}
                          className="mt-2"
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Notes */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Text Notes</h3>
                  <Textarea
                    placeholder="Write your study notes here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                  <div className="flex gap-2">
                    <Button>
                      <BookMarked className="mr-2 h-4 w-4" />
                      Save Notes
                    </Button>
                    <Button variant="outline" onClick={() => setNotes('')}>
                      Clear
                    </Button>
                  </div>
                </div>

                {/* Saved Notes */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Saved Notes</h3>
                  <div className="text-sm text-gray-600">
                    No saved notes yet. Start taking notes to see them here.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
} 