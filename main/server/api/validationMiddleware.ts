import { Request, Response, NextFunction } from 'express';
import schemaValidator from '../db/schemas/validator';

const validationMiddleware = async (_request: Request, response: Response, next: NextFunction): Promise<void> => {
  const { validation } = response.locals;

  try {
    const validator = await schemaValidator(validation?.schema, validation?.data);

    if (!validator.status && validator.message === 'Schema and/or data not found!') {
      response.statusCode = 400;
      response.locals = {
        validationResult: validator,
      };
      return next();
    }
    if (!validator.status) {
      response.statusCode = 409;
      response.locals = {
        validationResult: validator,
      };
      return next();
    }

    response.statusCode = 200;
    response.locals = {
      validationResult: validator,
    };
    return next();
  } catch (error) {
    throw new Error(`Schema validator failed.`);
  }
};

export default validationMiddleware;
