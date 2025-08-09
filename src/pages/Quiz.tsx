import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useSEO } from "@/hooks/useSEO";
import { toast } from "@/components/ui/use-toast";

const mockQuiz = [
  { id: 'q1', question: 'What is 2 + 2?', options: ['3', '4', '5'], answer: '4' },
  { id: 'q2', question: 'Water chemical formula?', options: ['H2O', 'CO2', 'NaCl'], answer: 'H2O' },
  { id: 'q3', question: 'Earth is the ___ planet from the Sun.', options: ['second', 'third', 'fourth'], answer: 'third' },
];

const Quiz = () => {
  const { id } = useParams();
  useSEO({ title: `Quiz - ${id}`, description: `Take the quiz for class ${id}.`, canonical: window.location.href });

  const quiz = useMemo(() => mockQuiz, []);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => quiz.filter(q => answers[q.id] === q.answer).length, [answers, quiz]);

  const onSubmit = () => {
    if (Object.keys(answers).length < quiz.length) {
      toast({ title: "Answer all questions", description: "Please complete the quiz." });
      return;
    }
    setSubmitted(true);
    toast({ title: "Quiz submitted", description: `Score: ${score}/${quiz.length}` });
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Quiz: {id}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Multiple Choice</CardTitle>
          <CardDescription>Mock grading in-browser</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {quiz.map((q) => (
            <div key={q.id} className="space-y-3">
              <p className="font-medium">{q.question}</p>
              <RadioGroup value={answers[q.id] ?? ""} onValueChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}>
                {q.options.map((opt) => (
                  <div key={opt} className="flex items-center space-x-2">
                    <RadioGroupItem id={`${q.id}-${opt}`} value={opt} />
                    <Label htmlFor={`${q.id}-${opt}`}>{opt}</Label>
                  </div>
                ))}
              </RadioGroup>
              {submitted && (
                <p className={`text-sm ${answers[q.id] === q.answer ? 'text-green-600' : 'text-red-600'}`}>
                  {answers[q.id] === q.answer ? 'Correct' : `Incorrect. Answer: ${q.answer}`}
                </p>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">Score: {score}/{quiz.length}</p>
            <Button onClick={onSubmit}>Submit</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Quiz;
