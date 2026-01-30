import fs from "fs";
import path from "path";

const logger = async (message: string) => {
  console.log(message);
  const logFilePath = path.join(process.cwd(), "log.txt");

  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, "");
  }
  fs.appendFileSync(logFilePath, message + "\n");
};

export default logger;
