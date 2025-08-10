'use client'

import { useState, useEffect, useRef } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Play, 
  Pause, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  BookOpen,
  PenTool,
  Calculator,
  Palette,
  Save,
  Download,
  Share2,
  Brain
} from 'lucide-react'
import { elevenLabsClient } from '@/integrations/elevenlabs/client'

// Mock data - replace with real API calls
const mockStudyMaterials = [
  {
    id: '1',
    title: 'Introduction to Algebra',
    type: 'video',
    duration: '15:30',
    progress: 65,
    thumbnail: '/placeholder.svg'
  },
  {
    id: '2',
    title: 'Geometric Proofs',
    type: 'pdf',
    pages: 12,
    progress: 0,
    thumbnail: '/placeholder.svg'
  },
  {
    id: '3',
    title: 'Practice Problems Set 1',
    type: 'interactive',
    questions: 20,
    progress: 40,
    thumbnail: '/placeholder.svg'
  }
]

const mockNotes = [
  {
    id: '1',
    title: 'Algebra Notes',
    content: 'Key concepts from today\'s lesson...',
    created: '2024-01-15T10:00:00Z',
    tags: ['algebra', 'equations']
  },
  {
    id: '2',
    title: 'Geometry Formulas',
    content: 'Important formulas to remember...',
    created: '2024-01-14T14:00:00Z',
    tags: ['geometry', 'formulas']
  }
]

export default function StudyRoom() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentMaterial, setCurrentMaterial] = useState(mockStudyMaterials[0])
  const [notes, setNotes] = useState(mockNotes)
  const [currentNote, setCurrentNote] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('21m00Tcm4TlvDq8ikWAM')
  const [playbackRate, setPlaybackRate] = useState(1)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // TTS functionality
  const handleTextToSpeech = async (text: string) => {
    try {
      const audioBuffer = await elevenLabsClient.textToSpeech(text, selectedVoice)
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' })
      const audioUrl = URL.createObjectURL(audioBlob)
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.playbackRate = playbackRate
        audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('TTS error:', error)
    }
  }

  // STT functionality
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        try {
          const text = await elevenLabsClient.speechToText(audioBlob)
          setCurrentNote(prev => prev + ' ' + text)
        } catch (error) {
          console.error('STT error:', error)
        }
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Recording error:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSaveNote = () => {
    if (currentNote.trim()) {
      const newNote = {
        id: Date.now().toString(),
        title: `Note ${notes.length + 1}`,
        content: currentNote,
        created: new Date().toISOString(),
        tags: ['study', 'note']
      }
      setNotes([...notes, newNote])
      setCurrentNote('')
    }
  }

  const handleMaterialSelect = (material: any) => {
    setCurrentMaterial(material)
    // Reset audio when switching materials
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  return (
    <MainLayout userRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Study Room</h1>
            <p className="text-gray-600">Your personalized learning environment</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save Progress
            </Button>
            <Button>
              <Share2 className="mr-2 h-4 w-4" />
              Share Notes
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Study Materials */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Material */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  {currentMaterial.title}
                </CardTitle>
                <CardDescription>
                  {currentMaterial.type === 'video' && `Duration: ${currentMaterial.duration}`}
                  {currentMaterial.type === 'pdf' && `${currentMaterial.pages} pages`}
                  {currentMaterial.type === 'interactive' && `${currentMaterial.questions} questions`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Material Preview</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-600">{currentMaterial.progress}%</span>
                  </div>
                  <Progress value={currentMaterial.progress} className="h-2" />
                </div>

                {/* Audio Controls */}
                <div className="flex items-center space-x-4 mb-4">
                  <Button
                    size="sm"
                    onClick={handlePlayPause}
                    variant={isPlaying ? "default" : "outline"}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>

                  <select
                    value={playbackRate}
                    onChange={(e) => setPlaybackRate(Number(e.target.value))}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                  </select>
                </div>

                <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
              </CardContent>
            </Card>

            {/* Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PenTool className="mr-2 h-5 w-4" />
                  Study Notes
                </CardTitle>
                <CardDescription>Take notes and organize your thoughts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Textarea
                    placeholder="Start typing your notes here..."
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="flex space-x-2 mb-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={isRecording ? 'bg-red-100 text-red-600' : ''}
                  >
                    {isRecording ? <MicOff className="mr-1 h-3 w-3" /> : <Mic className="mr-1 h-3 w-3" />}
                    {isRecording ? 'Stop Recording' : 'Voice Note'}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTextToSpeech(currentNote)}
                    disabled={!currentNote.trim()}
                  >
                    <Volume2 className="mr-1 h-3 w-3" />
                    Listen
                  </Button>
                  
                  <Button size="sm" onClick={handleSaveNote} disabled={!currentNote.trim()}>
                    <Save className="mr-1 h-3 w-3" />
                    Save Note
                  </Button>
                </div>

                {/* Saved Notes */}
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{note.title}</h4>
                        <div className="flex space-x-1">
                          {note.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{note.content}</p>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(note.created).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Study Materials List */}
            <Card>
              <CardHeader>
                <CardTitle>Study Materials</CardTitle>
                <CardDescription>Available learning resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockStudyMaterials.map((material) => (
                    <div
                      key={material.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        currentMaterial.id === material.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleMaterialSelect(material)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{material.title}</h4>
                          <div className="text-xs text-gray-600">
                            {material.type === 'video' && material.duration}
                            {material.type === 'pdf' && `${material.pages} pages`}
                            {material.type === 'interactive' && `${material.questions} questions`}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress value={material.progress} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Study Tools */}
            <Card>
              <CardHeader>
                <CardTitle>Study Tools</CardTitle>
                <CardDescription>Additional learning aids</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-16 flex-col">
                    <Calculator className="h-5 w-5 mb-1" />
                    <span className="text-xs">Calculator</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Palette className="h-5 w-5 mb-1" />
                    <span className="text-xs">Drawing</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Brain className="h-5 w-5 mb-1" />
                    <span className="text-xs">AI Help</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Download className="h-5 w-5 mb-1" />
                    <span className="text-xs">Download</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Voice Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Voice Settings</CardTitle>
                <CardDescription>Customize TTS experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Voice</label>
                    <select
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="w-full mt-1 px-2 py-1 border rounded text-sm"
                    >
                      <option value="21m00Tcm4TlvDq8ikWAM">Rachel (Female)</option>
                      <option value="AZnzlk1XvdvUeBnXmlld">Domi (Female)</option>
                      <option value="EXAVITQu4vr4xnSDxMaL">Bella (Female)</option>
                      <option value="ErXwobaYiN019PkyEjzX">Antoni (Male)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Playback Speed</label>
                    <select
                      value={playbackRate}
                      onChange={(e) => setPlaybackRate(Number(e.target.value))}
                      className="w-full mt-1 px-2 py-1 border rounded text-sm"
                    >
                      <option value={0.5}>0.5x (Slow)</option>
                      <option value={0.75}>0.75x</option>
                      <option value={1}>1x (Normal)</option>
                      <option value={1.25}>1.25x</option>
                      <option value={1.5}>1.5x (Fast)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 