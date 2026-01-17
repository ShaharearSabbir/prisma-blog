import { Response } from "express";

interface ResJson {
  success: boolean;
  message: string;
  data?: Record<string, any>;
}

const sendRes = (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: Record<string, any>,
) => {
  const resJson: ResJson = {
    success,
    message,
  };

  if (data) {
    resJson.data = data;
  }

  res.status(statusCode).json(resJson);
};

export default sendRes;
