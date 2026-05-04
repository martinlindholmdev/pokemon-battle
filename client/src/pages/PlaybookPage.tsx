import { Plus, Shield, Sparkles, Swords, Trophy, Users } from "lucide-react";

export function PlaybookPage() {
  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">How to play</p>
          <h1>Big buttons. Big battles.</h1>
        </div>
        <div className="mission-card">
          <strong>Quick path</strong>
          <span>Pick favorites</span>
          <span>Press Start</span>
          <span>Cheer the winner</span>
        </div>
      </div>
      <div className="playbook-grid">
        <article className="panel play-card">
          <Plus size={34} />
          <h2>Pick</h2>
          <p>Add Pokemon cards to your team, or use the starter picks.</p>
        </article>
        <article className="panel play-card">
          <Swords size={34} />
          <h2>Hit</h2>
          <p>Big attack. Use it when you want to win fast.</p>
        </article>
        <article className="panel play-card">
          <Shield size={34} />
          <h2>Block</h2>
          <p>Small attack. Takes less hurt back.</p>
        </article>
        <article className="panel play-card">
          <Sparkles size={34} />
          <h2>Power</h2>
          <p>Charge up. Your next Hit gets stronger.</p>
        </article>
        <article className="panel play-card">
          <Users size={34} />
          <h2>Friends</h2>
          <p>Play on one computer, or make a web room code.</p>
        </article>
        <article className="panel play-card">
          <Trophy size={34} />
          <h2>Trophies</h2>
          <p>Log in when you want scores saved.</p>
        </article>
      </div>
    </section>
  );
}
