import { Router } from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router();

router.get("/", PostController.getPosts);

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.createPost,
);

router.get("/:id", PostController.getPostById);

export const postRoutes = router;
