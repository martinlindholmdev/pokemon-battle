import { NavLink, Outlet } from "react-router-dom";
import { Dumbbell, Home, LogOut, Shield, Trophy, UserPlus } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">PB</span>
          <div>
            <strong>Pokemon Battle</strong>
            <small>Trainer cockpit</small>
          </div>
        </div>
        <nav>
          <NavLink to="/">
            <Home size={18} /> Dashboard
          </NavLink>
          <NavLink to="/roster">
            <Shield size={18} /> Roster
          </NavLink>
          <NavLink to="/battle">
            <Dumbbell size={18} /> Battle
          </NavLink>
          <NavLink to="/leaderboard">
            <Trophy size={18} /> Leaderboard
          </NavLink>
          {!user && (
            <NavLink to="/register">
              <UserPlus size={18} /> Register
            </NavLink>
          )}
        </nav>
        <div className="trainer-panel">
          {user ? (
            <>
              <span>Signed in as</span>
              <strong>{user.displayName}</strong>
              <button onClick={logout} type="button">
                <LogOut size={16} /> Log out
              </button>
            </>
          ) : (
            <>
              <span>Guest mode</span>
              <NavLink to="/login">Log in to score</NavLink>
            </>
          )}
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
