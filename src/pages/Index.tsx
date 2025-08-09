import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSEO } from "@/hooks/useSEO";

const Index = () => {
  useSEO({ title: "AI Learning Platform - Home", description: "Adaptive learning with quizzes, TTS/STT, and class chat.", canonical: window.location.href });
  const { user } = useAuth();

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
      <section className="mx-auto max-w-3xl text-center px-4">
        <h1 className="text-5xl font-bold mb-4">AI-Powered Adaptive Learning</h1>
        <p className="text-lg text-muted-foreground mb-6">Learn smarter with interactive content, voice features, and quick assessments.</p>
        <div className="flex items-center justify-center gap-3">
          {user ? (
            <Button asChild>
              <Link to="/classes">Go to Classes</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <a href="#features">Explore Features</a>
          </Button>
        </div>
        <div id="features" className="mt-10 grid sm:grid-cols-3 gap-4 text-left">
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-1">Classes</h2>
            <p className="text-sm text-muted-foreground">Create and join classes with mock data.</p>
          </div>
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-1">Voice</h2>
            <p className="text-sm text-muted-foreground">Try built-in browser TTS/STT for a quick demo.</p>
          </div>
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-1">Quizzes</h2>
            <p className="text-sm text-muted-foreground">Answer MCQs and get instant feedback.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
