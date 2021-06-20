import request from 'supertest';
import app from '../../../app';
import { IEes } from '../../../db/actions/_types';

beforeEach(() => {
  process.env.NODE_ENV = 'test';
});

describe('Check supertest', () => {
  it('should get api/ees and have a response status code equal 200 and body message equal Eee data OK.', async () => {
    const result = await request(app).get('/api/ees');
    expect(result.statusCode).toEqual(200);
    expect(result.body.message).toEqual('Eee data OK.');
  });

  it('should post api/ees and have a response status code equal 200 and body message equal Eee data OK.', async () => {
    const randomSymbol = Math.random().toString();
    const mockData: IEes = {
      doc: 'ees',
      type: 'task-oriented',
      countType: 'auto',
      symbol: randomSymbol,
      percent: '25',
      description: 'pracownik przepracuję dwie soboty w miesiącu lub podczas dwóch weekendów osiągnie stan 12 godzin',
    };
    const result = await request(app).post('/api/ees').send({ ees: mockData });
    expect(result.statusCode).toEqual(200);
    expect(result.body.message).toEqual('Eee data OK.');
  });
});
