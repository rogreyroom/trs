import { Request, Response } from 'express';
import { IDbOperationResult } from '../../../db/actions/_types';
import eesResponseHandler from '../../ees/responseHandler';

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let responseObject: IDbOperationResult;

beforeEach(() => {
  process.env.NODE_ENV = 'test';
  jest.clearAllMocks();
  mockRequest = {};
  mockResponse = {
    statusCode: 0,
    json: jest.fn().mockImplementation((result) => {
      responseObject = result;
    }),
    setHeader: jest.fn(),
  };
});

describe('Handle api/ees and api/ees/:symbol responses', () => {
  it('should return statusCode 200 for the GET method if get("api/ees") is successful', async () => {
    mockRequest = {
      method: 'GET',
      url: 'api/ees',
    };
    const expectedStatus = 200;
    const expectedResultMessage = 'Eee data OK.';

    await eesResponseHandler(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.statusCode).toBe(expectedStatus);
    expect(responseObject.status).toBeTruthy();
    expect(responseObject.message).toEqual(expectedResultMessage);
  });

  it('should return status 200 for the POST method if post("api/ees") is successful', async () => {
    mockRequest = {
      method: 'POST',
      url: 'api/ees',
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

  it('should return statusCode 200 for the GET method if get("api/ees/:symbol") is successful', async () => {
    const symbol = '4H';
    mockRequest = {
      method: 'GET',
      url: `api/ees/${symbol}`,
      params: {
        symbol: `${symbol}`,
      },
    };

    const expectedStatus = 200;
    const expectedResultMessage = 'Eee data OK.';

    await eesResponseHandler(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.statusCode).toBe(expectedStatus);
    expect(responseObject.status).toBeTruthy();
    expect(responseObject.message).toEqual(expectedResultMessage);
  });

  it('should return status 200 for the PUT method if put("api/ees/:symbol") is successful', async () => {
    const symbol = '4H';
    mockRequest = {
      method: 'PUT',
      url: `api/ees/${symbol}`,
      params: {
        symbol: `${symbol}`,
      },
      body: {
        doc: 'ees',
        type: 'task-oriented',
        countType: 'auto',
        symbol: '4H',
        percent: '50',
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

  it('should return status 400 for the PUT method if the symbol param is not set', async () => {
    mockRequest = {
      method: 'PUT',
      url: `api/ees/`,
      body: {
        doc: 'ees',
        type: 'task-oriented',
        countType: 'auto',
        symbol: '4H',
        percent: '50',
        description: 'Some ees description',
      },
    };
    const expectedStatus = 400;
    const expectedResultMessage = 'Eee symbol not set.';

    await eesResponseHandler(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.statusCode).toBe(expectedStatus);
    expect(responseObject.status).toBeFalsy();
    expect(responseObject.message).toEqual(expectedResultMessage);
  });

  it('should return status 405 if request method PATCH is not allowed', async () => {
    mockRequest = {
      method: 'PATCH',
      url: 'api/ees',
    };
    const expectedStatus = 405;
    const expectedResultMessage = 'Method PATCH not allowed.';

    await eesResponseHandler(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.statusCode).toBe(expectedStatus);
    expect(responseObject.status).toBeFalsy();
    expect(responseObject.message).toEqual(expectedResultMessage);
  });

  it('should return Error: Internal Sever Error. if get("api/ees") server error occurs', async () => {
    mockRequest = {
      method: 'GET',
      url: `api/ees`,
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

  it('should return Error: Internal Sever Error. if get("api/ees/:symbol") server error occurs', async () => {
    const symbol = '4H';
    mockRequest = {
      method: 'GET',
      url: `api/ees`,
      params: { symbol },
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

  it('should return Error: Internal Sever Error. if post("api/ees") server error occurs', async () => {
    mockRequest = {
      method: 'POST',
      url: `api/ees`,
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
