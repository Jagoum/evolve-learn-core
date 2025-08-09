import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const onLogout = async () => {
    await signOut();
    if (location.pathname !== "/") window.location.href = "/";
  };

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-lg">AI Learn</Link>
          <div className="hidden sm:flex items-center gap-3 text-sm">
            <Link to="/classes" className="hover:underline">Classes</Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
              <Button variant="outline" size="sm" onClick={onLogout}>Logout</Button>
            </>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">Login</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
