export function PlaybookPage() {
  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Battle manual</p>
          <h1>How to play</h1>
        </div>
        <div className="mission-card">
          <strong>Quick loop</strong>
          <span>Register</span>
          <span>Add Pokemon</span>
          <span>Battle and score</span>
        </div>
      </div>
      <div className="detail-layout">
        <article className="panel">
          <h2>Trainer journey</h2>
          <ol className="battle-log">
            <li>Create or log into a trainer account.</li>
            <li>Search or scan the first-generation Pokedex and add Pokemon with the plus button.</li>
            <li>Open Roster to manage up to six Pokemon.</li>
            <li>Open Battle, choose one fighter, and start the match.</li>
            <li>Check the Leaderboard after your score posts.</li>
          </ol>
        </article>
        <article className="panel">
          <h2>Battle rules</h2>
          <div className="status-strip vertical">
            <span>Roster limit: 6 Pokemon</span>
            <span>Minimum to battle: 1 Pokemon</span>
            <span>Opponent: random first-generation Pokemon</span>
            <span>Win: battle power plus HP bonus</span>
            <span>Loss: half battle power</span>
          </div>
        </article>
      </div>
      <div className="panel">
        <h2>What makes a strong pick?</h2>
        <div className="status-strip">
          <span>Attack improves hit damage</span>
          <span>Speed improves hit damage</span>
          <span>HP helps score bonus</span>
          <span>Defense raises battle power</span>
        </div>
      </div>
    </section>
  );
}
