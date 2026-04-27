import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { AuthPayload } from "../api/http";

const storageKey = "pokemon-battle-auth";

interface AuthState {
  token: string | null;
  user: AuthPayload["user"] | null;
  setSession: (payload: AuthPayload) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

function loadSession(): Pick<AuthState, "token" | "user"> {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = loadSession();
  const [token, setToken] = useState(initial.token);
  const [user, setUser] = useState(initial.user);

  const value = useMemo<AuthState>(
    () => ({
      token,
      user,
      setSession(payload) {
        localStorage.setItem(storageKey, JSON.stringify(payload));
        setToken(payload.token);
        setUser(payload.user);
      },
      logout() {
        localStorage.removeItem(storageKey);
        setToken(null);
        setUser(null);
      }
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return value;
}
