import { Request, Response, NextFunction } from 'express';
import * as Yup from 'yup';

export const validateQuery = (schema: Yup.ObjectSchema<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validate(req.query, { strict: true, abortEarly: false });
            next();
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                return res.status(400).json({
                    error_code: "INVALID_TYPE",
                    error_description: "Tipo de medição não permitida"
                });
            }
            next(err);
        }
    };
};
