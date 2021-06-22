import { NextFunction, Request, Response } from 'express';
import eesSchema from '../../../db/schemas/eesSchema';
import eesVariableMiddleware from '../../ees/variableMiddleware';

const mocNext: Partial<NextFunction> = jest.fn();
let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;

beforeEach(() => {
  mockRequest = {
    body: {
      ees: {
        doc: 'ees',
        type: 'task-oriented',
        countType: 'auto',
        symbol: '4H',
        percent: '25',
        description: 'Some ees description',
      },
    },
  };
  mockResponse = {
    statusCode: 0,
    locals: {
      validation: {
        schema: eesSchema,
        data: {
          doc: 'ees',
          type: 'task-oriented',
          countType: 'auto',
          symbol: '4H',
          percent: '25',
          description: 'Some ees description',
        },
      },
    },
  };
});

describe('Validate ees', () => {
  it('should return response statusCode 200 and validation object with schema and data objects', async () => {
    const expectedStatus = 200;
    const expectedSchema = eesSchema;
    const expectedData = {
      doc: 'ees',
      type: 'task-oriented',
      countType: 'auto',
      symbol: '4H',
      percent: '25',
      description: 'Some ees description',
    };

    await eesVariableMiddleware(mockRequest as Request, mockResponse as Response, mocNext as NextFunction);

    expect(mockResponse.statusCode).toBe(expectedStatus);
    expect(mockResponse.locals?.validation?.schema).toEqual(expectedSchema);
    expect(mockResponse.locals?.validation?.data).toEqual(expectedData);
  });
});
