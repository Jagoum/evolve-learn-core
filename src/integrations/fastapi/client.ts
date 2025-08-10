import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class FastAPIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast({
        title: "API Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { error: errorMessage };
    }
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    return this.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string, role: string = 'student') {
    return this.request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
  }

  async getCurrentUser() {
    return this.request('/api/v1/auth/me');
  }

  async logout() {
    const result = await this.request('/api/v1/auth/logout', {
      method: 'POST',
    });
    if (result.data) {
      this.clearToken();
    }
    return result;
  }

  // Classes endpoints
  async getClasses() {
    return this.request('/api/v1/classes');
  }

  async getClass(classId: string) {
    return this.request(`/api/v1/classes/${classId}`);
  }

  async createClass(classData: {
    title: string;
    description: string;
    instructor: string;
    duration: string;
    difficulty: string;
  }) {
    return this.request('/api/v1/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  }

  async updateClass(classId: string, classData: {
    title: string;
    description: string;
    instructor: string;
    duration: string;
    difficulty: string;
  }) {
    return this.request(`/api/v1/classes/${classId}`, {
      method: 'PUT',
      body: JSON.stringify(classData),
    });
  }

  async deleteClass(classId: string) {
    return this.request(`/api/v1/classes/${classId}`, {
      method: 'DELETE',
    });
  }

  // Quiz endpoints
  async getQuizzes() {
    return this.request('/api/v1/quiz');
  }

  async getQuiz(quizId: string) {
    return this.request(`/api/v1/quiz/${quizId}`);
  }

  async submitQuiz(quizId: string, answers: Array<{ question_id: string; answer: string }>) {
    return this.request(`/api/v1/quiz/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ quiz_id: quizId, answers }),
    });
  }

  async getQuizResults(quizId: string) {
    return this.request(`/api/v1/quiz/${quizId}/results`);
  }

  // Study Room endpoints
  async getStudyRooms() {
    return this.request('/api/v1/study-room');
  }

  async createStudyRoom(roomData: {
    name: string;
    description?: string;
    max_users?: number;
    is_private?: boolean;
  }) {
    return this.request('/api/v1/study-room', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  }

  async joinStudyRoom(roomId: string) {
    return this.request('/api/v1/study-room/join', {
      method: 'POST',
      body: JSON.stringify({ room_id: roomId }),
    });
  }

  async leaveStudyRoom(roomId: string) {
    return this.request('/api/v1/study-room/leave', {
      method: 'POST',
      body: JSON.stringify({ room_id: roomId }),
    });
  }

  // AI endpoints
  async generateContent(request: {
    prompt: string;
    content_type: string;
    difficulty?: string;
    max_length?: number;
  }) {
    return this.request('/api/v1/ai/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async moderateContent(content: string, contentType: string = 'text') {
    return this.request('/api/v1/ai/moderate', {
      method: 'POST',
      body: JSON.stringify({ content, content_type: contentType }),
    });
  }

  async generateLearningPath(request: {
    user_id: string;
    subject: string;
    current_level: string;
    goals: string[];
  }) {
    return this.request('/api/v1/ai/learning-path', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async explainConcept(concept: string, difficulty: string = 'intermediate', maxLength: number = 500) {
    return this.request('/api/v1/ai/explain', {
      method: 'POST',
      body: JSON.stringify({
        prompt: concept,
        content_type: 'explanation',
        difficulty,
        max_length: maxLength,
      }),
    });
  }

  async generateQuiz(topic: string, difficulty: string = 'intermediate') {
    return this.request('/api/v1/ai/quiz-generation', {
      method: 'POST',
      body: JSON.stringify({
        prompt: topic,
        content_type: 'quiz',
        difficulty,
      }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const fastapiClient = new FastAPIClient();
export default fastapiClient; 