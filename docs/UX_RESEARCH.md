# UX Research

Date: 2026-04-27

## License-Safe Reference Decision

The most-starred Pokemon battle repository found in GitHub search was `smogon/pokemon-showdown` with about 5.6k stars, but that repository is the battle simulator/server and is MIT licensed. The actual Pokemon Showdown frontend is `smogon/pokemon-showdown-client`, with about 670 stars and an AGPL-3.0 license. Because copying AGPL frontend code into this app would create license obligations and would not fit this React/Vite architecture, no Pokemon Showdown client code was copied.

`pvpoke/pvpoke` was also reviewed as a battle UI reference. It is MIT licensed and battle-oriented, but it is a different PHP/JavaScript Pokemon GO PvP product. It informed product-level patterns only: fast team scanning, clear score/combat panels, and compact decision surfaces.

The frontend in this repository is original React and CSS. Third-party projects were used for UX reference only.

## Sources Reviewed

- PokeAPI docs: https://pokeapi.co/docs/v2
  - Used for API shape, list/detail fields, type data, abilities, and stats.
- PokeAPI sprites: https://github.com/PokeAPI/sprites
  - Used as hotlinked official-artwork URLs. Artwork rights remain with their respective owners; no sprite files are redistributed.
- Official Pokemon Pokedex: https://www.pokemon.com/us/pokedex
  - Used for product cues: large creature art, type labels, compact stats, and fast visual scanning.
- Pokemon Showdown server: https://github.com/smogon/pokemon-showdown
  - MIT server/simulator reference. No code copied.
- Pokemon Showdown client: https://github.com/smogon/pokemon-showdown-client
  - AGPL-3.0 frontend reference. Reviewed for high-level battle UX only: opposing combatants, HP visibility, action commands, and turn log.
- PvPoke: https://github.com/pvpoke/pvpoke
  - MIT battle simulator reference. Reviewed for dense utility UI and battle/team-building structure. No code copied.
- Pokedex Tracker: https://github.com/pokedextracker/pokedextracker.com
  - MIT Pokedex product reference. Reviewed for completion-oriented browsing and clear collection states. No code copied.
- PogoFrontier web client: https://github.com/PogoFrontier/pogo-web
  - MIT battle frontend reference. Reviewed for multiplayer battle product framing. No code copied.

## Local Design Choices

- The first screen is the usable Pokedex dashboard, not a marketing landing page.
- The heavy retro/pixel direction was replaced with a cleaner trainer command center.
- Cards use stable square artwork stages to prevent layout shift while images load.
- The battle screen shows two active combatants, animated HP bars, a central command panel, and a rolling log.
- The sidebar keeps the app efficient for repeated use: Pokedex, Roster, Battle, Leaderboard, Rules, and auth.
- `/leaderboard` now serves the React page for browser navigation while `/api/leaderboard` remains the canonical API route.
- Empty, loading, error, auth, battle-in-progress, and leaderboard states are explicitly styled.
- Desktop, tablet, and mobile screenshots were regenerated after the redesign.

## Kid-First Review Addendum

Date: 2026-05-05

Target user: six-year-old, pre-reader or early reader.

Additional sources reviewed:

- UserTesting kids UX guide: https://www.usertesting.com/blog/ux-for-kids
  - Used for age segmentation, large visual targets, immediate visual/audio-style feedback, and simpler kid vocabulary.
- Child-Computer Interaction, First Edition: https://homepage.divms.uiowa.edu/~hourcade/book/child-computer-interaction-first-edition.pdf
  - Used for minimizing text for preliterate or beginning readers and keeping icons recognizable, distinguishable, and clickable.
- TIDRC children touchscreen recommendations: https://stirlab.org/wp-content/uploads/A-Framework-of-Touchscreen-Interaction-Design-Recommendations-for-Children-TIDRC-Characterizing-the-Gap-between-Research-Evidence-and-Design-Practice.pdf
  - Used for foreground clarity, low visual complexity, explicit prompts, meaningful feedback, and large forgiving interactions.
- Pokemon Stadium reference: https://en.wikipedia.org/wiki/Pok%C3%A9mon_Stadium
  - Used as high-level inspiration for 3D turn-based arena framing, visible combatants, and battle-focused play. No code or assets copied.

Kid-first changes:

- Battle is no longer blocked by login. Guests can practice and play friends; login is only needed to save trophy scores.
- The battle route now has three clear modes: Solo, Same PC, and Web.
- The arena is a React-hosted 3D scene with DOM controls, keeping gameplay rules outside the renderer.
- Move buttons use large icons and short labels: Hit, Block, Power.
- HP displays use pips plus the accessible progress value, reducing visible number dependence.
- Dense battle text was shortened into small story beats.
- The rules page became a six-card visual guide instead of a text-heavy manual.
- Web friend rooms are short-lived and unscored to preserve leaderboard integrity.

## Code Adaptation

No third-party source code was copied or adapted. The updated React/CSS is original to this repository.
