import { Request, Response, NextFunction } from 'express';
import eesSchema from '../../db/schemas/eesSchema';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const eesVariableMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const {
    body: { ees },
  } = request;

  response.statusCode = 200;
  response.validation.schema = eesSchema;
  response.validation.data = ees;
  next();
};

export default eesVariableMiddleware;
