import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PW_KEY = "norte_admin_pw";

const linkBase = "text-sm px-3 py-1.5 rounded-md transition-colors";
const linkInactive = "text-muted-foreground hover:text-foreground hover:bg-muted";
const linkActive = "bg-muted text-foreground";

export const AdminNav = () => {
  const navigate = useNavigate();

  const signOut = () => {
    sessionStorage.removeItem(PW_KEY);
    navigate("/admin");
    // Force re-render of the admin page password gate
    window.location.reload();
  };

  return (
    <header className="border-b border-border bg-background sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-2">
        <span className="font-display text-lg text-primary mr-4">Norte Admin</span>
        <nav className="flex items-center gap-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => cn(linkBase, isActive ? linkActive : linkInactive)}
          >
            Reports
          </NavLink>
          <NavLink
            to="/admin/translations"
            className={({ isActive }) => cn(linkBase, isActive ? linkActive : linkInactive)}
          >
            Localisation
          </NavLink>
        </nav>
        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
        </div>
      </div>
    </header>
  );
};

export default AdminNav;
