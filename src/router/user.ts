import { Router } from "express";
import { prisma } from "../../prisma/prismaClient.js";
import { logErr } from "../utils/logger.js";

export const userRouter = Router();

userRouter.get("/", async (req, res, next) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        logErr(JSON.stringify(error));
        res.status(400).json(error);
    }
});

// test raw not so raw queries ==> filtering db easily
userRouter.get("/search/:partialName", async (req, res, next) => {
    try {
        const { partialName } = req.params;
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { startsWith: partialName } },
                    { name: { endsWith: partialName } },
                ],
            },
        });
        res.status(200).json(users);
    } catch (error) {
        logErr(JSON.stringify(error));
        res.status(400).json(error);
    }
});

userRouter.post("/", async (req, res, next) => {
    try {
        const { name } = req.body;
        const userExists = await prisma.user.findFirst({ where: { name } });
        if (userExists) {
            res.status(400).json("User already exists.");
        } else {
            const users = await prisma.user.create({ data: { name } });
            res.status(200).json(users);
        }
    } catch (error) {
        logErr(JSON.stringify(error));
        res.status(400).json(error);
    }
});

userRouter.get("/:uuid/click", async (req, res, next) => {
    try {
        const { uuid } = req.params;
        const user = await prisma.user.findFirst({ where: { uuid } });
        if (!user) {
            res.status(400).json("User already exists.");
        } else {
            const userScore = await prisma.user.update({
                where: { uuid },
                data: { score: user.score + 1 },
                include: { team: true },
            });
            res.status(200).json(userScore);
        }
    } catch (error) {
        logErr(JSON.stringify(error));
        res.status(400).json(error);
    }
});

userRouter.post("/:uuid/join/:teamUuid", async (req, res, next) => {
    try {
        const { uuid, teamUuid } = req.params;
        const user = await prisma.user.findUnique({ where: { uuid } });
        const team = await prisma.team.findUnique({
            where: { uuid: teamUuid },
        });
        if (!user || !team) {
            res.status(404).json("User or Team not found.");
        } else {
            const newTeamer = await prisma.user.update({
                where: { uuid },
                data: { teamUuid: team.uuid },
                include: { team: true },
            });
            res.status(204).json(newTeamer);
        }
    } catch (error) {
        logErr(JSON.stringify(error));
        res.status(400).json(error);
    }
});
