import express, { Application } from "express";
import cors from "cors";
import { postRoutes } from "./modules/post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { commentRoutes } from "./modules/comment/comment.route";

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

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/posts", postRoutes);

app.use("/api/comments", commentRoutes)

export default app;
