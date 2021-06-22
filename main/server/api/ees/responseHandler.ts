import { Request, Response } from 'express';
import addDatabases from '../../db/actions/add';
import readDatabases from '../../db/actions/read';
import updateDatabases from '../../db/actions/update';

const eesResponseHandler = async (request: Request, response: Response): Promise<Response | undefined> => {
  const { method, body, params } = request;
  const { locals } = response;
  const hasParams = {}.hasOwnProperty.call(request, 'params');

  switch (method) {
    case 'GET':
      if (hasParams && {}.hasOwnProperty.call(params, 'symbol')) {
        try {
          const data = await readDatabases.GET_EES_DATA_BY_SYMBOL(params.symbol);
          response.statusCode = 200;
          return response.json({
            status: true,
            message: 'Eee data OK.',
            value: data,
          });
        } catch (error) {
          throw new Error('Internal Sever Error.');
        }
      }

      try {
        const data = await readDatabases.GET_ALL_EES_DATA();
        response.statusCode = 200;
        return response.json({
          status: true,
          message: 'Eee data OK.',
          value: data,
        });
      } catch (error) {
        throw new Error('Internal Sever Error.');
      }
    case 'POST':
      if (!locals?.validationResult.status) {
        response.json(locals?.validationResult);
      }

      try {
        const data = await addDatabases.ADD_EES_DATA(body);
        response.statusCode = 200;
        return response.json({
          status: true,
          message: 'Eee data OK.',
          value: data,
        });
      } catch (error) {
        throw new Error('Internal Sever Error.');
      }
    case 'PUT':
      if (!locals?.validationResult.status) {
        response.json(locals?.validationResult);
      }

      if (hasParams && {}.hasOwnProperty.call(params, 'symbol')) {
        try {
          const data = await updateDatabases.UPDATE_EES_DATA_BY_SYMBOL(params.symbol, body);
          response.statusCode = 200;
          return response.json({
            status: true,
            message: 'Eee data OK.',
            value: data,
          });
        } catch (error) {
          throw new Error('Internal Sever Error.');
        }
      }
      response.statusCode = 400;
      return response.json({
        status: false,
        message: 'Eee symbol not set.',
      });
    default:
      response.setHeader('Allow', ['GET', 'POST', 'PUT']);
      response.statusCode = 405;
      return response.json({
        status: false,
        message: `Method ${method} not allowed.`,
      });
  }
};

export default eesResponseHandler;
