import app from "./app";
import { prisma } from "./lib/prisma";

const port = process.env.PORT || 3000;

const main = async () => {
  try {
    prisma.$connect();
    console.log("Database connected successfully");

    app.listen(port, () => {
      console.log(`server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
    prisma.$disconnect();
    process.exit(1);
  }
};

main();
