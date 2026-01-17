import { Request, Response } from "express";
import { postService } from "./post.service";
import sendRes from "../../utils/sendRes";
import { PostStatus } from "../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response) => {
  try {
    const newPost = req.body;

    newPost.authorId = req.user?.id;

    const result = await postService.createPost(newPost);
    sendRes(res, 201, true, "successfully posted", result);
  } catch (error: any) {
    sendRes(res, 500, false, error.message);
  }
};

const getPosts = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
          ? false
          : undefined
      : undefined;

    const status = req.query.status as PostStatus | undefined;

    const authorId = req.query.authorId as string | undefined;

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const skip = (page - 1) * limit;

    const sortBy = (req.query.sortBy || "createdAt") as string;
    const orderBy = (req.query.orderBy || "desc") as "asc" | "desc";

    const result = await postService.getPosts({
      search,
      tags,
      isFeatured,
      status,
      authorId,
      skip,
      limit,
      sortBy,
      orderBy,
    });
    sendRes(res, 200, true, "successfully retrieved posts", result);
  } catch (error: any) {
    sendRes(res, 500, false, error.message);
  }
};

export const PostController = {
  createPost,
  getPosts,
};
