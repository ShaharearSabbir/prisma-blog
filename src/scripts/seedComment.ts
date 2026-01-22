import { CommentStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

async function main() {
  // Author IDs from previous image
  const authorIds = [
    "f9NdlZOFKX19daHWttRD9Ucxrt9D2zwp",
    "viQXVfUYSDcrbZnVucOM5Ei35Frc1Gd4",
  ];

  // Post IDs from your recent screenshot
  const postIds = [
    "28b04187-f89c-4f52-9fec-1c8cfa1ab673",
    "ab46ce0c-e4c5-4f4c-99f7-0dd858e9bb49",
    "d8695ef5-2489-4a5f-a173-6b29e1ebdde6",
    "8a1b0d64-bff8-4548-8412-41032029eadf",
    "8007af5f-a6b8-431a-9048-fe5d3adf5bac",
    "76597005-8d52-4995-9352-e053ccabd12d",
    "e8a9cbc0-c634-40b6-bd69-eeb82e3db1a1",
    "21137088-ef18-43af-b322-5fd5537f1d1d",
    "257c9004-e0ea-4767-bf2d-61432bd4839f",
    "77d1eb98-d546-4538-b798-ea48686a66ef",
  ];

  console.log("Generating 10 parent comments...");

  const parentComments = [];

  // 1. Create 10 Top-Level Comments
  for (let i = 0; i < 10; i++) {
    const comment = await prisma.comment.create({
      data: {
        content: `Top-level insight #${i + 1} on this topic.`,
        authorId: authorIds[i % 2] as string, // Rotates between the two authors
        postId: postIds[i], // Assigns one to each of the first 10 posts
        status: CommentStatus.APPROVED,
      },
    });
    parentComments.push(comment);
  }

  console.log("Generating 10 replies...");

  // 2. Create 10 Replies (Linking to the parent IDs created above)
  for (let i = 0; i < 10; i++) {
    const parent = parentComments[i];
    await prisma.comment.create({
      data: {
        content: `Replying to your point in comment ${parent!.commentId.substring(0, 4)}...`,
        authorId: authorIds[(i + 1) % 2] as string, // Opposite author responds
        postId: parent!.postId, // Must be same postId as parent
        parentId: parent!.commentId as string, // Self-relation link
        status: "APPROVED",
      },
    });
  }

  console.log("Seeding complete! Created 10 threads (20 comments total).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
