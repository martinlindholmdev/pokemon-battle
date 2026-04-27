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
- luttje/css-pokemon-gameboy: https://github.com/luttje/css-pokemon-gameboy
  - License/status: MIT. Reviewed the retro Game Boy CSS direction, especially pixel borders, limited palette, low-fi controls, progress bars, and pixel rendering. No source code copied.
- wobsoriano/poke95: https://github.com/wobsoriano/poke95
  - License/status: MIT. Reviewed the Windows 95/Pokedex presentation for chunky panels, direct manipulation, and playful retro affordances. No source code copied.
- learnapollo/pokedex-react: https://github.com/learnapollo/pokedex-react
  - License/status: MIT. Reviewed popularity among React Pokedex examples and noted that scan/browse/detail flow matters more than a landing-page composition. No source code copied.
- matheusmhq/pokedex-react-js: https://github.com/matheusmhq/pokedex-react-js
  - License/status: MIT. Reviewed type-color tokens, animated Pokemon presentation, and compact card structure. No source code copied.

## Local Design Decisions

- First screen is a working Pokedex dashboard, not a marketing landing page.
- Use a retro Game Boy/Pokedex console frame instead of a generic dark dashboard.
- Use stable square artwork areas to avoid layout jump while images load.
- Keep cards compact with clear add-to-roster actions and detail links.
- Use pixel borders, chunky shadows, scanlines, animated sprites, and a low-fi green/yellow/red palette.
- Battle screen uses familiar HP bars, a matchup layout, animated VS/result state, and a turn log rather than a full rules engine.
- Empty, loading, error, auth, and leaderboard states are explicit.
- Mobile navigation stacks cleanly; desktop uses a persistent side rail for repeated app use.
- Add in-app rules/playbook content so players understand the loop without reading repo docs.

## Code Adaptation

No third-party source code was copied or adapted. The updated React/CSS is original to this repository and uses the references only for visual direction and interaction patterns.

## Responsive Acceptance

- 390x844: navigation stacks, cards fit one column or narrow grid, battle panels stack, no clipped buttons.
- 768x1024: sidebar and grids remain readable, forms keep tap-friendly controls.
- 1440x900: dashboard uses available width without oversized marketing composition.
