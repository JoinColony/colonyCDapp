import { useUnmountEffect } from 'framer-motion';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { type UseActionFormBaseHook } from '../types.ts';

const useActionFormBaseHook: UseActionFormBaseHook = ({
  validationSchema,
  transform,
  defaultValues,
  actionType,
  mode = 'onChange',
  reValidateMode = 'onChange',
  onSuccess,
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
        mode,
        reValidateMode,
        onSuccess,
      },
      form,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, validationSchema, actionType]);

  useUnmountEffect(() => {
    getFormOptions(undefined, form);
  });
};

export default useActionFormBaseHook;
