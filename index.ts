import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { morganMiddleware, logErr, logInfo } from "./src/utils/logger.js";
import { prisma } from "./prisma/prismaClient.js";
// routes
import { userRouter, teamRouter } from "./src/router/index.js";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morganMiddleware);

app.get("/", (_req, res) => {
    res.status(200).json("Welcome!");
});

app.use("/users", userRouter);
app.use("/teams", teamRouter);

app.listen(9000, async () => {
    try {
        logInfo("Listenin on PORT 9000");
    } catch (error) {
        await prisma.$disconnect();
        logErr(JSON.stringify(error));
    }
});
