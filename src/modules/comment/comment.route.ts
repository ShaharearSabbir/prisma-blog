import { Router } from "express";
import { commentController } from "./comment.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router();

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.createComment,
);

router.get("/:id", commentController.getCommentById);

export const commentRoutes: Router = router;
