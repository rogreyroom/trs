import { Request, Response } from 'express';
import addDatabases from '../../db/actions/add';
import readDatabases from '../../db/actions/read';

const eesResponseHandler = async (request: Request, response: Response): Promise<Response | undefined> => {
  const { method, body } = request;
  const { locals } = response;

  switch (method) {
    case 'GET':
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
    default:
      response.setHeader('Allow', ['GET', 'POST']);
      response.statusCode = 405;
      return response.json({
        status: false,
        message: `Method ${method} not allowed.`,
      });
  }
};

export default eesResponseHandler;
