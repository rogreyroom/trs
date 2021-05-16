import { IDate, IDateRange, IDbOperationResult, IEmployeesData, IMonthData, IMonthRates, IYearData } from './_types';
import readDatabases from './read';

export interface ICheckEmployeeInput {
  id?: string;
  name?: string;
  surname?: string;
}

export const checkEmployeeExist = async (employeeInput: ICheckEmployeeInput): Promise<IDbOperationResult> => {
  let employeeData: IEmployeesData;
  if ({}.hasOwnProperty.call(employeeInput, 'id')) {
    employeeData = await readDatabases.GET_EMPLOYEE_DATA_BY_ID(employeeInput.id);
  } else {
    employeeData = await readDatabases.GET_EMPLOYEE_DATA_BY_NAME(employeeInput.name, employeeInput.surname);
  }

  if (employeeData !== null) return { status: true, message: 'The employee does exist!', value: employeeData };
  return { status: false, message: 'The employee does not exist!', value: null };
};

export const getCalendarYearIndex = (employeeData: IEmployeesData, theYear: number): number => {
  return employeeData.calendar.findIndex(({ year }) => year === theYear);
};

export const getCalendarMonthIndex = (employeeData: IEmployeesData, theYear: number, theMonth: number): number => {
  return employeeData.calendar
    .filter(({ year }) => year === theYear)[0]
    .months.findIndex(({ month }) => month === theMonth);
};

export const getCalendarRtsDayIndex = (
  employeeData: IEmployeesData,
  theYear: number,
  theMonth: number,
  theDate: IDate
): number => {
  return employeeData.calendar
    .filter(({ year }) => year === theYear)[0]
    .months.filter(({ month }) => month === theMonth)[0]
    .rts.findIndex(({ dueDate }) => JSON.stringify(dueDate) === JSON.stringify(theDate));
};

export const checkExistingLeaveData = (
  employeeData: IEmployeesData,
  updateData: IDateRange,
  yearIndex: number,
  monthIndex: number,
  leaveOption: string
): boolean => {
  let leaveArray: IDateRange[] | [] = [];
  switch (leaveOption) {
    case 'holiday':
      leaveArray = employeeData?.calendar[yearIndex].months[monthIndex].holidayLeave;
      break;
    case 'sick':
      leaveArray = employeeData?.calendar[yearIndex].months[monthIndex].sickLeave;
      break;
    case 'other':
      leaveArray = employeeData?.calendar[yearIndex].months[monthIndex].otherLeave;
      break;
    default:
      break;
  }
  const leaveExists =
    leaveArray &&
    leaveArray.filter((leave: IDateRange) => {
      if (
        leave.from.year === updateData.from.year &&
        leave.from.month === updateData.from.month &&
        leave.from.day === updateData.from.day &&
        leave.to.year === updateData.to.year &&
        leave.to.month === updateData.to.month &&
        leave.to.day === updateData.to.day
      )
        return true;

      return false;
    });
  if (leaveExists && leaveExists.length !== 0) return true;
  return false;
};

export const createLeaveUpdateData = (
  name: string,
  yearIndex: number,
  monthIndex: number,
  dateRange: IDateRange
): { [T: string]: IDateRange } => {
  const leaveData = { [`calendar.${yearIndex}.months.${monthIndex}.${name}Leave`]: dateRange };
  return leaveData;
};

export const makeCalendar = (year: number, ratesData: IMonthRates): IYearData => {
  const monthsArray: IMonthData[] = [];

  const {
    hourlyRate,
    overtimeRate,
    holidayRate,
    sickLeaveRate,
    otherLeaveRate,
    insuranceRate,
    retainmentRate,
    bonusRate,
    toAccountRate,
    overtimeRateMultiplier,
    overtimeHoursMultiplier,
  } = ratesData;

  for (let idx = 1; idx <= 12; idx += 1) {
    monthsArray.push({
      month: idx,
      hourlyRate,
      overtimeRate,
      holidayRate,
      sickLeaveRate,
      otherLeaveRate,
      insuranceRate,
      retainmentRate,
      bonusRate,
      toAccountRate,
      overtimeRateMultiplier,
      overtimeHoursMultiplier,
      holidayLeave: [],
      sickLeave: [],
      otherLeave: [],
      rts: [],
    });
  }

  return {
    year,
    months: monthsArray,
  };
};
