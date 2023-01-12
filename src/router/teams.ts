import { Router } from "express";
import axios from "axios";
import { prisma } from "../../prisma/prismaClient.js";
import { logErr } from "../utils/logger.js";

export const teamRouter = Router();

teamRouter.get("/", async (req, res, next) => {
    try {
        const teams = await prisma.team.findMany({
            include: { members: true },
        });
        res.status(200).json(teams);
    } catch (error) {
        logErr(JSON.stringify(error));
        res.status(400).json(error);
    }
});

teamRouter.get("/:uuid/members", async (req, res, next) => {
    try {
        const { uuid } = req.params;
        const team = await prisma.team.findUnique({
            where: { uuid },
            include: { members: true },
        });
        res.status(team ? 200 : 404).json(
            team ? team.members : "Team not found"
        );
    } catch (error) {
        logErr(JSON.stringify(error));
        res.status(400).json(error);
    }
});

teamRouter.get("/:uuid/score", async (req, res, next) => {
    try {
        const { uuid } = req.params;
        const team = await prisma.team.findUnique({
            where: { uuid },
            select: { name: true, sprite: true },
        });
        if (!team) {
            res.status(404).json("Team not found.");
        } else {
            const members = await prisma.user.findMany({
                where: { teamUuid: uuid },
            });
            const score = members.reduce((acc, curVal) => {
                acc += curVal.score;
                return acc;
            }, 0);
            res.status(200).json({ ...team, teamScore: score });
        }
    } catch (error) {
        logErr(JSON.stringify(error));
        res.status(400).json(error);
    }
});

teamRouter.post("/", async (req, res, next) => {
    try {
        const { name, sprite } = req.body;
        const teamExists = await prisma.team.findFirst({ where: { name } });
        if (teamExists) {
            res.status(400).json("Team already exists.");
        } else {
            const rdmPokeNum = Math.floor(Math.random() * 1010);
            let spriteSet: string = "";
            if (sprite) {
                spriteSet = sprite;
            } else {
                const pokeSprite = (
                    await axios({
                        method: "GET",
                        url: `https://pokeapi.co/api/v2/pokemon/${rdmPokeNum}`,
                    })
                ).data?.sprites?.front_default as string | undefined;
                if (pokeSprite) spriteSet = pokeSprite;
            }
            const team = await prisma.team.create({
                data: { name, sprite: spriteSet },
            });
            res.status(200).json(team);
        }
    } catch (error) {
        logErr(JSON.stringify(error));
        res.status(400).json(error);
    }
});
