import { Comment, CommentStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

interface IComment {
  userId: string;
  postId: string;
  content: string;
}

const createComment = async (
  comment: Omit<Comment, "id" | "createdAt" | "updatedAt">,
) => {
  const result = await prisma.comment.create({
    data: {
      content: comment.content,
      authorId: comment.authorId,
      post: {
        connect: {
          postId: comment.postId,
        },
      },
      ...(comment.parentId && {
        parent: {
          connect: {
            commentId: comment.parentId,
          },
        },
      }),
    },
  });

  return result;
};

const getCommentById = async (commentId: string) => {
  const result = await prisma.comment.findUnique({
    where: {
      commentId: commentId,
    },
    include: {
      replies: {
        where: {
          status: CommentStatus.APPROVED,
        },
        orderBy: { createdAt: "asc" },
        include: {
          replies: {
            where: {
              status: CommentStatus.APPROVED,
            },
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  return result;
};

const deleteComment = async (commentId: string, authorId: string) => {
  const isExist = await prisma.comment.findFirst({
    where: {
      commentId,
      authorId,
    },
    select: {
      commentId: true,
    },
  });

  if (!isExist) {
    throw new Error("comment not found");
  }

  return await prisma.comment.delete({
    where: {
      commentId: isExist.commentId,
    },
  });
};

const updateComment = async (
  commentId: string,
  authorId: string,
  data: { content?: string; status?: CommentStatus },
) => {
  const isExist = await prisma.comment.findFirst({
    where: {
      commentId,
      authorId,
    },
    select: {
      commentId: true,
    },
  });

  if (!isExist) {
    throw new Error("comment not found");
  }

  return await prisma.comment.update({
    where: {
      commentId: isExist.commentId,
    },
    data,
  });
};

const moderateComment = async (commentId: string, status: CommentStatus) => {
  const commentData = await prisma.comment.findFirstOrThrow({
    where: {
      commentId,
    },
  });

  if (commentData.status == status) {
    throw new Error(`comment status: ${status} is already up to date`);
  }

  return await prisma.comment.update({
    where: {
      commentId,
    },
    data: { status: status },
  });
};

export const commentService = {
  createComment,
  getCommentById,
  deleteComment,
  updateComment,
  moderateComment,
};
