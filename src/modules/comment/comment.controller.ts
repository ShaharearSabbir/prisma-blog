import { Request, Response } from "express";
import { commentService } from "./comment.service";
import sendRes from "../../utils/sendRes";
import { CommentStatus } from "../../../generated/prisma/enums";

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

const deleteComment = async (req: Request, res: Response) => {
  try {
    const authorId = req.user?.id;
    const commentId = req.params.id;
    const result = await commentService.deleteComment(
      commentId as string,
      authorId as string,
    );
    sendRes(res, 201, true, "Comment Deleted Successfully", result);
  } catch (error: any) {
    sendRes(res, 500, false, error.message);
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const authorId = req.user?.id;
    const commentId = req.params.id;
    const result = await commentService.updateComment(
      commentId as string,
      authorId as string,
      req.body,
    );
    sendRes(res, 201, true, "Comment Updated Successfully", result);
  } catch (error: any) {
    sendRes(res, 500, false, error.message);
  }
};

const moderateComment = async (req: Request, res: Response) => {
  try {
    const status = req.body.status as CommentStatus;
    const commentId = req.params.id;
    const result = await commentService.moderateComment(
      commentId as string,
      status,
    );
    sendRes(res, 201, true, "Comment Updated Successfully", result);
  } catch (error: any) {
    sendRes(res, 500, false, error.message);
  }
};

export const commentController = {
  createComment,
  getCommentById,
  deleteComment,
  updateComment,
  moderateComment,
};
