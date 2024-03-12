import { useMemo } from 'react';
import {
  type FieldValues,
  type FieldErrors,
  type FieldErrorsImpl,
  type DeepRequired,
} from 'react-hook-form';

export interface FlatFormError {
  key: React.Key;
  message: string;
}

const useFlatFormErrors = <TFieldValues extends FieldValues = FieldValues>(
  errors: FieldErrors<TFieldValues>,
) => {
  return useMemo(() => {
    const result: Array<FlatFormError> = [];

    const getErrors = (
      error:
        | FieldErrors<TFieldValues>
        | FieldErrorsImpl<DeepRequired<TFieldValues>>,
      path = '',
    ) => {
      const nextPath = path ? `${path}.` : '';
      // if we are using a field array, fields without error have undefined as the value
      if (error === null || error === undefined) {
        return;
      }

      if (Array.isArray(error)) {
        error.forEach((item, index) => {
          getErrors(item, `${nextPath}${index}`);
        });
      } else if ('message' in error && typeof error.message === 'string') {
        result.push({ key: path || 'root', message: error.message });
      } else {
        Object.entries(error).forEach(([key, value]) => {
          if (!value || typeof value !== 'object') {
            return;
          }

          getErrors(value, `${nextPath}${key}`);
        });
      }
    };

    getErrors(errors);

    return result;
    // reference to the errors object is not changed when errors are updated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(errors)]);
};

export default useFlatFormErrors;
