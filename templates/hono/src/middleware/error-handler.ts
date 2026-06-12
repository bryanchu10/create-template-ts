import type { ErrorHandler } from "hono";
import { logger } from "../lib/logger";

export const errorHandler: ErrorHandler = (err, c) => {
    logger.error({ err }, "Unhandled error");

    return c.json({ message: "Internal server error" }, 500);
};
