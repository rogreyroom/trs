import { Request, Response, NextFunction } from 'express';
import eesSchema from '../../db/schemas/eesSchema';

const eesVariableMiddleware = (request: Request, response: Response, next: NextFunction): void => {
  const {
    body: { ees },
  } = request;
  response.statusCode = 200;
  response.locals = {
    validation: { schema: eesSchema, data: ees },
  };
  return next();
};

export default eesVariableMiddleware;
