import { NextFunction, Request, Response } from 'express';
import * as Yup from 'yup';

export const validateRequest = (schema: Yup.ObjectSchema<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validate(req.body, { strict: true, abortEarly: false });
            next();
          } catch (err) {
            if (err instanceof Yup.ValidationError) {
              return res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: err.inner.map(error => ({
                    path: error.path,
                    message: error.message,
                })),
              });
            }
            next(err);
          }
    }
}