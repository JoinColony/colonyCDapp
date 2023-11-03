import { useEffect } from 'react';

import { useFormContext } from 'react-hook-form';
import { useUnmountEffect } from 'framer-motion';
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
  }, [defaultValues, validationSchema]);

  useUnmountEffect(() => {
    getFormOptions(undefined, form);
  });
};
