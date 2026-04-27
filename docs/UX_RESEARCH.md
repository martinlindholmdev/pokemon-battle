# UX Research

Date: 2026-04-27

## Sources Reviewed

- PokeAPI documentation: https://pokeapi.co/docs/v2
  - Relevant point: Pokemon detail responses include types, abilities, stats, and sprite/artwork URLs. The app keeps API usage modest by fetching a small list and detail pages on demand.
- PokeAPI sprites repository: https://github.com/PokeAPI/sprites
  - License/status: repository is a public data/artwork mirror; Pokemon artwork rights remain owned by their respective rights holders. The app hotlinks official-artwork URLs for educational demo use and does not redistribute sprite files.
- Official Pokemon Pokedex: https://www.pokemon.com/us/pokedex
  - Relevant point: strong Pokemon identity comes from large creature art, type labels, compact stats, and fast scanning.
- Pokemon Showdown: https://github.com/matlink/Pokemon-Showdown
  - License/status: MIT noted in repository search result. Inspected conceptually for battle log and HP bar conventions; no code copied.
- pkmn organization projects: https://github.com/pkmn
  - License/status: multiple MIT projects. Used as evidence that robust battle engines exist, but MVP uses a small deterministic simulation to avoid dependency and rules complexity.
- MatheusPires99/pokedex: https://github.com/MatheusPires99/pokedex
  - License/status: no license confirmed from quick search result, so used only as inspiration. Observed mobile-first detail/card emphasis; no code copied.

## Local Design Decisions

- First screen is a working Pokedex dashboard, not a marketing landing page.
- Use stable square artwork areas to avoid layout jump while images load.
- Keep cards compact with clear add-to-roster actions and detail links.
- Use a dark cockpit base with restrained type accents, readable panels, and 8px radii.
- Battle screen uses familiar HP bars, a matchup layout, and a turn log rather than a full rules engine.
- Empty, loading, error, auth, and leaderboard states are explicit.
- Mobile navigation stacks cleanly; desktop uses a persistent side rail for repeated app use.

## Code Adaptation

No third-party source code was copied or adapted. The implementation uses original React/CSS written for this repository.

## Responsive Acceptance

- 390x844: navigation stacks, cards fit one column or narrow grid, battle panels stack, no clipped buttons.
- 768x1024: sidebar and grids remain readable, forms keep tap-friendly controls.
- 1440x900: dashboard uses available width without oversized marketing composition.
