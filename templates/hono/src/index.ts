import type { IncomingMessage, ServerResponse } from "node:http";
import process from "node:process";
import { createAdaptorServer } from "@hono/node-server";
import pinoHttp from "pino-http";
import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./lib/logger";

const app = createApp();
const httpLogger = pinoHttp({ logger });

const server = createAdaptorServer(app);

const listeners = server.listeners("request") as Array<
    (req: IncomingMessage, res: ServerResponse) => void
>;
const requestListener = listeners[0];
if (!requestListener)
    throw new Error("No request listener found on server");

server.removeAllListeners("request");
server.on("request", (req: IncomingMessage, res: ServerResponse) => {
    httpLogger(req, res, () => requestListener(req, res));
});

server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
        logger.warn(`Port ${env.PORT} in use, retrying in 1s...`);
        setTimeout(() => server.listen(env.PORT), 1000);
    }
    else {
        logger.error(err);
        process.exit(1);
    }
});

server.listen(env.PORT, () => {
    logger.info(`Server running at http://localhost:${env.PORT}`);
    if (env.NODE_ENV !== "production") {
        logger.info(`API docs:    http://localhost:${env.PORT}/docs`);
        logger.info(`OpenAPI:     http://localhost:${env.PORT}/api/openapi.json`);
    }
});

process.on("SIGINT", () => {
    server.close();
    process.exit(0);
});

process.on("SIGTERM", () => {
    setTimeout(() => process.exit(0), 1000).unref();
    server.close((err) => {
        if (err) {
            logger.error(err);
            process.exit(1);
        }
        process.exit(0);
    });
});
