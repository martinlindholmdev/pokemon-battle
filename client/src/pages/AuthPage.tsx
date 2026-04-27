import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/http";
import { useAuth } from "../auth/AuthContext";

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const displayName = String(form.get("displayName") ?? "");

    try {
      const payload =
        mode === "register"
          ? await registerUser({ email, password, displayName })
          : await loginUser({ email, password });
      setSession(payload);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-layout">
      <div>
        <p className="eyebrow">Trainer access</p>
        <h1>{mode === "register" ? "Create trainer card" : "Trainer login"}</h1>
        <p className="muted">
          Login unlocks roster battles, score uploads, and leaderboard placement.
        </p>
        <div className="status-strip vertical">
          <span>Passwords are hashed</span>
          <span>JWT session lasts 2 hours</span>
          <span>Scores require login</span>
        </div>
      </div>
      <form className="panel form" onSubmit={submit}>
        {mode === "register" && (
          <label>
            Display name
            <input name="displayName" required minLength={2} maxLength={32} autoComplete="nickname" />
          </label>
        )}
        <label>
          Email
          <input name="email" required type="email" autoComplete="email" />
        </label>
        <label>
          Password
          <input name="password" required type="password" minLength={mode === "register" ? 8 : 1} autoComplete={mode === "register" ? "new-password" : "current-password"} />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="primary" disabled={loading} type="submit">
          {loading ? "Working..." : mode === "register" ? "Create account" : "Log in"}
        </button>
        <p className="muted">
          {mode === "register" ? "Already registered?" : "Need an account?"}{" "}
          <Link to={mode === "register" ? "/login" : "/register"}>{mode === "register" ? "Log in" : "Register"}</Link>
        </p>
      </form>
    </section>
  );
}
