import { useEffect, useState } from "react";
import { getLeaderboard, type ScoreEntry } from "../api/http";

export function LeaderboardPage() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getLeaderboard().then((data) => setScores(data.scores)).catch((err) => setError(err instanceof Error ? err.message : "Could not load leaderboard"));
  }, []);

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Arena records</p>
          <h1>Leaderboard</h1>
        </div>
        <div className="mission-card">
          <strong>Score rules</strong>
          <span>Wins get HP bonus</span>
          <span>Losses still score</span>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      {!error && scores.length === 0 && (
        <div className="empty-state panel">
          <h2>No scores yet</h2>
          <p>Win or lose a battle while logged in to create the first entry.</p>
        </div>
      )}
      <div className="leaderboard">
        {scores.map((score, index) => (
          <article className="leader-row" key={score.id}>
            <strong>#{index + 1}</strong>
            <span>{score.displayName}</span>
            <span>{score.team.join(", ") || "Solo battle"}</span>
            <span>{score.opponent || "Unknown opponent"}</span>
            <strong>{score.score}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
