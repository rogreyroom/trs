import AsyncNedb from 'nedb-async';
import { IPublicHolidays } from '../actions/_types';
import addDatabases from '../actions/add';
import readDatabases from '../actions/read';
import getDbConnection from '../connection';

beforeAll(async () => {
  const holidaysDB: AsyncNedb<IPublicHolidays> = await getDbConnection('holidays');
  await holidaysDB.asyncRemove({}, { multi: true });
});

beforeEach(() => {
  process.env.NODE_ENV = 'test';
});

// ADD
describe('Adding public holidays for a new year', () => {
  const randomYear = Math.random();
  const examplePublicHolidays: IPublicHolidays = {
    doc: 'holidays',
    year: randomYear,
    publicHolidays: [
      { year: 2021, month: 1, day: 1, name: 'Nowy Rok' },
      { year: 2021, month: 1, day: 6, name: 'Święto Trzech Króli' },
      { year: 2021, month: 5, day: 1, name: 'Święto Pracy' },
      { year: 2021, month: 5, day: 3, name: 'Święto Narodowe Trzeciego Maja' },
      { year: 2021, month: 8, day: 15, name: 'Wniebowzięcie Najświętszej Marii Panny' },
      { year: 2021, month: 11, day: 1, name: 'Wszystkich Świętych' },
      { year: 2021, month: 11, day: 11, name: 'Narodowe Święto Niepodległości' },
      { year: 2021, month: 12, day: 25, name: 'Pierwszy dzień Bożego Narodzenia' },
      { year: 2021, month: 12, day: 26, name: 'Drugi dzień Bożego Narodzenia' },
      { year: 2021, month: 4, day: 4, name: 'Wielkanoc' },
      { year: 2021, month: 4, day: 5, name: 'Poniedziałek Wielkanocny' },
      { year: 2021, month: 5, day: 23, name: 'Zesłanie Ducha Świętego' },
      { year: 2021, month: 6, day: 3, name: 'Boże Ciało' },
    ],
  };
  const yearPublicHolidays: IPublicHolidays = {
    doc: 'holidays',
    year: 2021,
    publicHolidays: [
      { year: 2021, month: 1, day: 1, name: 'Nowy Rok' },
      { year: 2021, month: 1, day: 6, name: 'Święto Trzech Króli' },
      { year: 2021, month: 5, day: 1, name: 'Święto Pracy' },
      { year: 2021, month: 5, day: 3, name: 'Święto Narodowe Trzeciego Maja' },
      { year: 2021, month: 8, day: 15, name: 'Wniebowzięcie Najświętszej Marii Panny' },
      { year: 2021, month: 11, day: 1, name: 'Wszystkich Świętych' },
      { year: 2021, month: 11, day: 11, name: 'Narodowe Święto Niepodległości' },
      { year: 2021, month: 12, day: 25, name: 'Pierwszy dzień Bożego Narodzenia' },
      { year: 2021, month: 12, day: 26, name: 'Drugi dzień Bożego Narodzenia' },
      { year: 2021, month: 4, day: 4, name: 'Wielkanoc' },
      { year: 2021, month: 4, day: 5, name: 'Poniedziałek Wielkanocny' },
      { year: 2021, month: 5, day: 23, name: 'Zesłanie Ducha Świętego' },
      { year: 2021, month: 6, day: 3, name: 'Boże Ciało' },
    ],
  };

  it('it should be successful if example holidays year does not exists and new holidays was added to DB', async () => {
    const { year } = examplePublicHolidays;
    const result = await addDatabases.ADD_PUBLIC_HOLIDAYS_DATA(examplePublicHolidays);
    expect(result.message).toEqual('The public holidays were added!');
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual(expect.objectContaining({ year }));
  });

  it('it should be successful if strict holidays year does not exists and new holidays was added to DB', async () => {
    const { year } = yearPublicHolidays;
    const result = await addDatabases.ADD_PUBLIC_HOLIDAYS_DATA(yearPublicHolidays);
    expect(result.message).toEqual('The public holidays were added!');
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual(expect.objectContaining({ year }));
  });

  it('it should be unsuccessful if holidays does exists and new holidays was not added to DB', async () => {
    const { year } = examplePublicHolidays;
    const result = await addDatabases.ADD_PUBLIC_HOLIDAYS_DATA(examplePublicHolidays);
    expect(result.message).toEqual('The public holidays does exist!');
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual(expect.objectContaining({ year }));
  });
});

// FIND
describe('Finding public holidays', () => {
  const year = 2021;

  it('it should be successful if holidaysData object has doc key equal "holidays" and year equal "year = 2021"', async () => {
    const holidaysData = await readDatabases.GET_PUBLIC_HOLIDAYS_DATA_BY_YEAR(year);
    expect(holidaysData).toEqual(expect.objectContaining({ doc: 'holidays' }));
    expect(holidaysData).toEqual(expect.objectContaining({ year }));
  });
});
