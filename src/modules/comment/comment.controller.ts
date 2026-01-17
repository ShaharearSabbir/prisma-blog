import { Request, Response } from "express";
import { commentService } from "./comment.service";
import sendRes from "../../utils/sendRes";

const createComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const newComment = req.body;
    newComment.authorId = userId;

    const result = await commentService.createComment(newComment);
    sendRes(res, 201, true, "successfully posted", result);
  } catch (error: any) {
    sendRes(res, 500, false, error.message);
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;

    const result = await commentService.getCommentById(commentId!);

    sendRes(res, 200, true, "Comment Retrieved Successfully", result!);
  } catch (error: any) {
    sendRes(res, 500, false, error.message);
  }
};

export const commentController = {
  createComment,
  getCommentById,
};
