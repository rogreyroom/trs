import { Request, Response } from 'express';
import { IDbOperationResult } from '../../../db/actions/_types';
import eesResponseHandler from '../../ees/responseHandler';

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let responseObject: IDbOperationResult;

beforeEach(() => {
  process.env.NODE_ENV = 'test';
  mockRequest = {};
  mockResponse = {
    statusCode: 0,
    json: jest.fn().mockImplementation((result) => {
      responseObject = result;
    }),
    setHeader: jest.fn(),
  };
});

describe('Handle ees response', () => {
  it('should return statusCode 200 for the GET method if get("/ees") is successful', async () => {
    mockRequest = {
      method: 'GET',
      url: '/ees',
    };
    const expectedStatus = 200;
    const expectedResultMessage = 'Eee data OK.';

    await eesResponseHandler(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.statusCode).toBe(expectedStatus);
    expect(responseObject.status).toBeTruthy();
    expect(responseObject.message).toEqual(expectedResultMessage);
  });

  it('should return status 200 for the POST method if post("/ees") is successful', async () => {
    mockRequest = {
      method: 'POST',
      url: '/ees',
      body: {
        doc: 'ees',
        type: 'task-oriented',
        countType: 'auto',
        symbol: '4H',
        percent: '25',
        description: 'Some ees description',
      },
    };
    const expectedStatus = 200;
    const expectedResultMessage = 'Eee data OK.';

    await eesResponseHandler(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.statusCode).toBe(expectedStatus);
    expect(responseObject.status).toBeTruthy();
    expect(responseObject.message).toEqual(expectedResultMessage);
  });

  it('should return status 405 if request method PUT is not allowed', async () => {
    mockRequest = {
      method: 'PUT',
      url: '/ees',
    };
    const expectedStatus = 405;
    const expectedResultMessage = 'Method PUT not allowed.';

    await eesResponseHandler(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.statusCode).toBe(expectedStatus);
    expect(responseObject.status).toBeFalsy();
    expect(responseObject.message).toEqual(expectedResultMessage);
  });

  it('should return Error: Internal Sever Error. if get("/ees") server error occurs', async () => {
    mockRequest = {
      method: 'GET',
      url: `/ees/`,
    };

    mockResponse = {
      statusCode: 0,
      json: jest.fn().mockRejectedValue(new Error('Internal Sever Error.')),
    };

    const expectedResultMessage = 'Internal Sever Error.';

    try {
      await eesResponseHandler(mockRequest as Request, mockResponse as Response);
    } catch (error) {
      expect(error.message).toBe(expectedResultMessage);
    }
  });

  it('should return Error: Internal Sever Error. if post("/ees") server error occurs', async () => {
    mockRequest = {
      method: 'POST',
      url: `/ees/`,
    };

    mockResponse = {
      statusCode: 0,
      json: jest.fn().mockRejectedValue(new Error('Internal Sever Error.')),
    };

    const expectedResultMessage = 'Internal Sever Error.';

    try {
      await eesResponseHandler(mockRequest as Request, mockResponse as Response);
    } catch (error) {
      expect(error.message).toBe(expectedResultMessage);
    }
  });
});
