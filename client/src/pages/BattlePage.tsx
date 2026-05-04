import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Copy, Gamepad2, Shield, Sparkles, Swords, Trophy, Users, Wifi } from "lucide-react";
import {
  createFriendBattle,
  getFriendBattle,
  joinFriendBattle,
  playFriendMove,
  postScore,
  startBattleSession
} from "../api/http";
import type { BattleMove, FriendBattleRoom, FriendSide } from "../api/http";
import { fetchPokemonDetail } from "../api/pokeapi";
import { getRoster } from "../auth/roster";
import { useAuth } from "../auth/AuthContext";
import { BattleArena3D } from "../components/BattleArena3D";
import { HpBar } from "../components/HpBar";
import type { PokemonDetail, PokemonSummary } from "../types/pokemon";

type Move = BattleMove;
type BattleMode = "solo" | "local" | "web";
type ArenaSide = "player" | "opponent" | FriendSide;

interface ArenaState {
  player: PokemonDetail;
  opponent: PokemonDetail;
  playerHp: number;
  opponentHp: number;
  turn: number;
  focus: number;
  log: string[];
  outcome?: "win" | "loss";
  score?: number;
  posted?: boolean;
  recap?: string;
  recapSource?: "ai" | "local";
  battleToken: string;
  moves: Move[];
  verified: boolean;
  activeSide: ArenaSide;
  lastMove?: Move;
}

interface LocalFriendArena {
  one: PokemonDetail;
  two: PokemonDetail;
  oneHp: number;
  twoHp: number;
  turn: FriendSide;
  round: number;
  focus: Record<FriendSide, number>;
  guard: Record<FriendSide, boolean>;
  log: string[];
  winner?: FriendSide;
  lastMove?: Move;
}

const starterChoices: PokemonSummary[] = [
  { id: 25, name: "pikachu", image: pokemonImage(25), url: "" },
  { id: 1, name: "bulbasaur", image: pokemonImage(1), url: "" },
  { id: 4, name: "charmander", image: pokemonImage(4), url: "" },
  { id: 7, name: "squirtle", image: pokemonImage(7), url: "" },
  { id: 133, name: "eevee", image: pokemonImage(133), url: "" },
  { id: 143, name: "snorlax", image: pokemonImage(143), url: "" }
];

