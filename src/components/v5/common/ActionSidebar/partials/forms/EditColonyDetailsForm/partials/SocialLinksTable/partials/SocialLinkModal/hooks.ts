import { useEffect, useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import {
  type SocialLinkModalFormValues,
  type SocialLinkFormModalProps,
} from './types.ts';

export const useResetFormOnLinkTypeChange = (
  defaultValuesProp: SocialLinkFormModalProps['defaultValues'],
  initialLinkType: SocialLinkFormModalProps['initialLinkType'],
) => {
  const [formRef, setFormRef] =
    useState<UseFormReturn<SocialLinkModalFormValues> | null>(null);

  formRef?.watch((data, { name, type }) => {
    if (name !== 'name' || type !== 'change') {
      return;
    }

    formRef.reset(
      defaultValuesProp.find(
        (defaultValue) => defaultValue.name === data.name,
      ) || {
        name: data.name,
        link: '',
      },
    );
  });

  useEffect(() => {
    if (!formRef || !initialLinkType) {
      return;
    }

    formRef.reset(
      defaultValuesProp.find(
        (defaultValue) => defaultValue.name === initialLinkType,
      ) || {
        name: initialLinkType,
      },
    );
  }, [defaultValuesProp, formRef, initialLinkType]);

  return {
    setFormRef,
  };
};
