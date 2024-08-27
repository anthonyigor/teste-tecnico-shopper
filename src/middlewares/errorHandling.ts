import { NextFunction, Request, Response } from "express";
import { BadRequest } from "../errors/BadRequest";

export const errorHandling = (err: Error & BadRequest, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode).json({
        message: err.message,
    });
}