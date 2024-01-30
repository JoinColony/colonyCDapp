import {
  type Path,
  type UseFormGetValues,
  type UseFormSetValue,
} from 'react-hook-form';

import { once } from '~utils/lodash.ts';

export const setFieldTouched = once(
  <V extends Record<string, any>>(
    fieldName: Path<V>,
    setValue: UseFormSetValue<V>,
    getValues: UseFormGetValues<V>,
  ) => {
    setValue(fieldName, getValues(fieldName), {
      shouldTouch: true,
    });
  },
);
