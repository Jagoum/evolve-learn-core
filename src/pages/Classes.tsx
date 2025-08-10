import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Users, 
  Clock, 
  BookOpen, 
  Tag,
  Calendar,
  Target,
  Play
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { mockClasses } from "@/lib/mockData";

const Classes = () => {
  useSEO({ 
    title: "Classes - EvolveLearn", 
    description: "Browse and enroll in available classes.",
    canonical: window.location.href 
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Available Classes</h1>
          <p className="text-muted-foreground mt-2">
            Discover and enroll in courses that match your interests and skill level
          </p>
        </div>
        <Button asChild>
          <Link to="/student">Back to Dashboard</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockClasses.map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <Badge variant="secondary">{classItem.subject}</Badge>
                </div>
                <Badge variant={classItem.level === 'beginner' ? 'default' : classItem.level === 'intermediate' ? 'secondary' : 'destructive'}>
                  {classItem.level}
                </Badge>
              </div>
              <CardTitle className="text-lg">{classItem.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {classItem.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{classItem.teacher.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{classItem.currentStudents}/{classItem.maxStudents} students enrolled</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{classItem.duration} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{classItem.schedule}</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{classItem.progress}%</span>
                </div>
                <Progress value={classItem.progress} className="h-2" />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {classItem.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <Button asChild size="sm" className="flex-1 mr-2">
                  <Link to={`/classes/${classItem.id}`}>View Details</Link>
                </Button>
                <Button size="sm" variant="outline">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          More classes coming soon! Check back regularly for new offerings.
        </p>
        <Button variant="outline" asChild>
          <Link to="/student">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default Classes;
