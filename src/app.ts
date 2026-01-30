import express, { Application } from "express";
import cors from "cors";
import { postRoutes } from "./modules/post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { commentRoutes } from "./modules/comment/comment.route";
import globalErrorHandler from "./middleware/globalErrorHandler";
import routeNotFound from "./middleware/routeNotFound";
import logger from "./utils/log";

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: [process.env.APP_URL!],
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Blog API is running...");
});

app.use((req, res, next) => {
  logger(
    `[path:${req.path}] [time: ${new Date().toISOString()}] [method: ${req.method}] [origin: ${req.headers.origin}]`,
  );
  next();
});

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/posts", postRoutes);

app.use("/api/comments", commentRoutes);

app.use(routeNotFound);

app.use(globalErrorHandler);

export default app;
