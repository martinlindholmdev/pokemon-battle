import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="empty-state panel">
      <p className="eyebrow">Route not found</p>
      <h1>Nothing in this tall grass</h1>
      <p>Return to the Pokedex to choose a Pokemon, build a roster, or start a battle.</p>
      <Link className="primary link-button" to="/">
        Open Pokedex
      </Link>
    </section>
  );
}
