import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { IDbOperationResult } from '../../db/actions/_types';
import validationMiddleware from '../validationMiddleware';

const mocNext: Partial<NextFunction> = jest.fn();
let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let responseObject: IDbOperationResult;

const testSchema = Joi.object().keys({
  doc: Joi.string().required().error(new Error(`Doc name is required`)),
  type: Joi.string().required().error(new Error(`Type is required and should be a string!`)),
  symbol: Joi.string().required().error(new Error(`Symbol is required and should be a string`)),
});

beforeEach(() => {
  mockResponse = {
    statusCode: 0,
    json: jest.fn().mockImplementation((result) => {
      responseObject = result;
    }),
  };
});

describe('Validate', () => {
  it('should return response statusCode 400, result status: false and result message: Schema and/or data not found! if input data or schema is not provided', async () => {
    mockRequest = {
      validation: {
        data: null,
        schema: null,
      },
    };
    const expectedStatus = 400;
    const expectedResultMessage = 'Schema and/or data not found!';

    await validationMiddleware(mockRequest as Request, mockResponse as Response, mocNext as NextFunction);

    expect(responseObject.message).toEqual(expectedResultMessage);
    expect(mockResponse.statusCode).toBe(expectedStatus);
    expect(responseObject.status).toBeFalsy();
  });

  it('should return response statusCode 409, result status: false and message: Symbol is required and should be a string if schema validation fails', async () => {
    mockRequest = {
      validation: {
        data: {
          doc: 'test',
          type: 'test-type',
        },
        schema: testSchema,
      },
    };
    const expectedStatus = 409;
    const expectedResultMessage = 'Symbol is required and should be a string';

    await validationMiddleware(mockRequest as Request, mockResponse as Response, mocNext as NextFunction);

    expect(responseObject.message).toEqual(expectedResultMessage);
    expect(mockResponse.statusCode).toBe(expectedStatus);
    expect(responseObject.status).toBeFalsy();
  });

  it('should return response statusCode 200, result status: true, message: Schema is OK! and value object with validation value if schema validation passes', async () => {
    mockRequest = {
      validation: {
        data: {
          doc: 'test',
          type: 'test-type',
          symbol: 'TT001',
        },
        schema: testSchema,
      },
    };
    const expectedStatus = 200;
    const expectedResultMessage = 'Schema is OK!';

    await validationMiddleware(mockRequest as Request, mockResponse as Response, mocNext as NextFunction);

    expect(responseObject.message).toEqual(expectedResultMessage);
    expect(mockResponse.statusCode).toBe(expectedStatus);
    expect(responseObject.status).toBeTruthy();
    expect(responseObject.value).toEqual(mockRequest.validation.data);
  });
});
