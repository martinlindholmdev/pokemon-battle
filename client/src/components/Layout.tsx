import { NavLink, Outlet } from "react-router-dom";
import { BookOpen, Dumbbell, Home, LogOut, Shield, Trophy, UserPlus } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { getRoster, rosterChangedEvent } from "../auth/roster";
import { useEffect, useState } from "react";

export function Layout() {
  const { user, logout } = useAuth();
  const [roster, setRoster] = useState(() => getRoster());

  useEffect(() => {
    const syncRoster = () => setRoster(getRoster());
    window.addEventListener("storage", syncRoster);
    window.addEventListener(rosterChangedEvent, syncRoster);
    return () => {
      window.removeEventListener("storage", syncRoster);
      window.removeEventListener(rosterChangedEvent, syncRoster);
    };
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">PB</span>
          <div>
            <strong>Pokemon Battle</strong>
            <small>Pick, battle, cheer</small>
          </div>
        </div>
        <div className="console-led">
          <span />
          <small>PokeAPI link ready</small>
        </div>
        <nav>
          <NavLink to="/">
            <Home size={18} /> Cards
          </NavLink>
          <NavLink to="/roster">
            <Shield size={18} /> Team
          </NavLink>
          <NavLink to="/battle">
            <Dumbbell size={18} /> Battle
          </NavLink>
          <NavLink to="/leaderboard">
            <Trophy size={18} /> Trophies
          </NavLink>
          <NavLink to="/playbook">
            <BookOpen size={18} /> How
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
              <span>Viewing as guest</span>
              <NavLink to="/login">Log in to score</NavLink>
            </>
          )}
        </div>
        <div className="roster-dock">
          <strong>Team spots</strong>
          <div className="slot-grid">
            {Array.from({ length: 6 }, (_, index) => (
              <span className={roster[index] ? "slot filled" : "slot"} key={index}>
                {roster[index] ? roster[index].name.slice(0, 3) : index + 1}
              </span>
            ))}
          </div>
          <small>{roster.length < 1 ? "Starter picks ready." : `${roster.length}/6 ready.`}</small>
        </div>
      </aside>
      <main className="content">
        <div className="screen-frame">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
