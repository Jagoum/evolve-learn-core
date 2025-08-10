const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000'

export class FastAPIClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = FASTAPI_BASE_URL
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return response.json()
  }

  // AI-powered question generation
  async generateQuestions(
    topic: string,
    difficulty: string,
    questionType: string,
    count: number = 5
  ): Promise<any[]> {
    return this.request('/ai/generate-questions', {
      method: 'POST',
      body: JSON.stringify({
        topic,
        difficulty,
        question_type: questionType,
        count,
      }),
    })
  }

  // Student progress analysis
  async analyzeStudentProgress(studentId: string, classId: string): Promise<any> {
    return this.request(`/ai/analyze-progress/${studentId}/${classId}`)
  }

  // Generate AI report
  async generateAIReport(
    studentId: string,
    classId: string,
    reportType: string
  ): Promise<any> {
    return this.request('/ai/generate-report', {
      method: 'POST',
      body: JSON.stringify({
        student_id: studentId,
        class_id: classId,
        report_type: reportType,
      }),
    })
  }

  // Content recommendation
  async getContentRecommendations(
    studentId: string,
    subject: string,
    learningStyle: string
  ): Promise<any[]> {
    return this.request(`/ai/recommend-content/${studentId}`, {
      method: 'POST',
      body: JSON.stringify({
        subject,
        learning_style: learningStyle,
      }),
    })
  }

  // Study path optimization
  async optimizeStudyPath(
    studentId: string,
    currentProgress: any
  ): Promise<any> {
    return this.request('/ai/optimize-study-path', {
      method: 'POST',
      body: JSON.stringify({
        student_id: studentId,
        current_progress: currentProgress,
      }),
    })
  }

  // Message moderation
  async moderateMessage(message: string): Promise<{
    is_appropriate: boolean
    confidence: number
    reason?: string
  }> {
    return this.request('/ai/moderate-message', {
      method: 'POST',
      body: JSON.stringify({ message }),
    })
  }

  // Quiz difficulty adjustment
  async adjustQuizDifficulty(
    studentId: string,
    quizId: string,
    performance: number
  ): Promise<any> {
    return this.request('/ai/adjust-quiz-difficulty', {
      method: 'POST',
      body: JSON.stringify({
        student_id: studentId,
        quiz_id: quizId,
        performance,
      }),
    })
  }

  // Learning style detection
  async detectLearningStyle(
    studentId: string,
    interactionData: any[]
  ): Promise<{
    learning_style: string
    confidence: number
    recommendations: string[]
  }> {
    return this.request('/ai/detect-learning-style', {
      method: 'POST',
      body: JSON.stringify({
        student_id: studentId,
        interaction_data: interactionData,
      }),
    })
  }
}

// Create a singleton instance
export const fastAPIClient = new FastAPIClient() 