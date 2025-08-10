import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Users, 
  Clock, 
  Calendar,
  Play,
  Pause,
  Mic,
  MicOff,
  Send,
  FileText,
  Video,
  Headphones
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const mockClassData = {
  id: "1",
  name: "Introduction to Mathematics",
  description: "Learn the fundamentals of mathematics including algebra, geometry, and calculus.",
  teacher: "Dr. Sarah Johnson",
  students: 24,
  duration: "12 weeks",
  level: "Beginner",
  subject: "Mathematics",
  progress: 35,
  modules: [
    {
      id: "m1",
      title: "Module 1: Basic Algebra",
      description: "Introduction to algebraic expressions and equations",
      duration: "2 weeks",
      completed: true,
      content: [
        { id: "c1", title: "Introduction to Variables", type: "video", duration: "15 min" },
        { id: "c2", title: "Solving Linear Equations", type: "reading", duration: "20 min" },
        { id: "c3", title: "Algebra Quiz 1", type: "quiz", duration: "30 min" }
      ]
    },
    {
      id: "m2",
      title: "Module 2: Geometry Basics",
      description: "Understanding shapes, angles, and basic geometric concepts",
      duration: "3 weeks",
      completed: false,
      content: [
        { id: "c4", title: "Points, Lines, and Planes", type: "video", duration: "18 min" },
        { id: "c5", title: "Angles and Triangles", type: "reading", duration: "25 min" },
        { id: "c6", title: "Geometry Quiz 1", type: "quiz", duration: "35 min" }
      ]
    },
    {
      id: "m3",
      title: "Module 3: Introduction to Calculus",
      description: "Basic concepts of limits and derivatives",
      duration: "4 weeks",
      completed: false,
      content: [
        { id: "c7", title: "Understanding Limits", type: "video", duration: "22 min" },
        { id: "c8", title: "Derivatives Basics", type: "reading", duration: "30 min" },
        { id: "c9", title: "Calculus Quiz 1", type: "quiz", duration: "40 min" }
      ]
    }
  ]
};

const ClassDetail = () => {
  const { id } = useParams();
  useSEO({ 
    title: `${mockClassData.name} - Class Detail`, 
    description: mockClassData.description,
    canonical: window.location.href 
  });

  const [notes, setNotes] = useState("");
  const [chat, setChat] = useState<{ role: 'student' | 'teacher'; text: string; timestamp: Date }[]>([
    { role: 'teacher', text: 'Welcome to the class! Feel free to ask questions or discuss topics.', timestamp: new Date() }
  ]);
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMessage = { role: 'student' as const, text: message, timestamp: new Date() };
    setChat(prev => [...prev, newMessage]);
    setMessage("");
    
    // Simulate teacher response
    setTimeout(() => {
      const teacherResponse = { 
        role: 'teacher' as const, 
        text: 'Great question! Let me know if you need more clarification.', 
        timestamp: new Date() 
      };
      setChat(prev => [...prev, teacherResponse]);
    }, 1000);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate speech recognition
      setTimeout(() => {
        setNotes(prev => prev + (prev ? "\n" : "") + "This is a simulated speech-to-text input for demo purposes.");
        setIsListening(false);
      }, 2000);
    }
  };

  const togglePlaying = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{mockClassData.name}</h1>
          <p className="text-muted-foreground mt-2">{mockClassData.description}</p>
        </div>
        <Button asChild>
          <Link to="/student/classes">Back to Classes</Link>
        </Button>
      </div>

      {/* Class Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm">{mockClassData.students} students</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm">{mockClassData.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-600" />
              <span className="text-sm">{mockClassData.level}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span className="text-sm">{mockClassData.subject}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>Track your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">{mockClassData.progress}%</span>
                </div>
                <Progress value={mockClassData.progress} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {mockClassData.modules.filter(m => m.completed).length} of {mockClassData.modules.length} modules completed
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modules */}
          <Card>
            <CardHeader>
              <CardTitle>Course Modules</CardTitle>
              <CardDescription>Work through the course content at your own pace</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockClassData.modules.map((module) => (
                  <div key={module.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{module.title}</h3>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={module.completed ? "default" : "secondary"}>
                          {module.completed ? "Completed" : "In Progress"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{module.duration}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {module.content.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            {item.type === 'video' && <Play className="h-4 w-4 text-blue-600" />}
                            {item.type === 'reading' && <FileText className="h-4 w-4 text-green-600" />}
                            {item.type === 'quiz' && <Headphones className="h-4 w-4 text-purple-600" />}
                            <span className="text-sm">{item.title}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{item.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Your Notes</CardTitle>
              <CardDescription>Record your thoughts and key points</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                placeholder="Type or record your notes here..."
                rows={4}
              />
              <div className="flex gap-2">
                <Button 
                  variant={isListening ? "destructive" : "outline"} 
                  onClick={toggleListening}
                  size="sm"
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {isListening ? "Stop Recording" : "Record Notes"}
                </Button>
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Play Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link to={`/quiz/${id}`}>Take Quiz</Link>
              </Button>
              <Button variant="outline" className="w-full">
                <Video className="h-4 w-4 mr-2" />
                Join Live Session
              </Button>
              <Button variant="outline" className="w-full">
                <Headphones className="h-4 w-4 mr-2" />
                Audio Mode
              </Button>
            </CardContent>
          </Card>

          {/* Class Chat */}
          <Card>
            <CardHeader>
              <CardTitle>Class Chat</CardTitle>
              <CardDescription>Ask questions and discuss with classmates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-64 overflow-y-auto space-y-2 pr-1">
                {chat.map((message, index) => (
                  <div 
                    key={index} 
                    className={`p-2 rounded-md text-sm ${
                      message.role === 'student' 
                        ? 'bg-blue-100 text-blue-900 ml-4' 
                        : 'bg-gray-100 text-gray-900 mr-4'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium uppercase">
                        {message.role}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p>{message.text}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;
