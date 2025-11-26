import { Link, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, User, CheckSquare, LogOut } from "lucide-react";

export const DashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold text-foreground">TaskManager</h1>
        </div>
        <nav className="space-y-1 p-4">
          <NavLink
            to="/dashboard"
            end
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            activeClassName="bg-accent text-accent-foreground font-medium"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink
            to="/dashboard/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            activeClassName="bg-accent text-accent-foreground font-medium"
          >
            <User className="h-5 w-5" />
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/tasks"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            activeClassName="bg-accent text-accent-foreground font-medium"
          >
            <CheckSquare className="h-5 w-5" />
            Tasks
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <h2 className="text-lg font-semibold text-foreground">Welcome, {user?.name}</h2>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
