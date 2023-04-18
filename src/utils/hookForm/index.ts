import { Path, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { once } from '~utils/lodash';

export const setFieldTouched = once(
  <V extends Record<string, any>>(fieldName: Path<V>, setValue: UseFormSetValue<V>, getValues: UseFormGetValues<V>) => {
    setValue(fieldName, getValues(fieldName), {
      shouldTouch: true,
    });
  },
);
