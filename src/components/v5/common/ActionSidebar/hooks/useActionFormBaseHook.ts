import { useUnmountEffect } from 'framer-motion';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { UseActionFormBaseHook } from '../types';

export const useActionFormBaseHook: UseActionFormBaseHook = ({
  validationSchema,
  transform,
  defaultValues,
  actionType,
  getFormOptions,
}) => {
  const form = useFormContext();

  useEffect(() => {
    getFormOptions(
      {
        transform,
        actionType,
        validationSchema,
        defaultValues,
      },
      form,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, validationSchema, actionType]);

  useUnmountEffect(() => {
    getFormOptions(undefined, form);
  });
};
