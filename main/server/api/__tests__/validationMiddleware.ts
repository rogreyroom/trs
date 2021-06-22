import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import validationMiddleware from '../validationMiddleware';

const mocNext: Partial<NextFunction> = jest.fn();
let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;

const testSchema = Joi.object().keys({
  doc: Joi.string().required().error(new Error(`Doc name is required`)),
  type: Joi.string().required().error(new Error(`Type is required and should be a string!`)),
  symbol: Joi.string().required().error(new Error(`Symbol is required and should be a string`)),
});

beforeEach(() => {
  mockResponse = {
    statusCode: 0,
  };
});

describe('Validate', () => {
  it('should return response statusCode 400, result status: false and result message: Schema and/or data not found! if input data or schema is not provided', async () => {
    mockResponse = {
      locals: {
        validation: {
          schema: testSchema,
          data: null,
        },
      },
    };
    const expectedStatus = 400;
    const expectedResultMessage = 'Schema and/or data not found!';

    await validationMiddleware(mockRequest as Request, mockResponse as Response, mocNext as NextFunction);

    expect(mockResponse.locals?.validationResult.message).toEqual(expectedResultMessage);
    expect(mockResponse.statusCode).toBe(expectedStatus);
    expect(mockResponse.locals?.validationResult.status).toBeFalsy();
  });

  it('should return response statusCode 409, result status: false and message: Symbol is required and should be a string if schema validation fails', async () => {
    mockResponse = {
      locals: {
        validation: {
          schema: testSchema,
          data: {
            doc: 'test',
            type: 'test-type',
          },
        },
      },
    };
    const expectedStatus = 409;
    const expectedResultMessage = 'Symbol is required and should be a string';

    await validationMiddleware(mockRequest as Request, mockResponse as Response, mocNext as NextFunction);

    expect(mockResponse.locals?.validationResult.message).toEqual(expectedResultMessage);
    expect(mockResponse.statusCode).toBe(expectedStatus);
    expect(mockResponse.locals?.validationResult.status).toBeFalsy();
  });

  it('should return response statusCode 200, result status: true, message: Schema is OK! and value object with validation value if schema validation passes', async () => {
    mockResponse = {
      locals: {
        validation: {
          schema: testSchema,
          data: {
            doc: 'test',
            type: 'task',
            symbol: 'TEST222',
          },
        },
      },
    };
    const expectedStatus = 200;
    const expectedResultMessage = 'Schema is OK!';
    const expectedResultData = mockResponse?.locals?.validation?.data;

    await validationMiddleware(mockRequest as Request, mockResponse as Response, mocNext as NextFunction);

    expect(mockResponse.locals?.validationResult.message).toEqual(expectedResultMessage);
    expect(mockResponse.statusCode).toBe(expectedStatus);
    expect(mockResponse.locals?.validationResult.status).toBeTruthy();
    expect(mockResponse.locals?.validationResult.value).toEqual(expectedResultData);
  });
});
