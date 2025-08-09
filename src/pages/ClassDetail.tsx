import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useSEO } from "@/hooks/useSEO";

const mockContent = [
  { id: "c1", title: "Introduction", text: "Welcome to the course. This is an introduction to the main topics." },
  { id: "c2", title: "Chapter 1", text: "In this chapter we will cover basics with examples and exercises." },
];

const useTTS = () => {
  const speak = (text: string) => {
    if (typeof window === 'undefined') return;
    if (!("speechSynthesis" in window)) {
      alert("Speech Synthesis not supported in this browser.");
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };
  const stop = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  };
  return { speak, stop };
};

const useSTT = () => {
  const recognitionRef = useRef<any | null>(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const Rec = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (Rec) {
      recognitionRef.current = new Rec();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
    }
  }, []);

  const start = (onResult: (t: string) => void) => {
    const rec = recognitionRef.current;
    if (!rec) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join(" ");
      onResult(transcript);
    };
    rec.onend = () => setListening(false);
    rec.start();
    setListening(true);
  };
  const stop = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };
  return { start, stop, listening };
};

const ClassDetail = () => {
  const { id } = useParams();
  useSEO({ title: `${id} - Class Detail`, description: `View content and interact with class ${id}.`, canonical: window.location.href });

  const [notes, setNotes] = useState("");
  const { speak, stop } = useTTS();
  const stt = useSTT();

  const items = useMemo(() => mockContent, []);
  const [chat, setChat] = useState<{ role: 'student' | 'teacher'; text: string }[]>([
    { role: 'teacher', text: 'Welcome to the class chat! Feel free to ask questions.' }
  ]);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message.trim()) return;
    setChat((c) => [...c, { role: 'student', text: message }]);
    setMessage("");
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <h1 className="text-3xl font-bold">Class: {id}</h1>

      <section className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>Tap to listen (mock TTS) or record notes (mock STT)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((it) => (
              <div key={it.id} className="border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">{it.title}</h2>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => speak(it.text)}>Listen</Button>
                    <Button size="sm" variant="ghost" onClick={stop}>Stop</Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{it.text}</p>
              </div>
            ))}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your notes</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Record or type notes here" />
              <div className="flex gap-2">
                {!stt.listening ? (
                  <Button size="sm" onClick={() => stt.start((t) => setNotes((n) => n + (n ? "\n" : "") + t))}>Record (STT)</Button>
                ) : (
                  <Button size="sm" variant="destructive" onClick={stt.stop}>Stop</Button>
                )}
                <Button asChild variant="secondary" size="sm"><Link to={`/quiz/${id}`}>Take Quiz</Link></Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Class Chat (mock)</CardTitle>
            <CardDescription>Student/Teacher simple chat</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col h-[420px]">
            <div className="flex-1 overflow-auto space-y-2 pr-1">
              {chat.map((m, idx) => (
                <div key={idx} className={`p-2 rounded-md ${m.role === 'student' ? 'bg-secondary' : 'bg-accent'}`}>
                  <span className="text-xs uppercase tracking-wide mr-2 opacity-60">{m.role}</span>
                  <span>{m.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message" />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default ClassDetail;
