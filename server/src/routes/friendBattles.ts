import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { fetchBattlePokemon, type BattlePokemon } from "../services/pokeapi.js";
import { HttpError } from "../utils/httpError.js";

type FriendSide = "one" | "two";
type FriendMove = "strike" | "guard" | "focus";

interface FriendRoomState {
  oneHp: number;
  twoHp: number;
  turn: FriendSide;
  round: number;
  guard: Record<FriendSide, boolean>;
  focus: Record<FriendSide, number>;
  log: string[];
  winner?: FriendSide;
  lastMove?: FriendMove;
}

interface FriendRoom {
  code: string;
  createdAt: number;
  updatedAt: number;
  one: BattlePokemon;
  two?: BattlePokemon;
  state?: FriendRoomState;
}

const router = Router();
const rooms = new Map<string, FriendRoom>();
const roomTtlMs = 60 * 60 * 1000;
const maxRooms = 100;

const roomLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 90,
  standardHeaders: true,
  legacyHeaders: false
});

const choosePokemonSchema = z.object({
  playerId: z.number().int().min(1).max(151)
});

const moveSchema = z.object({
  side: z.enum(["one", "two"]),
  move: z.enum(["strike", "guard", "focus"])
});

function cleanupRooms() {
  const now = Date.now();
  for (const [code, room] of rooms) {
    if (now - room.updatedAt > roomTtlMs) {
      rooms.delete(code);
    }
  }

  if (rooms.size <= maxRooms) return;

  const oldest = [...rooms.values()].sort((a, b) => a.updatedAt - b.updatedAt);
  for (const room of oldest.slice(0, rooms.size - maxRooms)) {
    rooms.delete(room.code);
  }
}

function createCode() {
  let code = "";
  do {
    code = Math.random().toString(36).slice(2, 8).toUpperCase();
  } while (rooms.has(code));
  return code;
}

function getRoom(code: string) {
  cleanupRooms();
  const room = rooms.get(code.toUpperCase());
  if (!room) {
    throw new HttpError(404, "Friend room was not found");
  }
  return room;
}

function publicRoom(room: FriendRoom) {
  return {
    code: room.code,
    one: room.one,
    two: room.two ?? null,
    state: room.state ?? null,
    expiresAt: new Date(room.updatedAt + roomTtlMs).toISOString()
  };
}

function power(pokemon: BattlePokemon) {
  return pokemon.stats.attack * 1.4 + pokemon.stats.defense + pokemon.stats.speed + pokemon.stats.hp;
}

function moveDamage(player: BattlePokemon, move: FriendMove, focus: number) {
  if (move === "focus") return 0;
  const base = Math.max(10, Math.round(player.stats.attack / 6 + player.stats.speed / 14));
  return move === "strike" ? base + focus * 8 : Math.round(base * 0.55);
}

function otherSide(side: FriendSide): FriendSide {
  return side === "one" ? "two" : "one";
}

function hpKey(side: FriendSide) {
  return side === "one" ? "oneHp" : "twoHp";
}

function ensureState(room: FriendRoom) {
  if (!room.two) {
    throw new HttpError(409, "Waiting for a friend to join");
  }

  room.state ??= {
    oneHp: 100,
    twoHp: 100,
    turn: "one",
    round: 1,
    guard: { one: false, two: false },
    focus: { one: 0, two: 0 },
    log: [`${room.one.name} and ${room.two.name} jumped into the arena.`]
  };

  return room.state;
}

function decideTiebreaker(room: FriendRoom, state: FriendRoomState): FriendSide {
  if (state.oneHp !== state.twoHp) {
    return state.oneHp > state.twoHp ? "one" : "two";
  }
  return power(room.one) >= power(room.two!) ? "one" : "two";
}

function applyMove(room: FriendRoom, side: FriendSide, move: FriendMove) {
  const state = ensureState(room);
  if (state.winner) {
    return state;
  }

  if (state.turn !== side) {
    throw new HttpError(409, "It is the other trainer's turn");
  }

  const defenderSide = otherSide(side);
  const attacker = side === "one" ? room.one : room.two!;
  const defender = defenderSide === "one" ? room.one : room.two!;
  const defenderHpKey = hpKey(defenderSide);

  if (move === "focus") {
    state.focus[side] = Math.min(3, state.focus[side] + 1);
    state.guard[side] = false;
    state.log.unshift(`${attacker.name} powered up.`);
  } else {
    let damage = moveDamage(attacker, move, state.focus[side]);
    if (state.guard[defenderSide]) {
      damage = Math.max(1, Math.round(damage * 0.45));
      state.guard[defenderSide] = false;
    }

    state[defenderHpKey] = Math.max(0, state[defenderHpKey] - damage);
    state.focus[side] = 0;
    state.guard[side] = move === "guard";
    state.log.unshift(`${attacker.name} ${move === "guard" ? "blocked and bumped" : "hit"} ${defender.name}.`);
  }

  state.lastMove = move;

  if (state[defenderHpKey] <= 0) {
    state.winner = side;
    state.log.unshift(`${attacker.name} wins.`);
    return state;
  }

  if (side === "two") {
    state.round += 1;
  }

  if (state.round > 10) {
    state.winner = decideTiebreaker(room, state);
    state.log.unshift(`${state.winner === "one" ? room.one.name : room.two!.name} wins.`);
    return state;
  }

  state.turn = defenderSide;
  state.log = state.log.slice(0, 12);
  return state;
}

router.use(roomLimiter);

router.post("/", async (req, res, next) => {
  try {
    cleanupRooms();
    const input = choosePokemonSchema.parse(req.body);
    const one = await fetchBattlePokemon(input.playerId);
    const code = createCode();
    const room: FriendRoom = {
      code,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      one
    };
    rooms.set(code, room);
    res.status(201).json({ room: publicRoom(room) });
  } catch (error) {
    next(error);
  }
});

router.get("/:code", (req, res, next) => {
  try {
    const room = getRoom(req.params.code);
    room.updatedAt = Date.now();
    res.json({ room: publicRoom(room) });
  } catch (error) {
    next(error);
  }
});

router.post("/:code/join", async (req, res, next) => {
  try {
    const input = choosePokemonSchema.parse(req.body);
    const room = getRoom(req.params.code);
    room.two = await fetchBattlePokemon(input.playerId);
    room.state = {
      oneHp: 100,
      twoHp: 100,
      turn: "one",
      round: 1,
      guard: { one: false, two: false },
      focus: { one: 0, two: 0 },
      log: [`${room.one.name} and ${room.two.name} jumped into the arena.`]
    };
    room.updatedAt = Date.now();
    res.json({ room: publicRoom(room) });
  } catch (error) {
    next(error);
  }
});

router.post("/:code/move", (req, res, next) => {
  try {
    const input = moveSchema.parse(req.body);
    const room = getRoom(req.params.code);
    applyMove(room, input.side, input.move);
    room.updatedAt = Date.now();
    res.json({ room: publicRoom(room) });
  } catch (error) {
    next(error);
  }
});

export { router as friendBattlesRouter };
