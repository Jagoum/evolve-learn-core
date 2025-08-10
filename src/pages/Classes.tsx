import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { fastapiClient } from "@/integrations/fastapi/client";
import { useSEO } from "@/hooks/useSEO";
import { toast } from "@/components/ui/use-toast";

interface ClassInfo {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  difficulty: string;
  content: Array<{
    id: string;
    title: string;
    text: string;
    order: number;
    type: string;
  }>;
}

const Classes = () => {
  useSEO({ title: "Classes - AI Learning", description: "Browse and enroll in AI-powered learning classes.", canonical: window.location.href });

  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fastapiClient.getClasses();
        if (response.data) {
          setClasses(response.data);
        } else if (response.error) {
          toast({
            title: "Error",
            description: "Failed to fetch classes: " + response.error,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch classes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="text-center">Loading classes...</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Available Classes</h1>
        {user && (
          <Button asChild>
            <Link to="/classes/create">Create Class</Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{classItem.title}</CardTitle>
              <CardDescription>{classItem.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Instructor:</span>
                <span>{classItem.instructor}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Duration:</span>
                <span>{classItem.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Difficulty:</span>
                <Badge variant={classItem.difficulty === 'Beginner' ? 'default' : 'secondary'}>
                  {classItem.difficulty}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Content:</span>
                <span>{classItem.content.length} sections</span>
              </div>
              <Button asChild className="w-full">
                <Link to={`/classes/${classItem.id}`}>View Class</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {classes.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No classes available</h3>
          <p className="text-muted-foreground mb-4">
            Check back later for new learning opportunities.
          </p>
        </div>
      )}
    </main>
  );
};

export default Classes;
