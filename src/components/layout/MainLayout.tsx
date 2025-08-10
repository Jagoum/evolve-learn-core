'use client'

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  GraduationCap,
  UserCheck,
  Brain,
  Calendar,
  FileText,
  Video,
  Headphones
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

interface MainLayoutProps {
  children: React.ReactNode
  userRole?: 'student' | 'teacher' | 'parent' | 'admin'
}

const navigationItems = {
  student: [
    { name: 'Dashboard', href: '/student', icon: Home },
    { name: 'My Classes', href: '/student/classes', icon: GraduationCap },
    { name: 'Study Room', href: '/student/study-room', icon: BookOpen },
    { name: 'Quizzes', href: '/student/quizzes', icon: FileText },
    { name: 'Progress', href: '/student/progress', icon: BarChart3 },
    { name: 'Study Groups', href: '/student/groups', icon: Users },
    { name: 'AI Assistant', href: '/student/ai-assistant', icon: Brain },
    { name: 'Calendar', href: '/student/calendar', icon: Calendar },
  ],
  teacher: [
    { name: 'Dashboard', href: '/teacher', icon: Home },
    { name: 'My Classes', href: '/teacher/classes', icon: GraduationCap },
    { name: 'Students', href: '/teacher/students', icon: Users },
    { name: 'Content', href: '/teacher/content', icon: FileText },
    { name: 'Quizzes', href: '/teacher/quizzes', icon: FileText },
    { name: 'Analytics', href: '/teacher/analytics', icon: BarChart3 },
    { name: 'Reports', href: '/teacher/reports', icon: BarChart3 },
    { name: 'Calendar', href: '/teacher/calendar', icon: Calendar },
  ],
  parent: [
    { name: 'Dashboard', href: '/parent', icon: Home },
    { name: 'Children', href: '/parent/children', icon: Users },
    { name: 'Progress', href: '/parent/progress', icon: BarChart3 },
    { name: 'Reports', href: '/parent/reports', icon: FileText },
    { name: 'Communication', href: '/parent/communication', icon: MessageSquare },
    { name: 'Resources', href: '/parent/resources', icon: BookOpen },
  ],
  admin: [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Classes', href: '/admin/classes', icon: GraduationCap },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]
}

export default function MainLayout({ children, userRole: propUserRole }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut, isDemoMode } = useAuth()

  // Determine user role from props, user metadata, or default to student
  const userRole = propUserRole || 
    (user as any)?.user_metadata?.role || 
    'student'

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  const items = navigationItems[userRole as keyof typeof navigationItems] || navigationItems.student

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">EvolveLearn</span>
            {isDemoMode && (
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                DEMO
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {items.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-blue-50 text-blue-700 border-blue-200"
                  )}
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              )
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="mb-2 text-xs text-gray-500 text-center">
            {user?.email}
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="mr-3 h-5 w-5" />
            {isDemoMode ? 'Exit Demo' : 'Sign Out'}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Headphones className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">Voice Mode</span>
              </div>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <Video className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">Video Mode</span>
              </div>
              <div className="h-6 w-px bg-gray-300" />
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 