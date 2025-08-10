import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ArrowLeft, Timer } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const mockQuiz = {
  id: "1",
  title: "Mathematics Fundamentals Quiz",
  description: "Test your knowledge of basic mathematics concepts including algebra and geometry.",
  questions: [
    {
      id: 1,
      question: "What is the value of x in the equation 2x + 5 = 13?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1,
      explanation: "2x + 5 = 13 → 2x = 8 → x = 4"
    },
    {
      id: 2,
      question: "What is the area of a circle with radius 5 units?",
      options: ["25π", "50π", "75π", "100π"],
      correctAnswer: 0,
      explanation: "Area = πr² = π(5)² = 25π"
    },
    {
      id: 3,
      question: "Solve for y: 3y - 7 = 8",
      options: ["3", "4", "5", "6"],
      correctAnswer: 2,
      explanation: "3y - 7 = 8 → 3y = 15 → y = 5"
    },
    {
      id: 4,
      question: "What is the slope of the line passing through points (2,3) and (4,7)?",
      options: ["1", "2", "3", "4"],
      correctAnswer: 1,
      explanation: "Slope = (7-3)/(4-2) = 4/2 = 2"
    },
    {
      id: 5,
      question: "What is the square root of 144?",
      options: ["10", "11", "12", "13"],
      correctAnswer: 2,
      explanation: "12 × 12 = 144, so √144 = 12"
    }
  ],
  timeLimit: 300, // 5 minutes in seconds
  passingScore: 80
};

const Quiz = () => {
  const { id } = useParams();
  useSEO({ 
    title: `Quiz - ${mockQuiz.title}`, 
    description: mockQuiz.description,
    canonical: window.location.href 
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(mockQuiz.timeLimit);
  const [quizStarted, setQuizStarted] = useState(false);

  const startQuiz = () => {
    setQuizStarted(true);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < mockQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = () => {
    setShowResults(true);
    setQuizStarted(false);
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === mockQuiz.questions[index].correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / mockQuiz.questions.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quizStarted && !showResults) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to={`/classes/${id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Class
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{mockQuiz.title}</CardTitle>
            <CardDescription>{mockQuiz.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                <span>Time Limit: {formatTime(mockQuiz.timeLimit)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Questions: {mockQuiz.questions.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Passing Score: {mockQuiz.passingScore}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Type: Multiple Choice</span>
              </div>
            </div>
            
            <Button onClick={startQuiz} className="w-full" size="lg">
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const passed = score >= mockQuiz.passingScore;
    
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Quiz Results</CardTitle>
            <CardDescription>Here's how you performed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{score}%</div>
              <Badge variant={passed ? "default" : "destructive"} className="text-lg">
                {passed ? "PASSED" : "FAILED"}
              </Badge>
            </div>
            
            <div className="space-y-4">
              {mockQuiz.questions.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium mb-2">
                          Question {index + 1}: {question.question}
                        </p>
                        <div className="space-y-1">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`text-sm p-2 rounded ${
                                optionIndex === question.correctAnswer
                                  ? "bg-green-100 text-green-800"
                                  : optionIndex === userAnswer && !isCorrect
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100"
                              }`}
                            >
                              {option}
                              {optionIndex === question.correctAnswer && " ✓"}
                              {optionIndex === userAnswer && !isCorrect && " ✗"}
                            </div>
                          ))}
                        </div>
                        {!isCorrect && (
                          <p className="text-sm text-muted-foreground mt-2">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link to={`/classes/${id}`}>Back to Class</Link>
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = mockQuiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / mockQuiz.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Question {currentQuestion + 1} of {mockQuiz.questions.length}</span>
          <span className="text-red-600 font-medium">
            <Timer className="h-4 w-4 inline mr-1" />
            {formatTime(timeLeft)}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
          <CardDescription>{currentQ.question}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {currentQ.options.map((option, index) => (
              <Button
                key={index}
                variant={answers[currentQuestion] === index ? "default" : "outline"}
                className="w-full justify-start h-auto p-4 text-left"
                onClick={() => handleAnswer(index)}
              >
                <span className="mr-3 font-medium">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </div>
          
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            {currentQuestion === mockQuiz.questions.length - 1 ? (
              <Button onClick={submitQuiz} disabled={answers[currentQuestion] === undefined}>
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={nextQuestion} disabled={answers[currentQuestion] === undefined}>
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;
