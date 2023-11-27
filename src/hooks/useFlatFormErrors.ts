import { useMemo } from 'react';
import {
  FieldValues,
  FieldErrors,
  FieldErrorsImpl,
  DeepRequired,
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
  }, [errors]);
};

export default useFlatFormErrors;
