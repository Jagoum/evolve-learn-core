import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSEO } from "@/hooks/useSEO";
import { toast } from "@/components/ui/use-toast";

const defaultClasses = [
  { id: "math-101", name: "Math 101", description: "Foundations of algebra and geometry." },
  { id: "sci-201", name: "Science 201", description: "Explore physics and chemistry basics." },
];

type Role = "teacher" | "student" | "parent";

const getRole = (): Role => (localStorage.getItem("role") as Role) || "student";
const setRole = (r: Role) => localStorage.setItem("role", r);

const Classes = () => {
  useSEO({ title: "Classes - AI Learning", description: "Browse your classes and start learning.", canonical: window.location.href });

  const [role, setRoleState] = useState<Role>(getRole());
  const [list, setList] = useState(defaultClasses);
  const [newClass, setNewClass] = useState("");

  useEffect(() => setRole(role), [role]);

  const filtered = useMemo(() => list, [list]);

  const createClass = () => {
    if (!newClass.trim()) return;
    const id = newClass.toLowerCase().replace(/\s+/g, "-") + "-" + Math.floor(Math.random() * 1000);
    setList([{ id, name: newClass, description: "Newly created class." }, ...list]);
    setNewClass("");
    toast({ title: "Class created" });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Your Classes</h1>

      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-muted-foreground">Role:</span>
        <div className="flex gap-2">
          {(["student", "teacher", "parent"] as Role[]).map((r) => (
            <Button key={r} size="sm" variant={role === r ? "default" : "outline"} onClick={() => setRoleState(r)}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {role === "teacher" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create a class</CardTitle>
            <CardDescription>Mock create only (no DB yet)</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input value={newClass} onChange={(e) => setNewClass(e.target.value)} placeholder="e.g., History 101" />
            <Button onClick={createClass}>Create</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle>{c.name}</CardTitle>
              <CardDescription>{c.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button asChild>
                  <Link to={`/classes/${c.id}`}>Open</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to={`/quiz/${c.id}`}>Take quiz</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default Classes;
