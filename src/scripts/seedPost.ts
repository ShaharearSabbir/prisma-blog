import { prisma } from "../lib/prisma";

async function main() {
  const authorIds = [
    "f9NdlZOFKX19daHWttRD9Ucxrt9D2zwp",
    "viQXVfUYSDcrbZnVucOM5Ei35Frc1Gd4",
  ];

  console.log("Starting to seed posts...");

  for (const authorId of authorIds) {
    for (let i = 1; i <= 10; i++) {
      await prisma.post.create({
        data: {
          title: `Post ${i} by Author ${authorId.substring(0, 5)}`,
          content: `This is the detailed content for post number ${i}. It is written by author ${authorId}.`,
          thumbnail: `https://picsum.photos/seed/${authorId}${i}/800/600`,
          isFeatured: i % 5 === 0, // Makes every 5th post featured
          status: "PUBLISHED",
          tags: ["tech", "prisma", "database"],
          authorId: authorId,
          views: Math.floor(Math.random() * 100),
        },
      });
    }
  }

  console.log("Successfully created 20 posts!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
