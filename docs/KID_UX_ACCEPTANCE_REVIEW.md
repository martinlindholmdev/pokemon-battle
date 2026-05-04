# Kid UX Acceptance Review

Date: 2026-05-05

## Current Status

The kid-first arena pass is not accepted. The current deployed app is functional, but it does not meet the product bar for a six-year-old, pre-reader or early reader. Do not treat the current battle screen as a successful child-centered design.

The latest implementation added a 3D scene, shorter labels, HP pips, practice mode, same-computer play, and web friend rooms. Those changes improved technical capability but did not produce a genuinely clear, delightful, low-reading experience for the target child.

## Main Problems To Fix

1. The app still feels like an adult dashboard.
   - The sidebar, route labels, panels, status strips, and form controls make the game feel like an admin surface rather than a toy/game.
   - A six-year-old should land directly in a playful Pokemon battle or card-picking experience, not a command-center layout.

2. The battle screen still has too much text.
   - Labels such as `Practice fight`, `Trophy score`, `Starter picks`, `Your Pokemon`, `New battle`, and room instructions still require reading.
   - The next pass should rely on pictures, icons, character faces, color, motion, voice/sound cues, and one- or two-word labels only where necessary.

3. The 3D arena is not meaningful enough.
   - It is technically 3D, but the Pokemon themselves are still flat card overlays.
   - The arena does not carry enough of the fantasy: no big entrance, attacks, impact, celebration, defeat, crowd reaction, or clear cause/effect.

4. The flow is not child-simple.
   - Mode tabs, dropdowns, login/trophy messaging, room creation, room joining, and copy-link behavior are too abstract for the audience.
   - Friend play should feel like "pick Red" and "pick Blue", then take turns, with a large handoff screen between turns.

5. The Pokedex/card browsing flow is not enough like play.
   - It still asks the child to search, browse, and manage a roster.
   - The next design should offer a small set of big favorite starters first, then optionally reveal more Pokemon.

6. Feedback is too weak.
   - Hit/Block/Power buttons exist, but move results still rely on small text and modest motion.
   - A six-year-old needs strong, obvious outcomes: screen shake, attack trails, damage flash, HP chunks, cheers, victory animation, and replayable fun.

7. The current screenshots are not sufficient proof.
   - Browser automation proved that flows work, but not that a child can understand them.
   - Future verification needs visual review criteria and, if possible, real observation with the child.

## Recovery Plan

The next pass should be a redesign, not incremental polish.

1. Remove or hide the dashboard shell during play.
   - Battle should be the first-class full-screen surface.
   - Navigation should collapse behind a simple home/menu icon.

2. Start with one child path.
   - First screen: choose between three to six big Pokemon portraits.
   - Next: choose opponent or friend.
   - Next: battle.
   - Avoid exposing account, leaderboard, roster management, search, and web-room concepts in the primary path.

3. Replace dropdowns with picture choices.
   - Use large Pokemon portraits with color-coded player markers.
   - Avoid select boxes for child-facing choices.

4. Make battle actions tactile.
   - Three huge buttons: Hit, Shield, Star/Power.
   - Add attack animation, impact flash, HP chunk removal, and celebration.
   - Keep text secondary and optional.

5. Rework friend play.
   - Same-computer mode should be primary.
   - Use a full-screen "Give the computer to Blue" handoff, hiding Red's choices.
   - Web friend rooms can remain, but should be behind a grown-up/help menu until simplified.

6. Treat login and leaderboard as grown-up extras.
   - Do not mention login, verified scores, or trophies during the child’s first battle.
   - Put account and leaderboard behind a parent/grown-up area or post-battle secondary prompt.

7. Add sound or voice-style feedback if acceptable.
   - Even simple Web Audio effects would help pre-readers understand hit, block, power, win, and loss.
   - Respect browser autoplay constraints and provide a clear sound toggle.

8. Verify with screenshots and task criteria.
   - A non-reader should be able to start a battle without help.
   - A child should understand whose turn it is from color, position, and animation.
   - A child should understand what happened after each move without reading the log.
   - Mobile should show one clear action area at a time, not a long stacked dashboard.

## Suggested Next Milestone

Create a full-screen kid battle prototype that temporarily ignores advanced routes and focuses only on:

- pick Pikachu/Charmander/Squirtle/Bulbasaur,
- pick solo or same-computer friend,
- play a three-action animated battle,
- show a big win/try-again celebration.

Only after that prototype feels clear should it be reconnected to roster, login, leaderboard, and web-room features.
