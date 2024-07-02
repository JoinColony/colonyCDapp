import { format } from 'date-fns';

import { DEFAULT_DATE_FORMAT } from '~v5/common/Fields/datepickers/common/consts.ts';

export const getFormattedDateFrom = (value: number | string | Date) =>
  format(new Date(value), DEFAULT_DATE_FORMAT);
