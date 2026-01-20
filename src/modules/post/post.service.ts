import {
  CommentStatus,
  Post,
  PostStatus,
  Prisma,
} from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middleware/auth";

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
  page: number;
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
  page,
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

  const allPost = await prisma.post.findMany({
    take: limit,
    skip,
    where,
    orderBy: { [sortBy]: orderBy },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  const total = await prisma.post.count({
    where,
  });

  const totalPage = Math.ceil(total / limit);

  return {
    posts: allPost,
    pagination: {
      totalPost: total,
      page,
      limit,
      totalPage,
    },
  };
};

const getPostById = async (id: string) => {
  const result = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        postId: id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return tx.post.findUnique({
      where: {
        postId: id,
      },
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommentStatus.APPROVED,
          },
          orderBy: { createdAt: "desc" },
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
        },
        _count: {
          select: { comments: true },
        },
      },
    });
  });

  return result;
};

const getMyPost = async (authorId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const posts = await tx.post.findMany({
      where: {
        authorId,
      },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { comments: true },
        },
      },
    });

    const count = await tx.post.count({
      where: {
        authorId,
      },
    });

    return { posts, count };
  });

  return result;
};

const updatePost = async (
  authorId: string,
  postId: string,
  data: Partial<Post>,
  isAdmin: boolean,
) => {
  const { title, content, thumbnail, isFeatured, status, tags } = data;

  const updatedData: Partial<Post> = {
    ...(title && { title }),
    ...(content && { content }),
    ...(thumbnail && { thumbnail }),
    ...(status && { status }),
    ...(tags && { tags }),
  };

  if (isAdmin && isFeatured !== undefined) {
    updatedData.isFeatured = isFeatured as boolean;
  }

  const result = await prisma.$transaction(async (tx) => {
    try {
      await tx.post.findFirstOrThrow({
        where: {
          postId: postId,
          ...(!isAdmin && { authorId: authorId }),
        },
        select: {
          postId: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new Error(
          "You're not owner of this post or the post doesn't exist",
        );
      }
      throw error;
    }

    return await tx.post.update({
      where: {
        postId: postId,
      },
      data: updatedData,
    });
  });
  return result;
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const result = await prisma.$transaction(async (tx) => {
    try {
      const isExist = await tx.post.findFirstOrThrow({
        where: {
          postId: postId,
          ...(!isAdmin && { authorId: authorId }),
        },
        select: {
          postId: true,
        },
      });

      console.log(isExist);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new Error(
          "You're not owner of this post or the post doesn't exist",
        );
      }
      throw error;
    }

    const post = await tx.post.delete({
      where: {
        postId,
      },
    });

    return post;
  });

  return result;
};

const postStats = async () => {
  const result = await prisma.$transaction(async (tx) => {
    const totalPosts = await tx.post.count();
    const totalPublishedPosts = await tx.post.count({
      where: {
        status: PostStatus.PUBLISHED,
      },
    });

    const totalArchivedPosts = await tx.post.count({
      where: {
        status: PostStatus.ARCHIVED,
      },
    });

    const totalDraftPosts = await tx.post.count({
      where: {
        status: PostStatus.DRAFT,
      },
    });

    const totalComments = await tx.comment.count();

    const totalApprovedComments = await tx.comment.count({
      where: {
        status: CommentStatus.APPROVED,
      },
    });

    const totalRejectedComments = await tx.comment.count({
      where: {
        status: CommentStatus.REJECTED,
      },
    });

    const totalUsers = await tx.user.count();

    const adminCount = await tx.user.count({
      where: {
        role: UserRole.ADMIN,
      },
    });

    const userCount = await tx.user.count({
      where: {
        role: UserRole.USER,
      },
    });

    const totalView = await tx.post.aggregate({
      _sum: {
        views: true,
      },
    });

    return {
      totalPosts,
      totalPublishedPosts,
      totalArchivedPosts,
      totalDraftPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalUsers,
      adminCount,
      userCount,
      totalView: totalView._sum.views,
    };
  });
  return result;
};

export const postService = {
  createPost,
  getPosts,
  getPostById,
  getMyPost,
  updatePost,
  deletePost,
  postStats,
};
