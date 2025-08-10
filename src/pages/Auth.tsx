import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { useSEO } from "@/hooks/useSEO";
import { Brain, GraduationCap, Users, Settings } from "lucide-react";

const Auth = () => {
  useSEO({ title: "Login or Signup - AI Learning", description: "Login or create an account to access your AI-powered learning dashboard.", canonical: window.location.href });

  const { signIn, signUp, enableDemoMode } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Sign in failed", description: error });
    } else {
      toast({ title: "Welcome back!" });
      navigate("/student");
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Sign up failed", description: error });
    } else {
      toast({ title: "Check your email", description: "Confirm your address to finish signup." });
    }
  };

  const handleDemoMode = (role: 'student' | 'teacher' | 'parent' | 'admin') => {
    enableDemoMode(role);
    toast({ title: `Demo mode enabled`, description: `You are now logged in as a ${role}` });
    navigate(`/${role}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Brain className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold">Welcome to EvolveLearn</h1>
          <p className="text-muted-foreground mt-2">Sign in or try our demo to explore the platform</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Demo Mode Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Try Demo Mode
              </CardTitle>
              <CardDescription>
                Explore the platform with different user roles. No registration required.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => handleDemoMode('student')}
                >
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                  <span className="text-sm">Student</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => handleDemoMode('teacher')}
                >
                  <Users className="h-6 w-6 text-green-600" />
                  <span className="text-sm">Teacher</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => handleDemoMode('parent')}
                >
                  <Settings className="h-6 w-6 text-purple-600" />
                  <span className="text-sm">Parent</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => handleDemoMode('admin')}
                >
                  <Brain className="h-6 w-6 text-orange-600" />
                  <span className="text-sm">Admin</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Demo mode provides full access to all features for testing purposes
              </p>
            </CardContent>
          </Card>

          {/* Login/Signup Section */}
          <Card>
            <CardHeader>
              <CardTitle>Account Access</CardTitle>
              <CardDescription>Sign in or create an account</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                  </div>
                  <Button className="w-full" onClick={handleSignIn} disabled={loading}>
                    {loading ? "Please wait..." : "Sign In"}
                  </Button>
                </TabsContent>
                <TabsContent value="signup" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email2">Email</Label>
                    <Input id="email2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password2">Password</Label>
                    <Input id="password2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" />
                  </div>
                  <Button className="w-full" onClick={handleSignUp} disabled={loading}>
                    {loading ? "Please wait..." : "Create account"}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Auth;
