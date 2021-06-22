import { Router } from 'express';
import validationMiddleware from '../validationMiddleware';
import eesResponseHandler from './responseHandler';
import eesVariableMiddleware from './variableMiddleware';

const eesRouter = Router();

eesRouter.get('/', eesResponseHandler);
eesRouter.get('/:symbol', eesResponseHandler);
eesRouter.post('/', eesVariableMiddleware, validationMiddleware, eesResponseHandler);
eesRouter.put('/:symbol', eesVariableMiddleware, validationMiddleware, eesResponseHandler);

export default eesRouter;
