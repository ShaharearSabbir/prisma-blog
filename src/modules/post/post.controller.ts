import { NextFunction, Request, Response } from "express";
import { postService } from "./post.service";
import sendRes from "../../utils/sendRes";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationAndSort from "../../utils/paginationAndSort";
import { UserRole } from "../../middleware/auth";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newPost = req.body;

    newPost.authorId = req.user?.id;

    const result = await postService.createPost(newPost);
    sendRes(res, 201, true, "successfully posted", result);
  } catch (error: any) {
    next(error);
  }
};

const getPosts = async (req: Request, res: Response, next: NextFunction) => {
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

    const { skip, limit, sortBy, orderBy, page } = paginationAndSort(req.query);

    const result = await postService.getPosts({
      search,
      tags,
      isFeatured,
      status,
      authorId,
      skip,
      limit,
      page,
      sortBy,
      orderBy,
    });
    sendRes(res, 200, true, "successfully retrieved posts", result);
  } catch (error: any) {
    next(error);
  }
};

const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const result = await postService.getPostById(id as string);
    sendRes(res, 200, true, "successfully retrieved post", result!);
  } catch (error: any) {
    next(error);
  }
};

const getMyPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorId = req.user?.id;

    const result = await postService.getMyPost(authorId as string);
    sendRes(res, 201, true, "successfully retrieved post", result!);
  } catch (error: any) {
    next(error);
  }
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorId = req.user?.id;
    const postId = req.params.id;
    const data = req.body;
    const isAdmin = req.user?.role === UserRole.ADMIN;

    const result = await postService.updatePost(
      authorId as string,
      postId as string,
      data,
      isAdmin,
    );
    sendRes(res, 200, true, "Successfully Updated Post", result);
  } catch (error: any) {
    next(error);
  }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorId = req.user?.id;
    const postId = req.params.id;
    const isAdmin = req.user?.role === UserRole.ADMIN;

    const result = await postService.deletePost(
      postId as string,
      authorId as string,
      isAdmin,
    );
    sendRes(res, 201, true, "Successfully Deleted Post", result);
  } catch (error: any) {
    next(error);
  }
};

const postStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await postService.postStats();
    sendRes(res, 200, true, "Successfully retrieved stats", result);
  } catch (error: any) {
    next(error);
  }
};

export const PostController = {
  createPost,
  getPosts,
  getPostById,
  getMyPost,
  updatePost,
  deletePost,
  postStats,
};
