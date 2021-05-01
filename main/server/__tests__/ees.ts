import { IEes } from '../db/actions/_types';
import readDatabases from '../db/actions/read';
import updateDatabases from '../db/actions/update';
import eesSchema from '../db/schemas/eesSchema';
import schemaValidator from '../db/schemas/validator';

beforeEach(() => {
  process.env.NODE_ENV = 'test';
});

describe('Find all ees data', () => {
  it('should be empty array if ees data do not exist', async () => {
    const eesData: IEes[] = await readDatabases.GET_ALL_EES_DATA();
    expect(eesData).toEqual([]);
  });

  it('should return array of objects if ees data exist', async () => {
    const eesData: IEes[] = await readDatabases.GET_ALL_EES_DATA();
    expect(eesData.length).toBeGreaterThan(0);
  });
});

describe('Find ees data by ees id', () => {
  it('it should be null if ees do not exist', async () => {
    const firstEesDataId = '0';
    const singleEesData: IEes = await readDatabases.GET_EES_DATA_BY_ID(firstEesDataId);
    expect(singleEesData).toBeNull();
  });

  it('should return first object from database', async () => {
    const eesData: IEes[] = await readDatabases.GET_ALL_EES_DATA();
    // eslint-disable-next-line no-underscore-dangle
    const firstEesDataId = eesData[0]?._id;

    const singleEesData: IEes = await readDatabases.GET_EES_DATA_BY_ID(firstEesDataId);
    expect(singleEesData).not.toBeNull();
    expect(singleEesData).toEqual(expect.objectContaining({ _id: firstEesDataId }));
  });
});

describe('Validate data and update ees data by id', () => {
  const updatedEesData: IEes = {
    doc: 'ees',
    type: 'task-oriented',
    countType: 'auto',
    symbol: '4HHHH',
    percent: '250',
    description: 'pracownik przepracuję dwie soboty w miesiącu lub podczas dwóch weekendów osiągnie stan 12 godzin',
  };

  it('should return error massage if validation fails', () => {
    const validation = schemaValidator(eesSchema, { doc: 'fake' });
    expect(validation.status).toBeFalsy();
  });

  it('should return value object if validation pass', () => {
    const validation = schemaValidator(eesSchema, updatedEesData);
    expect(validation.status).toBeTruthy();
  });

  it('should return status: false when document not found', async () => {
    const result = await updateDatabases.UPDATE_EES_DATA_BY_ID('0', updatedEesData);
    expect(result.status).toBeFalsy();
    expect(result.value).toEqual('Update failed!');
  });

  it('should return status: false and validation error value: Doc name is required', async () => {
    const firstEesDataId = '94JL3S80mEfRsUl1';
    const result = await updateDatabases.UPDATE_EES_DATA_BY_ID(firstEesDataId, {});
    expect(result.status).toBeFalsy();
    expect(result.value).toEqual('Doc name is required');
  });

  it('should update ees data and return status: true and value: Update successful!', async () => {
    const firstEesDataId = '94JL3S80mEfRsUl1';
    const result = await updateDatabases.UPDATE_EES_DATA_BY_ID(firstEesDataId, updatedEesData);
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual('Update successful!');
  });
});
