import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, GraduationCap, Users, Settings } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const Index = () => {
  useSEO({ 
    title: "EvolveLearn - AI-Powered Learning Platform", 
    description: "Transform your learning experience with AI-powered education tools for students, teachers, and parents.",
    canonical: window.location.href 
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Brain className="h-20 w-20 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">EvolveLearn</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the future of education with AI-powered learning tools designed for students, teachers, and parents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/auth">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/auth">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Choose Your Experience
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <GraduationCap className="h-16 w-16 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Student</CardTitle>
                <CardDescription>
                  Access personalized learning content, AI tutoring, and track your progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/student">Student Dashboard</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Users className="h-16 w-16 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Teacher</CardTitle>
                <CardDescription>
                  Create engaging content, manage classes, and monitor student performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/teacher">Teacher Dashboard</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Settings className="h-16 w-16 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Parent</CardTitle>
                <CardDescription>
                  Monitor your child's progress and stay connected with teachers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/parent">Parent Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Try the Demo
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Explore the platform with our demo accounts. No registration required for testing.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <Button asChild variant="outline" size="lg">
              <Link to="/student">Student Demo</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/teacher">Teacher Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
