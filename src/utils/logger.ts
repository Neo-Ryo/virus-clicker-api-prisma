import chalk from "chalk";
import morgan from "morgan";

const log = console.log;

export const logInfo = (text: string) => log(chalk.greenBright.bold(text));
export const logErr = (text: string) => log(chalk.red.bold(text));

export const morganMiddleware = morgan(function (tokens, req, res) {
    return chalk.magenta.bold(
        [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, "content-length"),
            "-",
            tokens["response-time"](req, res),
            "ms",
        ].join(" ")
    );
});
