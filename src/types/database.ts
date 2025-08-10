export interface User {
  id: string
  email: string
  role: 'student' | 'teacher' | 'parent' | 'admin'
  first_name: string
  last_name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Student extends User {
  role: 'student'
  grade_level: string
  parent_id: string
  teacher_id: string
  learning_style: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
  current_subject?: string
  progress_score: number
}

export interface Teacher extends User {
  role: 'teacher'
  subjects: string[]
  experience_years: number
  bio?: string
  is_verified: boolean
}

export interface Parent extends User {
  role: 'parent'
  children_ids: string[]
  phone?: string
  address?: string
}

export interface Class {
  id: string
  name: string
  description: string
  subject: string
  teacher_id: string
  students: string[]
  is_online: boolean
  meeting_link?: string
  schedule?: string
  created_at: string
  updated_at: string
}

export interface StudyMaterial {
  id: string
  class_id: string
  title: string
  description: string
  type: 'video' | 'pdf' | 'text' | 'audio' | 'interactive'
  content_url: string
  duration_minutes?: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Quiz {
  id: string
  class_id: string
  title: string
  description: string
  questions: QuizQuestion[]
  time_limit_minutes: number
  passing_score: number
  is_ai_generated: boolean
  teacher_approved: boolean
  created_at: string
  updated_at: string
}

export interface QuizQuestion {
  id: string
  question: string
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay'
  options?: string[]
  correct_answer: string
  explanation?: string
  points: number
}

export interface StudentProgress {
  id: string
  student_id: string
  class_id: string
  material_id: string
  completion_percentage: number
  time_spent_minutes: number
  quiz_scores: number[]
  last_accessed: string
  created_at: string
  updated_at: string
}

export interface AIReport {
  id: string
  student_id: string
  class_id: string
  report_type: 'performance' | 'behavior' | 'recommendation'
  content: string
  ai_generated: boolean
  teacher_modified: boolean
  sent_to_parent: boolean
  created_at: string
  updated_at: string
}

export interface StudyGroup {
  id: string
  name: string
  description: string
  creator_id: string
  members: string[]
  class_id?: string
  is_public: boolean
  max_members: number
  created_at: string
  updated_at: string
}

export interface GroupMessage {
  id: string
  group_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'image' | 'file' | 'voice'
  ai_moderated: boolean
  is_appropriate: boolean
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'progress' | 'quiz' | 'message' | 'reminder'
  is_read: boolean
  action_url?: string
  created_at: string
}

export interface StudySession {
  id: string
  student_id: string
  material_id: string
  start_time: string
  end_time?: string
  duration_minutes: number
  activities: StudyActivity[]
  created_at: string
}

export interface StudyActivity {
  id: string
  session_id: string
  activity_type: 'reading' | 'watching' | 'listening' | 'quiz' | 'note_taking'
  duration_minutes: number
  notes?: string
  created_at: string
} 