function pokemonImage(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function randomPokemonId(exceptId: number) {
  const id = Math.floor(Math.random() * 151) + 1;
  return id === exceptId ? (id % 151) + 1 : id;
}

function power(pokemon: PokemonDetail) {
  return pokemon.stats.attack * 1.4 + pokemon.stats.defense + pokemon.stats.speed + pokemon.stats.hp;
}

function scoreBattle(arena: ArenaState, outcome: "win" | "loss") {
  return outcome === "win"
    ? Math.round(power(arena.player) + Math.max(0, arena.playerHp) * 3 + arena.turn * 12)
    : Math.round(power(arena.player) / 2 + arena.turn * 5);
}

function moveDamage(player: PokemonDetail, move: Move, focus: number) {
  if (move === "focus") return 0;
  const base = Math.max(10, Math.round(player.stats.attack / 6 + player.stats.speed / 14));
  return move === "strike" ? base + focus * 8 : Math.round(base * 0.55);
}

function friendSideName(side: FriendSide) {
  return side === "one" ? "Red" : "Blue";
}

function hpKey(side: FriendSide) {
  return side === "one" ? "oneHp" : "twoHp";
}

function otherSide(side: FriendSide): FriendSide {
  return side === "one" ? "two" : "one";
}

function moveNotice(move: Move) {
  if (move === "guard") return "Shield up.";
  if (move === "focus") return "Power ready.";
  return "Big hit.";
}

function moveVerb(move: Move) {
  if (move === "guard") return "blocked and bumped";
  if (move === "focus") return "powered up";
  return "hit";
}

function applyLocalFriendMove(arena: LocalFriendArena, move: Move): LocalFriendArena {
  if (arena.winner) return arena;

  const side = arena.turn;
  const defenderSide = otherSide(side);
  const attacker = side === "one" ? arena.one : arena.two;
  const next: LocalFriendArena = {
    ...arena,
    focus: { ...arena.focus },
    guard: { ...arena.guard },
    log: [...arena.log],
    lastMove: move
  };

  if (move === "focus") {
    next.focus[side] = Math.min(3, next.focus[side] + 1);
    next.guard[side] = false;
    next.log.unshift(`${attacker.name} powered up.`);
  } else {
    const defenderHpKey = hpKey(defenderSide);
    let damage = moveDamage(attacker, move, next.focus[side]);
    if (next.guard[defenderSide]) {
      damage = Math.max(1, Math.round(damage * 0.45));
      next.guard[defenderSide] = false;
    }

    next[defenderHpKey] = Math.max(0, next[defenderHpKey] - damage);
    next.focus[side] = 0;
    next.guard[side] = move === "guard";
    next.log.unshift(`${friendSideName(side)} ${moveVerb(move)}.`);
  }

  if (next[hpKey(defenderSide)] <= 0) {
    next.winner = side;
    next.log.unshift(`${friendSideName(side)} wins.`);
    return next;
  }

  if (side === "two") {
    next.round += 1;
  }

  if (next.round > 10) {
    next.winner = next.oneHp >= next.twoHp ? "one" : "two";
    next.log.unshift(`${friendSideName(next.winner)} wins.`);
    return next;
  }

  next.turn = defenderSide;
  next.log = next.log.slice(0, 12);
  return next;
}

function MoveButtons({
  disabled,
  onMove,
  waiting
}: {
  disabled: boolean;
  onMove: (move: Move) => void;
  waiting?: string;
}) {
  return (
    <div className="move-grid kid-move-grid" aria-label={waiting ?? "Battle moves"}>
      <button className="move-card strike" type="button" onClick={() => onMove("strike")} disabled={disabled}>
        <Swords size={30} />
        <span>Hit</span>
        <small>Strong</small>
      </button>
      <button className="move-card guard" type="button" onClick={() => onMove("guard")} disabled={disabled}>
        <Shield size={30} />
        <span>Block</span>
        <small>Safe</small>
      </button>
      <button className="move-card focus" type="button" onClick={() => onMove("focus")} disabled={disabled}>
        <Sparkles size={30} />
        <span>Power</span>
        <small>Charge</small>
      </button>
    </div>
  );
}

function PokemonSelect({
  label,
  value,
  choices,
  onChange
}: {
  label: string;
  value: string;
  choices: PokemonSummary[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {choices.map((pokemon) => (
          <option value={pokemon.id} key={pokemon.id}>{pokemon.name}</option>
        ))}
      </select>
    </label>
  );
}

function ArenaFighter({
  pokemon,
  hp,
  side,
  active
}: {
  pokemon: PokemonDetail;
  hp: number;
  side: "left" | "right";
  active: boolean;
}) {
  return (
    <div className={`arena-fighter ${side} ${active ? "active" : ""}`}>
      <div className="sprite-stage large">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <strong>{pokemon.name}</strong>
      <HpBar label="HP" value={hp} />
    </div>
  );
}

function BattleStage({
  left,
  right,
  leftHp,
  rightHp,
  activeSide,
  lastMove,
  winnerLabel
}: {
  left: PokemonDetail;
  right: PokemonDetail;
  leftHp: number;
  rightHp: number;
  activeSide: ArenaSide;
  lastMove?: Move;
  winnerLabel?: string;
}) {
  const leftActive = activeSide === "player" || activeSide === "one";
  const rightActive = activeSide === "opponent" || activeSide === "two";

  return (
    <div className="arena-board">
      <BattleArena3D activeSide={activeSide} lastMove={lastMove} finished={Boolean(winnerLabel)} />
      <ArenaFighter pokemon={left} hp={leftHp} side="left" active={leftActive} />
      <ArenaFighter pokemon={right} hp={rightHp} side="right" active={rightActive} />
      <div className="arena-center-badge">VS</div>
      {winnerLabel && (
        <div className="arena-win-banner">
          <Trophy size={28} />
          <strong>{winnerLabel}</strong>
        </div>
      )}
    </div>
  );
}

function BattleLog({ entries }: { entries: string[] }) {
  return (
    <ol className="battle-log kid-log">
      {entries.slice(0, 6).map((turn, index) => (
        <li key={`${turn}-${index}`}>{turn}</li>
      ))}
    </ol>
  );
}

export function BattlePage() {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [roster] = useState<PokemonSummary[]>(() => getRoster());
  const choices = useMemo(() => (roster.length > 0 ? roster : starterChoices), [roster]);
  const [mode, setMode] = useState<BattleMode>(() => (searchParams.get("room") ? "web" : "solo"));
  const [selected, setSelected] = useState(() => String((getRoster()[0] ?? starterChoices[0]).id));
  const [friendOne, setFriendOne] = useState(() => String((getRoster()[0] ?? starterChoices[0]).id));
  const [friendTwo, setFriendTwo] = useState(() => String((getRoster()[1] ?? getRoster()[0] ?? starterChoices[1]).id));
  const [arena, setArena] = useState<ArenaState | null>(null);
  const [localFriendArena, setLocalFriendArena] = useState<LocalFriendArena | null>(null);
  const [room, setRoom] = useState<FriendBattleRoom | null>(null);
  const [roomCode, setRoomCode] = useState(() => searchParams.get("room")?.toUpperCase() ?? "");
  const [roomSide, setRoomSide] = useState<FriendSide>(() => (searchParams.get("side") === "one" ? "one" : "two"));
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedPokemon = choices.find((pokemon) => String(pokemon.id) === selected);
  const roomLink = room && typeof window !== "undefined" ? `${window.location.origin}/battle?room=${room.code}&side=two` : "";

  useEffect(() => {
    if (mode !== "web" || roomCode.length < 4) return;

    let cancelled = false;
    async function loadRoom() {
      try {
        const data = await getFriendBattle(roomCode);
        if (!cancelled) setRoom(data.room);
      } catch (error) {
        if (!cancelled) setNotice(error instanceof Error ? error.message : "Friend room is not ready");
      }
    }

    void loadRoom();
    const interval = window.setInterval(() => void loadRoom(), 3000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [mode, roomCode]);

  function changeMode(nextMode: BattleMode) {
    setMode(nextMode);
    setNotice("");
    if (nextMode !== "web") {
      setSearchParams({});
    }
  }

  async function startBattle() {
    if (!selected) return;

    setLoading(true);
    setNotice("");
    try {
      if (token) {
        const battle = await startBattleSession(token, {
          playerId: Number(selected),
          teamIds: choices.map((pokemon) => pokemon.id).slice(0, 6)
        });
        setArena({
          player: battle.player,
          opponent: battle.opponent,
          playerHp: 100,
          opponentHp: 100,
          turn: 1,
          focus: 0,
          log: [`${battle.player.name} jumps in.`],
          battleToken: battle.battleToken,
          moves: [],
          verified: true,
          activeSide: "player"
        });
        setNotice("Trophy score is on.");
      } else {
        const player = await fetchPokemonDetail(Number(selected));
        const opponent = await fetchPokemonDetail(randomPokemonId(player.id));
        setArena({
          player,
          opponent,
          playerHp: 100,
          opponentHp: 100,
          turn: 1,
          focus: 0,
          log: [`${player.name} jumps in.`],
          battleToken: "",
          moves: [],
          verified: false,
          activeSide: "player"
        });
        setNotice("Practice fight. Log in to save trophies.");
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Arena failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function finishBattle(next: ArenaState, outcome: "win" | "loss") {
    const score = scoreBattle(next, outcome);
    const finished: ArenaState = {
      ...next,
      outcome,
      score,
      activeSide: outcome === "win" ? "player" : "opponent",
      log: [`${outcome === "win" ? next.player.name : next.opponent.name} wins.`, ...next.log].slice(0, 12)
    };
    setArena(finished);

    if (!token || !next.verified || !next.battleToken) {
      setNotice(outcome === "win" ? "You won. Log in to save a trophy." : "Good try. Pick a new fighter.");
      return;
    }

    try {
      const posted = await postScore(token, {
        battleToken: next.battleToken,
        moves: next.moves
      });
      setArena({
        ...finished,
        outcome: posted.result.outcome,
        score: posted.result.score,
        posted: true,
        recap: posted.recap.recap,
        recapSource: posted.recap.source
      });
      setNotice("Trophy saved.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Score could not be posted");
    }
  }

  async function performMove(move: Move) {
    if (!arena || arena.outcome) return;

    const moves = [...arena.moves, move];
    const playerDamage = moveDamage(arena.player, move, arena.focus);
    const nextOpponentHp = Math.max(0, arena.opponentHp - playerDamage);
    const log = [
      move === "focus" ? `${arena.player.name} powered up.` : `${arena.player.name} ${moveVerb(move)}.`,
      ...arena.log
    ];

    if (nextOpponentHp <= 0) {
      await finishBattle({ ...arena, opponentHp: 0, log, moves, lastMove: move, activeSide: "player" }, "win");
      return;
    }

    const counterBase = Math.max(8, Math.round(arena.opponent.stats.attack / 7 + arena.opponent.stats.speed / 15));
    const counterDamage = move === "guard" ? Math.round(counterBase * 0.35) : counterBase;
    const nextPlayerHp = Math.max(0, arena.playerHp - counterDamage);
    const counterLog = [`${arena.opponent.name} hits back.`, ...log].slice(0, 12);

    const next: ArenaState = {
      ...arena,
      playerHp: nextPlayerHp,
      opponentHp: nextOpponentHp,
      turn: arena.turn + 1,
      focus: move === "focus" ? Math.min(3, arena.focus + 1) : 0,
      log: counterLog,
      moves,
      lastMove: move,
      activeSide: move === "focus" ? "player" : "opponent"
    };

    if (nextPlayerHp <= 0 || next.turn > 8) {
      await finishBattle(next, nextPlayerHp > nextOpponentHp || power(arena.player) >= power(arena.opponent) ? "win" : "loss");
      return;
    }

    setArena(next);
    setNotice(moveNotice(move));
  }

  async function startLocalFriendBattle() {
    setLoading(true);
    setNotice("");
    try {
      const [one, two] = await Promise.all([fetchPokemonDetail(Number(friendOne)), fetchPokemonDetail(Number(friendTwo))]);
      setLocalFriendArena({
        one,
        two,
        oneHp: 100,
        twoHp: 100,
        turn: "one",
        round: 1,
        focus: { one: 0, two: 0 },
        guard: { one: false, two: false },
        log: ["Red goes first."],
        lastMove: undefined
      });
      setNotice("Pass the computer after each move.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Friend battle could not start");
    } finally {
      setLoading(false);
    }
  }

  function performLocalFriendMove(move: Move) {
    if (!localFriendArena || localFriendArena.winner) return;
    const next = applyLocalFriendMove(localFriendArena, move);
    setLocalFriendArena(next);
    setNotice(next.winner ? `${friendSideName(next.winner)} wins.` : `${friendSideName(next.turn)} turn.`);
  }

  async function createRoom() {
    setLoading(true);
    setNotice("");
    try {
      const data = await createFriendBattle({ playerId: Number(friendOne) });
      setRoom(data.room);
      setRoomCode(data.room.code);
      setRoomSide("one");
      setSearchParams({ room: data.room.code, side: "one" });
      setNotice("Room made. Send the code to a friend.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Room could not be made");
    } finally {
      setLoading(false);
    }
  }

  async function joinRoom() {
    const code = roomCode.trim().toUpperCase();
    if (!code) return;

    setLoading(true);
    setNotice("");
    try {
      const data = await joinFriendBattle(code, { playerId: Number(friendTwo) });
      setRoom(data.room);
      setRoomCode(data.room.code);
      setRoomSide("two");
      setSearchParams({ room: data.room.code, side: "two" });
      setNotice("You joined as Blue.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not join room");
    } finally {
      setLoading(false);
    }
  }

  async function performRoomMove(move: Move) {
    if (!room || !room.state || room.state.winner || room.state.turn !== roomSide) return;
    setLoading(true);
    try {
      const data = await playFriendMove(room.code, { side: roomSide, move });
      setRoom(data.room);
      setNotice(data.room.state?.winner ? `${friendSideName(data.room.state.winner)} wins.` : "Move sent.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Move could not be sent");
    } finally {
      setLoading(false);
    }
  }

  function copyRoomLink() {
    if (!roomLink || !navigator.clipboard) return;
    void navigator.clipboard.writeText(roomLink).then(() => setNotice("Friend link copied.")).catch(() => setNotice("Copy blocked. Use the room code."));
  }

  return (
    <section className="battle-page">
      <div className="page-heading kid-heading">
        <div>
          <p className="eyebrow">Pokemon arena</p>
          <h1>Pick. Battle. Cheer.</h1>
        </div>
        <div className="mode-tabs" aria-label="Battle mode">
          <button className={mode === "solo" ? "active" : ""} type="button" onClick={() => changeMode("solo")}>
            <Gamepad2 size={18} /> Solo
          </button>
          <button className={mode === "local" ? "active" : ""} type="button" onClick={() => changeMode("local")}>
            <Users size={18} /> Same PC
          </button>
          <button className={mode === "web" ? "active" : ""} type="button" onClick={() => changeMode("web")}>
            <Wifi size={18} /> Web
          </button>
        </div>
      </div>

      {notice && <p className="notice">{notice}</p>}
      {roster.length === 0 && (
        <p className="notice starter-notice">
          Starter picks are ready. <Link to="/">Add favorites from the Pokedex.</Link>
        </p>
      )}

      {mode === "solo" && (
        <>
          <div className="battle-controls kid-controls">
            <PokemonSelect label="Your Pokemon" value={selected} choices={choices} onChange={setSelected} />
            <button className="primary" onClick={startBattle} disabled={loading} type="button">
              {loading ? "Opening..." : arena ? "New battle" : "Start"}
            </button>
            <span className="score-chip">{token ? "Trophy score on" : "Practice mode"}</span>
          </div>
          {arena ? (
            <>
              <BattleStage
                left={arena.player}
                right={arena.opponent}
                leftHp={arena.playerHp}
                rightHp={arena.opponentHp}
                activeSide={arena.activeSide}
                lastMove={arena.lastMove}
                winnerLabel={arena.outcome ? (arena.outcome === "win" ? "You win" : "Try again") : undefined}
              />
              <div className="kid-command-panel">
                <div>
                  <p className="eyebrow">Turn {Math.min(arena.turn, 8)} / 8</p>
                  <h2>{arena.outcome ? `${arena.score} trophy points` : "Choose one"}</h2>
                </div>
                <MoveButtons disabled={Boolean(arena.outcome)} onMove={(move) => void performMove(move)} />
                <BattleLog entries={arena.log} />
                {arena.outcome && (
                  <div className="coach-recap">
                    <p className="eyebrow">{arena.posted ? "Saved" : "Practice"}</p>
                    <h3>{arena.outcome === "win" ? "Great battle" : "Good try"}</h3>
                    <p>{arena.recap ?? "Try another Pokemon or start a new battle."}</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="battle-setup kid-setup">
              <article className="panel">
                <p className="eyebrow">Ready fighter</p>
                <h2>{selectedPokemon?.name ?? "Pick one"}</h2>
                {selectedPokemon && (
                  <div className="sprite-stage">
                    <img src={selectedPokemon.image} alt={selectedPokemon.name} />
                  </div>
                )}
              </article>
              <article className="panel symbol-rules">
                <h2>Moves</h2>
                <span><Swords size={26} /> Hit</span>
                <span><Shield size={26} /> Block</span>
                <span><Sparkles size={26} /> Power</span>
              </article>
              <article className="panel">
                <p className="eyebrow">Arena</p>
                <h2>3D stage ready</h2>
                <p>Press Start. Big buttons appear under the arena.</p>
              </article>
            </div>
          )}
        </>
      )}

      {mode === "local" && (
        <>
          <div className="friend-setup">
            <article className="panel">
              <p className="eyebrow">Red trainer</p>
              <PokemonSelect label="Red Pokemon" value={friendOne} choices={choices} onChange={setFriendOne} />
            </article>
            <article className="panel">
              <p className="eyebrow">Blue trainer</p>
              <PokemonSelect label="Blue Pokemon" value={friendTwo} choices={choices} onChange={setFriendTwo} />
            </article>
            <article className="panel start-panel">
              <button className="primary" onClick={startLocalFriendBattle} disabled={loading} type="button">
                {loading ? "Opening..." : "Start friend battle"}
              </button>
              <span>Take turns on this computer.</span>
            </article>
          </div>

          {localFriendArena && (
            <>
              <BattleStage
                left={localFriendArena.one}
                right={localFriendArena.two}
                leftHp={localFriendArena.oneHp}
                rightHp={localFriendArena.twoHp}
                activeSide={localFriendArena.winner ?? localFriendArena.turn}
                lastMove={localFriendArena.lastMove}
                winnerLabel={localFriendArena.winner ? `${friendSideName(localFriendArena.winner)} wins` : undefined}
              />
              <div className="kid-command-panel">
                <div>
                  <p className="eyebrow">Round {Math.min(localFriendArena.round, 10)} / 10</p>
                  <h2>{localFriendArena.winner ? "Battle done" : `${friendSideName(localFriendArena.turn)} choose`}</h2>
                </div>
                <MoveButtons disabled={Boolean(localFriendArena.winner)} onMove={performLocalFriendMove} />
                <BattleLog entries={localFriendArena.log} />
              </div>
            </>
          )}
        </>
      )}

      {mode === "web" && (
        <>
          <div className="friend-setup">
            <article className="panel">
              <p className="eyebrow">Make room</p>
              <PokemonSelect label="Your Pokemon" value={friendOne} choices={choices} onChange={setFriendOne} />
              <button className="primary" onClick={createRoom} disabled={loading} type="button">Make code</button>
            </article>
            <article className="panel">
              <p className="eyebrow">Join room</p>
              <label>
                Room code
                <input value={roomCode} onChange={(event) => setRoomCode(event.target.value.toUpperCase())} maxLength={6} />
              </label>
              <PokemonSelect label="Blue Pokemon" value={friendTwo} choices={choices} onChange={setFriendTwo} />
              <button onClick={joinRoom} disabled={loading || roomCode.length < 4} type="button">Join</button>
            </article>
            <article className="panel room-card">
              <p className="eyebrow">Room</p>
              <h2>{room?.code ?? "No code yet"}</h2>
              <span>{room?.two ? "Both trainers ready" : room ? "Waiting for Blue" : "Make or join a room"}</span>
              {room && (
                <button type="button" onClick={copyRoomLink}>
                  <Copy size={16} /> Copy friend link
                </button>
              )}
            </article>
          </div>

          {room?.one && room.two && room.state && (
            <>
              <BattleStage
                left={room.one}
                right={room.two}
                leftHp={room.state.oneHp}
                rightHp={room.state.twoHp}
                activeSide={room.state.winner ?? room.state.turn}
                lastMove={room.state.lastMove}
                winnerLabel={room.state.winner ? `${friendSideName(room.state.winner)} wins` : undefined}
              />
              <div className="kid-command-panel">
                <div>
                  <p className="eyebrow">You are {friendSideName(roomSide)}</p>
                  <h2>{room.state.winner ? "Battle done" : room.state.turn === roomSide ? "Your turn" : "Friend turn"}</h2>
                </div>
                <MoveButtons
                  disabled={loading || Boolean(room.state.winner) || room.state.turn !== roomSide}
                  waiting={room.state.turn === roomSide ? "Your moves" : "Waiting for friend"}
                  onMove={(move) => void performRoomMove(move)}
                />
                <BattleLog entries={room.state.log} />
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}
