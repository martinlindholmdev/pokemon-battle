import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { createBattleToken } from "../services/battle.js";
import { fetchBattlePokemon } from "../services/pokeapi.js";
import { HttpError } from "../utils/httpError.js";

const router = Router();

const startBattleSchema = z.object({
  playerId: z.number().int().min(1).max(151),
  teamIds: z.array(z.number().int().min(1).max(151)).min(1).max(6)
});

function randomPokemonId() {
  return Math.floor(Math.random() * 151) + 1;
}

router.post("/start", requireAuth, async (req, res, next) => {
  try {
    const input = startBattleSchema.parse(req.body);
    if (!input.teamIds.includes(input.playerId)) {
      throw new HttpError(400, "Selected Pokemon must be in the submitted roster");
    }

    const opponentId = randomPokemonId();
    const ids = [...new Set([...input.teamIds, opponentId])];
    const pokemon = await Promise.all(ids.map((id) => fetchBattlePokemon(id)));
    const byId = new Map(pokemon.map((entry) => [entry.id, entry]));
    const player = byId.get(input.playerId);
    const opponent = byId.get(opponentId);

    if (!player || !opponent || !req.user) {
      throw new HttpError(400, "Battle could not be started");
    }

    const team = input.teamIds.map((id) => byId.get(id)?.name).filter((name): name is string => Boolean(name));
    const battleToken = createBattleToken({
      kind: "battle",
      userId: req.user.id,
      player,
      opponent,
      team
    });

    res.json({ battleToken, player, opponent, team });
  } catch (error) {
    next(error);
  }
});

export { router as battlesRouter };
