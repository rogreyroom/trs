import AsyncNedb from 'nedb-async';
import getDbConnection from '../connection';
import eesSchema from '../schemas/eesSchema';
import responsibilitiesSchema from '../schemas/responsibilitiesSchema';
import schemaValidator from '../schemas/validator';
import {
  IEes,
  IDbOperationResult,
  IResponsibilities,
  IEmployeesData,
  IBasicEmployeeData,
  IMonthRates,
  IDateRange,
  IQueryFields,
  ITrsData,
} from './_types';
import readDatabases from './read';
import {
  checkEesExist,
  checkEmployeeExist,
  checkExistingLeaveData,
  checkResponsibilitiesExist,
  createLeaveUpdateData,
  getCalendarMonthIndex,
  getCalendarRtsDayIndex,
  getCalendarYearIndex,
  makeCalendar,
} from './utils';

const updateDatabases = {
  UPDATE_EES_DATA_BY_SYMBOL: async (symbol: string, data: IEes): Promise<IDbOperationResult> => {
    const checkEes = await checkEesExist({ symbol });
    if (!checkEes.status) return checkEes;

    const eesDB: AsyncNedb<IEes> = await getDbConnection('ees');
    const updateResult = eesDB && ((await eesDB.asyncUpdate({ symbol }, { $set: { ...data } })) as number);
    if (updateResult === 0) return { status: false, message: 'The ees data was not updated!', value: null };
    return { status: true, message: 'The ees data was updated!', value: updateResult };
  },

  UPDATE_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID: async (
    responsibilitiesData: IResponsibilities
  ): Promise<IDbOperationResult> => {
    const { employee } = responsibilitiesData;
    const checkResponsibilities = await checkResponsibilitiesExist(employee);
    if (!checkResponsibilities.status) return checkResponsibilities;

    const responsibilitiesDB: AsyncNedb<IResponsibilities> = await getDbConnection('responsibilities');
    const updateResult =
      responsibilitiesDB &&
      ((await responsibilitiesDB.asyncUpdate({ employee }, { $set: { ...responsibilitiesData } })) as number);
    if (updateResult === 0) return { status: false, message: 'The responsibilities does not exist!', value: null };
    return { status: true, message: 'The responsibilities data ware updated!', value: updateResult };
  },

  UPDATE_BASIC_EMPLOYEE_DATA_BY_EMPLOYEE_ID: async (
    id: string,
    employeeData: IBasicEmployeeData
  ): Promise<IDbOperationResult> => {
    const checkEmployee = await checkEmployeeExist({ id });
    if (!checkEmployee.status) return checkEmployee;

    const employeesDB: AsyncNedb<IEmployeesData> = await getDbConnection('employees');
    const updateResult =
      employeesDB && ((await employeesDB.asyncUpdate({ _id: id }, { $set: { ...employeeData } })) as number);
    return updateResult && { status: true, message: 'The employee basic data was updated!', value: updateResult };
  },

  UPDATE_EMPLOYEE_RATE_DATA_BY_EMPLOYEE_ID_YEAR_MONTH: async (
    id: string,
    theYear: number,
    theMonth: number,
    employeeData: IMonthRates
  ): Promise<IDbOperationResult> => {
    const checkEmployee = await checkEmployeeExist({ id });
    if (!checkEmployee.status) return checkEmployee;
    const foundEmployee = checkEmployee.value as IEmployeesData;
    const resultArray = [];
    const employeesDB: AsyncNedb<IEmployeesData> = await getDbConnection('employees');
    const yearIndex = getCalendarYearIndex(foundEmployee, theYear);
    for (let monthIterator = theMonth; monthIterator <= 12; monthIterator += 1) {
      const monthIndex = getCalendarMonthIndex(foundEmployee, theYear, monthIterator);
      const updateResult =
        employeesDB &&
        // eslint-disable-next-line no-await-in-loop
        (await employeesDB.asyncUpdate(
          { _id: id },
          {
            $set: {
              [`calendar.${yearIndex}.months.${monthIndex}.hourlyRate`]: employeeData.hourlyRate,
              [`calendar.${yearIndex}.months.${monthIndex}.overtimeRate`]: employeeData.overtimeRate,
              [`calendar.${yearIndex}.months.${monthIndex}.holidayRate`]: employeeData.holidayRate,
              [`calendar.${yearIndex}.months.${monthIndex}.sickLeaveRate`]: employeeData.sickLeaveRate,
              [`calendar.${yearIndex}.months.${monthIndex}.otherLeaveRate`]: employeeData.otherLeaveRate,
              [`calendar.${yearIndex}.months.${monthIndex}.insuranceRate`]: employeeData.insuranceRate,
              [`calendar.${yearIndex}.months.${monthIndex}.retainmentRate`]: employeeData.retainmentRate,
              [`calendar.${yearIndex}.months.${monthIndex}.toAccountRate`]: employeeData.toAccountRate,
              [`calendar.${yearIndex}.months.${monthIndex}.bonusRate`]: employeeData.bonusRate,
              [`calendar.${yearIndex}.months.${monthIndex}.overtimeRateMultiplier`]: employeeData.overtimeRateMultiplier,
              [`calendar.${yearIndex}.months.${monthIndex}.overtimeHoursMultiplier`]: employeeData.overtimeHoursMultiplier,
            },
          }
        ));
      resultArray.push(updateResult);
    }
    const updateResult = resultArray.every((result) => result === 1) ? 1 : 0;
    return resultArray && { status: true, message: 'The employee rates data was updated!', value: updateResult };
  },

  CREATE_EMPLOYEE_LEAVE_ENTRY: async (
    id: string,
    leaveQueryFields: IQueryFields,
    employeeData: IDateRange
  ): Promise<IDbOperationResult> => {
    const checkEmployee = await checkEmployeeExist({ id });
    if (!checkEmployee.status) return checkEmployee;
    const foundEmployee = checkEmployee.value as IEmployeesData;
    const yearIndex = getCalendarYearIndex(foundEmployee, leaveQueryFields.year);
    const monthIndex = getCalendarMonthIndex(foundEmployee, leaveQueryFields.year, leaveQueryFields.month);
    const leaveExists = checkExistingLeaveData(
      foundEmployee,
      employeeData,
      yearIndex,
      monthIndex,
      leaveQueryFields.name
    );
    if (leaveExists) return { status: true, message: `Data exists!`, value: null };

    const employeesDB: AsyncNedb<IEmployeesData> = await getDbConnection('employees');
    const pushData = createLeaveUpdateData(leaveQueryFields.name, yearIndex, monthIndex, employeeData);
    const updateResult = employeesDB && ((await employeesDB.asyncUpdate({ _id: id }, { $push: pushData })) as number);
    return (
      updateResult && {
        status: true,
        message: `The employee ${leaveQueryFields.name} leave entry was created!`,
        value: updateResult,
      }
    );
  },

  REMOVE_EMPLOYEE_LEAVE_ENTRY: async (
    id: string,
    leaveQueryFields: IQueryFields,
    employeeData: IDateRange
  ): Promise<IDbOperationResult> => {
    const checkEmployee = await checkEmployeeExist({ id });
    if (!checkEmployee.status) return checkEmployee;
    const foundEmployee = checkEmployee.value as IEmployeesData;
    const yearIndex = getCalendarYearIndex(foundEmployee, leaveQueryFields.year);
    const monthIndex = getCalendarMonthIndex(foundEmployee, leaveQueryFields.year, leaveQueryFields.month);
    const employeesDB: AsyncNedb<IEmployeesData> = await getDbConnection('employees');
    const pullData = createLeaveUpdateData(leaveQueryFields.name, yearIndex, monthIndex, employeeData);
    const updateResult = employeesDB && ((await employeesDB.asyncUpdate({ _id: id }, { $pull: pullData })) as number);
    return (
      updateResult && {
        status: true,
        message: `The employee ${leaveQueryFields.name} leave entry was removed!`,
        value: updateResult,
      }
    );
  },

  CREATE_UPDATE_EMPLOYEE_TRS_DATA_ENTRY: async (
    id: string,
    queryFields: IQueryFields,
    employeeData: ITrsData
  ): Promise<IDbOperationResult> => {
    const checkEmployee = await checkEmployeeExist({ id });
    if (!checkEmployee.status) return checkEmployee;
    const foundEmployee = checkEmployee.value as IEmployeesData;
    const yearIndex = getCalendarYearIndex(foundEmployee, queryFields.year);
    const monthIndex = getCalendarMonthIndex(foundEmployee, queryFields.year, queryFields.month);
    const dayIndex = getCalendarRtsDayIndex(foundEmployee, queryFields.year, queryFields.month, employeeData.dueDate);

    const employeesDB: AsyncNedb<IEmployeesData> = await getDbConnection('employees');
    const updateResult =
      employeesDB &&
      ((await employeesDB.asyncUpdate(
        { _id: id },
        {
          $set: {
            [`calendar.${yearIndex}.months.${monthIndex}.rts.${dayIndex}`]: employeeData,
          },
        }
      )) as number);
    return updateResult && { status: true, message: `The employee trs data was updated!`, value: updateResult };
  },

  CREATE_NEW_YEAR_EMPLOYEE_CALENDAR: async (
    id: string,
    theYear: number,
    inputRatesData: IMonthRates
  ): Promise<IDbOperationResult> => {
    const checkEmployee = await checkEmployeeExist({ id });
    if (!checkEmployee.status) return checkEmployee;
    const foundEmployee = checkEmployee.value as IEmployeesData;
    const yearIndex = getCalendarYearIndex(foundEmployee, theYear);
    if (yearIndex > -1) return { status: false, message: `The ${theYear} year already exist!`, value: null };
    const newCalendar = await makeCalendar(theYear, inputRatesData);
    const employeesDB: AsyncNedb<IEmployeesData> = await getDbConnection('employees');
    const updateResult =
      employeesDB && ((await employeesDB.asyncUpdate({ _id: id }, { $push: { calendar: newCalendar } })) as number);
    return updateResult && { status: true, message: `The ${theYear} year data was created!`, value: updateResult };
  },
};

export default updateDatabases;
