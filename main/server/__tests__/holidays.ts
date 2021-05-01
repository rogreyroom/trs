import { IPublicHolidays } from '../db/actions/_types';
import addDatabases from '../db/actions/add';
import readDatabases from '../db/actions/read';

beforeEach(() => {
  process.env.NODE_ENV = 'test';
});

describe('Find all public holidays data for given year', () => {
  it('should be empty object if public holidays data do not exist', async () => {
    const givenYear = 2020;
    const holidaysData = await readDatabases.GET_PUBLIC_HOLIDAYS_DATA_BY_YEAR(givenYear);
    expect(holidaysData).toBeNull();
    expect(holidaysData).not.toEqual(expect.objectContaining({ year: givenYear }));
  });

  it('should return object with data if public holidays data exist', async () => {
    const givenYear = 2021;
    const holidaysData = await readDatabases.GET_PUBLIC_HOLIDAYS_DATA_BY_YEAR(givenYear);
    expect(holidaysData?.year).toEqual(givenYear);
    expect(holidaysData).toEqual(expect.objectContaining({ year: givenYear }));
  });
});

describe('Add new year public holidays', () => {
  const givenYearPublicHolidays: IPublicHolidays = {
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

  it('should return status: false and value: Year was not specify!', async () => {
    const result = await addDatabases.ADD_PUBLIC_HOLIDAYS_DATA({});
    expect(result.status).toBeFalsy();
    expect(result.value).toEqual('Year was not specify!');
  });

  it('should return status: false and validation error value: Doc name is required', async () => {
    const result = await addDatabases.ADD_PUBLIC_HOLIDAYS_DATA({ year: 2020 });
    expect(result.status).toBeFalsy();
    expect(result.value).toEqual('Doc name is required');
  });

  it('should return status: false when new data exist in database', async () => {
    const result = await addDatabases.ADD_PUBLIC_HOLIDAYS_DATA(givenYearPublicHolidays);
    const expected = `Data for year: ${givenYearPublicHolidays.year} already exist!`;
    expect(result.status).toBeFalsy();
    expect(result.value).toEqual(expected);
  });

  it('should add public holidays data and return status: true and value: Adding successful! if data do not exist', async () => {
    const result = await addDatabases.ADD_PUBLIC_HOLIDAYS_DATA(givenYearPublicHolidays);
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual('Adding successful!');
  });
});
