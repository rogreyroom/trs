import { Request, Response, NextFunction } from 'express';
import schemaValidator from '../db/schemas/validator';

const validationMiddleware = async (request: Request, response: Response, next: NextFunction) => {
  const { validation } = request;

  try {
    const validator = await schemaValidator(validation.schema, validation.data);

    if (!validator.status && validator.message === 'Schema and/or data not found!') {
      response.statusCode = 400;
      return response.json(validator);
    }
    if (!validator.status) {
      response.statusCode = 409;
      return response.json(validator);
    }

    response.statusCode = 200;
    response.json(validator);
    next();
  } catch (error) {
    throw new Error(`Schema validator failed.`);
  }
};

export default validationMiddleware;
