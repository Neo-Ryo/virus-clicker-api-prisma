import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.get("/", (_req, res) => {
    res.status(200).json("Welcome!");
});

app.listen(9000, () => {
    console.log("Listenin on PORT 9000");
});
