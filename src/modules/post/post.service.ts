import { Post, PostStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt">,
) => {
  const result = prisma.post.create({
    data,
  });
  return result;
};

interface GetPostsProps {
  search?: string | undefined;
  tags?: string[] | [];
  isFeatured?: boolean | undefined;
  status?: PostStatus | undefined;
  authorId?: string | undefined;
  skip: number;
  limit: number;
  sortBy: string;
  orderBy: "asc" | "desc";
}

const getPosts = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
  skip,
  limit,
  sortBy,
  orderBy,
}: GetPostsProps) => {
  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      {
        title: {
          contains: search as string,
          mode: "insensitive",
        },
      },
      {
        content: {
          contains: search as string,
          mode: "insensitive",
        },
      },
      {
        tags: {
          has: search as string,
        },
      },
    ];
  }

  if (tags) {
    where.tags = {
      hasEvery: tags as string[],
    };
  }

  if (isFeatured !== undefined) {
    where.isFeatured = isFeatured;
  }

  if (status) {
    where.status = status;
  }

  if (authorId) {
    where.authorId = authorId;
  }

  const result = await prisma.post.findMany({
    take: limit,
    skip,
    where,
    orderBy: { [sortBy]: orderBy },
  });

  return result;
};

export const postService = {
  createPost,
  getPosts,
};
