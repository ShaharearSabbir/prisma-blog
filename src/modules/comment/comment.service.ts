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

export const commentService = {
  createComment,
  getCommentById,
};
