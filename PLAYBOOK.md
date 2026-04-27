# Pokemon Battle Playbook

This playbook explains the game rules and expected demo flow for the Pokemon Battle app.

## Goal

Build a roster, battle a random opponent, earn points, and place a score on the leaderboard.

## Trainer Flow

1. Register a trainer account with display name, email, and password.
2. Log in to store battle scores.
3. Browse the Pokedex dashboard.
4. Open Pokemon details to inspect stats, types, and abilities.
5. Add Pokemon to your roster.
6. Enter the battle screen, choose a roster Pokemon, and start a battle.
7. Review the result, score, HP bars, and turn log.
8. Check the leaderboard for the posted score.

## Roster Rules

- A roster can hold up to 6 Pokemon.
- Roster data is stored in the browser with localStorage.
- Duplicate Pokemon are ignored.
- Pokemon can be removed from the roster page.
- At least 1 Pokemon is required to start a battle.

## Battle Rules

- The player chooses one Pokemon from the roster.
- The opponent is randomly selected from the first 151 Pokemon.
- Each battle runs for up to 8 turns.
- Each turn, choose one move:
  - Strike: full damage.
  - Guard: lower damage, but the opponent counter is reduced.
  - Focus: no immediate damage, but the next Strike is stronger.
- The opponent counters after Strike or Guard if it still has HP.
- Damage is based on attack and speed.
- The winner is decided by HP, with total battle power used as a tiebreaker if the battle reaches the turn limit.

## Battle Power

Battle power is calculated from core stats:

```txt
attack * 1.4 + defense + speed + hp
```

This keeps battles simple and readable for the project demo. It does not attempt to reproduce official Pokemon rules.

## Scoring

- Win: battle power plus remaining HP bonus.
- Loss: half of battle power.
- Scores are posted only when the trainer is logged in.
- The leaderboard stores score, win/loss count, roster names, opponent name, and timestamp.

## Leaderboard Rules

- Leaderboard entries are sorted from highest score to lowest score.
- The app shows the top 25 scores.
- A trainer can post multiple scores.

## Known Simplifications

- Type effectiveness is displayed visually through badges but is not part of damage calculation.
- There are no items, status effects, critical hits, or switching.
- Roster persistence is local to the browser, while leaderboard scores are stored in MongoDB.

## Live Demo Dependency

Login, registration, and leaderboard posting require the deployed Render service to reach MongoDB Atlas. If login hangs or fails in production, check Atlas Network Access first.
