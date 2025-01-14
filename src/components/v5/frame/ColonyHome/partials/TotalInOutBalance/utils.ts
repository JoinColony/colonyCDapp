import {
  format,
  isAfter,
  parse,
  setMonth,
  setWeek,
  startOfWeek,
} from 'date-fns';
import numbro from 'numbro';

import { convertToDecimal } from '~utils/convertToDecimal.ts';

import { type BarChartDataItem } from './types.ts';

type IntermediateBarChartDataItem = Pick<BarChartDataItem, 'in' | 'out'> & {
  label: Date;
};

export const sortByLabel = (
  a: IntermediateBarChartDataItem,
  b: IntermediateBarChartDataItem,
) => {
  return isAfter(a.label, b.label) ? 1 : -1;
};

export const getMonthShortName = (label: string) => {
  const date = parse(label, 'dd-MM-yyyy', new Date());

  return format(date, 'MMM');
};

export const parseTimeframeKey = (key: string = '') => {
  let parsedDate = new Date();
  if (/^\d{2}-\d{2}-\d{4}$/.test(key)) {
    parsedDate = parse(key, 'dd-MM-yyyy', new Date());
  } else if (/^\d{2}W-\d{4}$/.test(key)) {
    const [weekString, yearString] = key.split('W-');
    const year = parseInt(yearString, 10);
    const week = parseInt(weekString, 10);
    const startOfYearDate = new Date(year, 0, 1);
    parsedDate = startOfWeek(setWeek(startOfYearDate, week), {
      weekStartsOn: 1,
    });
  }

  return parsedDate;
};

export const mapToFormattedLabel = (item: IntermediateBarChartDataItem) => ({
  ...item,
  label: format(item.label, 'dd-MM-yyyy'),
});

export const getFallbackData = (): BarChartDataItem[] => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const fallbackData: IntermediateBarChartDataItem[] = [];

  for (let i = 0; i < 4; i += 1) {
    fallbackData.push({
      label: new Date(setMonth(now, currentMonth - i)),
      in: '0',
      out: '0',
    });
  }

  return fallbackData.sort(sortByLabel).map(mapToFormattedLabel);
};

export const getFormattedShortAmount = (value) => {
  const convertedValue = convertToDecimal(value, 18);
  return numbro(convertedValue?.toString()).format({
    average: true,
    totalLength: 2,
  });
};

export const getFormattedFullAmount = (value, prefix) => {
  const convertedValue = convertToDecimal(value, 18);
  return numbro(convertedValue?.toString()).format({
    thousandSeparated: true,
    mantissa: 2,
    prefix,
  });
};
