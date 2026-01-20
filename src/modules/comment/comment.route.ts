import { Router } from "express";
import { commentController } from "./comment.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router();

router.get("/:id", commentController.getCommentById);

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.createComment,
);

router.delete(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.deleteComment,
);

router.patch(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.updateComment,
);

router.patch(
  "/:id/moderate",
  auth(UserRole.ADMIN),
  commentController.moderateComment,
);

export const commentRoutes: Router = router;
