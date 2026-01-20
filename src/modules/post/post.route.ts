import { Router } from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router();

router.get("/", PostController.getPosts);

router.get("/stats", auth(UserRole.ADMIN), PostController.postStats);

router.get(
  "/me",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.getMyPost,
);

router.get("/:id", PostController.getPostById);

router.get("/stats", auth(UserRole.ADMIN), PostController.postStats);

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.createPost,
);

router.patch(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.updatePost,
);

router.delete(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.deletePost,
);

export const postRoutes = router;
