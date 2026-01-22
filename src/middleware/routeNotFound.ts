import { Request, Response } from "express";
import sendRes from "../utils/sendRes";

const routeNotFound = async (req: Request, res: Response) => {
    sendRes(res, 404, false, "Route not found", {path: req.originalUrl});
}

export default routeNotFound