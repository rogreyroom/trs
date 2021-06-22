import AsyncNedb from 'nedb-async';
import { IEes } from '../actions/_types';
import addDatabases from '../actions/add';
import readDatabases from '../actions/read';
import updateDatabases from '../actions/update';
import getDbConnection from '../connection';

beforeAll(async () => {
  const eesDB: AsyncNedb<IEes> = await getDbConnection('ees');
  await eesDB.asyncRemove({}, { multi: true });
});

beforeEach(() => {
  process.env.NODE_ENV = 'test';
});

// ADD
describe('Adding a new ees  (employee evaluation system)', () => {
  const randomSymbol = Math.random().toString();
  const exampleAddEesData: IEes = {
    doc: 'ees',
    type: 'task-oriented',
    countType: 'auto',
    symbol: randomSymbol,
    percent: '25',
    description: 'pracownik przepracuję dwie soboty w miesiącu lub podczas dwóch weekendów osiągnie stan 12 godzin',
  };

  const symbolTestAddEesData: IEes = {
    doc: 'ees',
    type: 'task-oriented',
    countType: 'auto',
    symbol: '4H',
    percent: '25',
    description: 'pracownik przepracuję dwie soboty w miesiącu lub podczas dwóch weekendów osiągnie stan 12 godzin',
  };

  it('it should be successful if symbolTestAddEesData symbol does not exists and new ees was added to DB (it is hardcoded data it will PASS only once when DB is empty)', async () => {
    const result = await addDatabases.ADD_EES_DATA(symbolTestAddEesData);
    expect(result.message).toEqual('The ees data was added!');
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual(expect.objectContaining({ symbol: '4H' }));
  });

  it('it should be successful if ees symbol does not exists and new ees was added to DB', async () => {
    const result = await addDatabases.ADD_EES_DATA(exampleAddEesData);
    expect(result.message).toEqual('The ees data was added!');
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual(expect.objectContaining({ symbol: randomSymbol }));
  });

  it('it should be unsuccessful if ees symbol does exists and new ees was not added to DB', async () => {
    const result = await addDatabases.ADD_EES_DATA(symbolTestAddEesData);
    expect(result.message).toEqual('The ees does exist!');
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual(expect.objectContaining({ symbol: '4H' }));
  });
});

// FIND
describe('Finding ees (employee evaluation system)', () => {
  const symbol = '4H';

  it('it should be successful if eesArray length is greater than 0', async () => {
    const eesArray = await readDatabases.GET_ALL_EES_DATA();
    expect(eesArray.length).toBeGreaterThan(0);
  });

  it('it should be successful if eesData object has doc key equal "ees" and symbol equal "symbol = 4H"', async () => {
    const eesData = await readDatabases.GET_EES_DATA_BY_SYMBOL(symbol);
    expect(eesData).toEqual(expect.objectContaining({ doc: 'ees' }));
    expect(eesData).toEqual(expect.objectContaining({ symbol: '4H' }));
  });
});

// UPDATE
describe('Updating ees (employee evaluation system)', () => {
  const truthySymbol = '4H';
  const falsySymbol = '333PQ';
  const updatedEesData: IEes = {
    doc: 'ees',
    type: 'task-oriented',
    countType: 'auto',
    symbol: '4H',
    percent: '150',
    description: 'pracownik przepracuję dwie soboty w miesiącu lub podczas dwóch weekendów osiągnie stan 12 godzin',
  };

  it('it should be successful if given ees symbol exists and ees data was updated', async () => {
    const result = await updateDatabases.UPDATE_EES_DATA_BY_SYMBOL(truthySymbol, updatedEesData);
    expect(result.message).toEqual('The ees data was updated!');
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual(1);
  });

  it('it should be unsuccessful if given ees symbol does not exists and ees data was not updated', async () => {
    const result = await updateDatabases.UPDATE_EES_DATA_BY_SYMBOL(falsySymbol, updatedEesData);
    expect(result.message).toEqual('The ees does not exist!');
    expect(result.status).toBeFalsy();
    expect(result.value).toEqual(null);
  });
});
