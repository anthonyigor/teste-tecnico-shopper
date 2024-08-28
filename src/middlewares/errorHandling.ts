import { NextFunction, Request, Response } from "express";

interface CustomError extends Error {
    statusCode: number;
}

export const errorHandling = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json({
        message: err.message,
    });
}