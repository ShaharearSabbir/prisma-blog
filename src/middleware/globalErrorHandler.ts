import { NextFunction, Request, Response } from "express";
import sendRes from "../utils/sendRes";
import { Prisma } from "../../generated/prisma/client";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  let statusCode = 500
  let errorMessage = "Internal server error"

  if(err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400
    errorMessage = "You provided incorrect field type or missing required fields"
  }else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if(err.code === "P2025"){
      statusCode = 400;
      errorMessage= "Data not found using your provided information"
    }else if(err.code === "P2002"){
      statusCode = 400;
      errorMessage= "Data already exist using your provided information"
    }else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage= "Foreign key constraint failed"
    }
  }else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    errorMessage = "Unknown error occurred during query execution"
  }else if (err instanceof Prisma.PrismaClientRustPanicError){
    errorMessage = "Internal engine panic error"
  }else if (err instanceof Prisma.PrismaClientInitializationError){
    if(err.errorCode === "P1000"){
      statusCode = 401
      errorMessage = "Authentication failed. Please check your credentials"
    }else if (err.errorCode === "P1001"){
      statusCode = 400,
      errorMessage = "Cant reach database"
    }
  }

  return sendRes(res, statusCode, false, errorMessage, undefined, err);
};

export default globalErrorHandler
