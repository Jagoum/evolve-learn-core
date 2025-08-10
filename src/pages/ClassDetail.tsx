import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { fastapiClient } from "@/integrations/fastapi/client";
import { useSEO } from "@/hooks/useSEO";
import { toast } from "@/components/ui/use-toast";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Mic, 
  Send, 
  BookOpen, 
  Clock, 
  User, 
  Bookmark, 
  BookmarkCheck, 
  FileText, 
  Share2, 
  Target, 
  TrendingUp,
  Lightbulb,
  Video,
  Code,
  Image,
  CheckCircle,
  Circle
} from "lucide-react";

interface ClassContent {
  id: string;
  title: string;
  text: string;
  order: number;
  type: string;
}

interface ClassInfo {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  difficulty: string;
  content: ClassContent[];
}

interface StudySession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  contentCompleted: string[];
}

interface StudyNote {
  id: string;
  contentId: string;
  note: string;
  timestamp: Date;
}

const ClassDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string; timestamp: string }>>([]);
  
  // Enhanced state management
  const [completedContent, setCompletedContent] = useState<Set<string>>(new Set());
  const [bookmarkedContent, setBookmarkedContent] = useState<Set<string>>(new Set());
  const [studyNotes, setStudyNotes] = useState<StudyNote[]>([]);
  const [currentNote, setCurrentNote] = useState("");
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [activeTab, setActiveTab] = useState("content");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useSEO({ 
    title: classInfo ? `${classInfo.title} - AI Learning` : "Class Details - AI Learning", 
    description: classInfo?.description || "View class details and content.", 
    canonical: window.location.href 
  });

  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!id) return;
      
      try {
        const response = await fastapiClient.getClass(id);
        if (response.data) {
          setClassInfo(response.data as ClassInfo);
          // Load user progress from localStorage
          loadUserProgress();
        } else if (response.error) {
          toast({
            title: "Error",
            description: "Failed to fetch class details: " + response.error,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch class details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [id]);

  // Load user progress from localStorage
  const loadUserProgress = () => {
    if (!id) return;
    
    const progressKey = `class_progress_${id}`;
    const bookmarksKey = `class_bookmarks_${id}`;
    const notesKey = `class_notes_${id}`;
    const sessionsKey = `class_sessions_${id}`;
    
    const savedProgress = localStorage.getItem(progressKey);
    const savedBookmarks = localStorage.getItem(bookmarksKey);
    const savedNotes = localStorage.getItem(notesKey);
    const savedSessions = localStorage.getItem(sessionsKey);
    
    if (savedProgress) {
      setCompletedContent(new Set(JSON.parse(savedProgress)));
    }
    if (savedBookmarks) {
      setBookmarkedContent(new Set(JSON.parse(savedBookmarks)));
    }
    if (savedNotes) {
      setStudyNotes(JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        timestamp: new Date(note.timestamp)
      })));
    }
    if (savedSessions) {
      setStudySessions(JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined
      })));
    }
  };

  // Save user progress to localStorage
  const saveUserProgress = () => {
    if (!id) return;
    
    const progressKey = `class_progress_${id}`;
    const bookmarksKey = `class_bookmarks_${id}`;
    const notesKey = `class_notes_${id}`;
    const sessionsKey = `class_sessions_${id}`;
    
    localStorage.setItem(progressKey, JSON.stringify([...completedContent]));
    localStorage.setItem(bookmarksKey, JSON.stringify([...bookmarkedContent]));
    localStorage.setItem(notesKey, JSON.stringify(studyNotes));
    localStorage.setItem(sessionsKey, JSON.stringify(studySessions));
  };

  // Start study session
  const startStudySession = () => {
    const session: StudySession = {
      id: Date.now().toString(),
      startTime: new Date(),
      duration: 0,
      contentCompleted: []
    };
    setCurrentSession(session);
    setStudySessions(prev => [...prev, session]);
    saveUserProgress();
  };

  // End study session
  const endStudySession = () => {
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        endTime: new Date(),
        duration: Math.floor((new Date().getTime() - currentSession.startTime.getTime()) / 1000)
      };
      setStudySessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));
      setCurrentSession(null);
      saveUserProgress();
    }
  };

  // Mark content as completed
  const markContentCompleted = (contentId: string) => {
    const newCompleted = new Set(completedContent);
    if (newCompleted.has(contentId)) {
      newCompleted.delete(contentId);
    } else {
      newCompleted.add(contentId);
    }
    setCompletedContent(newCompleted);
    
    // Update current session if active
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        contentCompleted: [...newCompleted]
      };
      setCurrentSession(updatedSession);
      setStudySessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));
    }
    
    saveUserProgress();
  };

  // Toggle bookmark
  const toggleBookmark = (contentId: string) => {
    const newBookmarks = new Set(bookmarkedContent);
    if (newBookmarks.has(contentId)) {
      newBookmarks.delete(contentId);
    } else {
      newBookmarks.add(contentId);
    }
    setBookmarkedContent(newBookmarks);
    saveUserProgress();
  };

  // Add study note
  const addStudyNote = () => {
    if (!currentNote.trim() || !currentContent) return;
    
    const note: StudyNote = {
      id: Date.now().toString(),
      contentId: currentContent.id,
      note: currentNote,
      timestamp: new Date()
    };
    
    setStudyNotes(prev => [...prev, note]);
    setCurrentNote("");
    saveUserProgress();
    
    toast({
      title: "Note Added",
      description: "Your study note has been saved",
    });
  };

  // Enhanced TTS with AI integration
  const handleTTS = async (text: string) => {
    setIsPlaying(true);
    
    try {
      // Use AI service to generate audio description if needed
      const aiResponse = await fastapiClient.explainConcept(
        `Generate a brief audio description for: ${text.substring(0, 100)}`,
        'beginner',
        200
      );
      
      if (aiResponse.data) {
        toast({
          title: "AI Enhanced Audio",
          description: aiResponse.data,
        });
      }
    } catch (error) {
      // Fallback to basic TTS
      toast({
        title: "Text-to-Speech",
        description: "Playing audio for: " + text.substring(0, 50) + "...",
      });
    }
    
    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  // Enhanced STT with AI processing
  const handleSTT = async () => {
    setIsListening(true);
    
    toast({
      title: "Speech-to-Text",
      description: "Listening for speech input...",
    });
    
    // Simulate speech recognition
    setTimeout(() => {
      setIsListening(false);
      const mockTranscript = "This is a mock transcript from speech recognition.";
      setChatMessage(mockTranscript);
      
      // Use AI to process and enhance the transcript
      processTranscriptWithAI(mockTranscript);
    }, 2000);
  };

  // Process transcript with AI
  const processTranscriptWithAI = async (transcript: string) => {
    try {
      const aiResponse = await fastapiClient.explainConcept(
        `Process and enhance this transcript: ${transcript}`,
        'beginner',
        300
      );
      
      if (aiResponse.data) {
        toast({
          title: "AI Enhanced",
          description: aiResponse.data,
        });
      }
    } catch (error) {
      // Fallback
      toast({
        title: "Speech Recognized",
        description: transcript,
      });
    }
  };

  // Enhanced AI chat with actual AI service
  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const newMessage = {
      role: "user",
      content: chatMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatHistory(prev => [...prev, newMessage]);
    setChatMessage("");
    setIsGeneratingAI(true);

    try {
      // Use actual AI service
      const aiResponse = await fastapiClient.explainConcept(
        `Based on the class content about ${classInfo?.title}, answer this question: ${chatMessage}`,
        'intermediate',
        400
      );

      if (aiResponse.data) {
        const aiMessage = {
          role: "assistant",
          content: aiResponse.data,
          timestamp: new Date().toLocaleTimeString(),
        };
        setChatHistory(prev => [...prev, aiMessage]);
      } else {
        throw new Error("No AI response received");
      }
    } catch (error) {
      // Fallback to mock response
      const fallbackResponse = {
        role: "assistant",
        content: "I'm having trouble connecting to the AI service right now. Please try again later or check your connection.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatHistory(prev => [...prev, fallbackResponse]);
      
      toast({
        title: "AI Service Unavailable",
        description: "Using fallback response",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Calculate progress
  const calculateProgress = () => {
    if (!classInfo?.content.length) return 0;
    return (completedContent.size / classInfo.content.length) * 100;
  };

  // Get content type icon
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'code':
        return <Code className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Share content
  const shareContent = async (content: ClassContent) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${classInfo?.title} - ${content.title}`,
          text: content.text.substring(0, 100) + "...",
          url: window.location.href
        });
      } catch (error) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Content link copied to clipboard",
        });
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Content link copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="text-center">Loading class details...</div>
      </main>
    );
  }

  if (!classInfo) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Class Not Found</h2>
          <Button asChild>
            <Link to="/classes">Back to Classes</Link>
          </Button>
        </div>
      </main>
    );
  }

  const currentContent = classInfo.content[currentContentIndex];
  const progress = calculateProgress();

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/classes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{classInfo.title}</h1>
            <p className="text-muted-foreground">{classInfo.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={classInfo.difficulty === 'Beginner' ? 'default' : 'secondary'}>
            {classInfo.difficulty}
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {completedContent.size} of {classInfo.content.length} sections completed
            </span>
            <div className="flex space-x-2">
              {!currentSession ? (
                <Button size="sm" onClick={startStudySession}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Session
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={endStudySession}>
                  <Pause className="h-4 w-4 mr-2" />
                  End Session
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Instructor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{classInfo.instructor}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{classInfo.duration}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Content Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>{classInfo.content.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span>{studySessions.reduce((total, session) => total + session.duration, 0)}s</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Content Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Content Navigation */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Navigation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {classInfo.content.map((content, index) => (
                      <Button
                        key={content.id}
                        variant={index === currentContentIndex ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentContentIndex(index)}
                        className="h-auto p-3 flex flex-col items-start space-y-2"
                      >
                        <div className="flex items-center space-x-2 w-full">
                          {completedContent.has(content.id) ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                          <span className="text-xs">{index + 1}</span>
                        </div>
                        <div className="flex items-center space-x-2 w-full">
                          {getContentTypeIcon(content.type)}
                          <span className="text-xs font-medium truncate">{content.title}</span>
                        </div>
                        <div className="flex items-center space-x-1 w-full">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(content.id);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            {bookmarkedContent.has(content.id) ? (
                              <BookmarkCheck className="h-3 w-3 text-blue-500" />
                            ) : (
                              <Bookmark className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              shareContent(content);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Share2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Current Content */}
              {currentContent && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CardTitle>{currentContent.title}</CardTitle>
                        {getContentTypeIcon(currentContent.type)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markContentCompleted(currentContent.id)}
                        >
                          {completedContent.has(currentContent.id) ? "Completed" : "Mark Complete"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTTS(currentContent.text)}
                          disabled={isPlaying}
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          {isPlaying ? "Playing" : "Listen"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-lg leading-relaxed">{currentContent.text}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quiz Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Take Quiz</CardTitle>
                  <CardDescription>Test your knowledge of this class</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link to={`/quiz/${classInfo.id}`}>Start Quiz</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Chat Section */}
            <div className="space-y-6">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle>AI Study Assistant</CardTitle>
                  <CardDescription>Ask questions about the class content</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-4">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto space-y-3">
                    {chatHistory.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                    {isGeneratingAI && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-3 py-2">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span className="text-sm">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type your message..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleSTT}
                        disabled={isListening}
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!chatMessage.trim() || isGeneratingAI}
                      className="w-full"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Note */}
            <Card>
              <CardHeader>
                <CardTitle>Add Study Note</CardTitle>
                <CardDescription>Take notes on the current content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Write your study note here..."
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  rows={4}
                />
                <Button onClick={addStudyNote} disabled={!currentNote.trim()}>
                  <FileText className="h-4 w-4 mr-2" />
                  Save Note
                </Button>
              </CardContent>
            </Card>

            {/* View Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Study Notes</CardTitle>
                <CardDescription>Your personal notes for this class</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {studyNotes.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No notes yet. Start taking notes to see them here!
                    </p>
                  ) : (
                    studyNotes.map((note) => (
                      <div key={note.id} className="border rounded-lg p-3">
                        <p className="text-sm mb-2">{note.note}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {classInfo.content.find(c => c.id === note.contentId)?.title || 'Unknown Content'}
                          </span>
                          <span>{note.timestamp.toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Study Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Study Sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studySessions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No study sessions yet
                    </p>
                  ) : (
                    studySessions.slice(-5).reverse().map((session) => (
                      <div key={session.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            {session.startTime.toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.startTime.toLocaleTimeString()}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {Math.floor(session.duration / 60)}m {session.duration % 60}s
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progress Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Progress Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completion Rate</span>
                    <span className="text-lg font-bold">{Math.round(progress)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sections Completed</span>
                    <span className="text-lg font-bold">{completedContent.size}/{classInfo.content.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bookmarked</span>
                    <span className="text-lg font-bold">{bookmarkedContent.size}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>Learning Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium mb-2">Study Recommendations:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      {progress < 25 && <li>• Start with the first few sections</li>}
                      {progress >= 25 && progress < 75 && <li>• Focus on completing core content</li>}
                      {progress >= 75 && <li>• Review completed sections</li>}
                      {progress >= 90 && <li>• Take the quiz to test knowledge</li>}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default ClassDetail;
