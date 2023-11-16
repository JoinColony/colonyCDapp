import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SocialLinkModalFormValues, SocialLinkFormModalProps } from './types';

export const useResetFormOnLinkTypeChange = (
  defaultValuesProp: SocialLinkFormModalProps['defaultValues'],
  initialLinkType: SocialLinkFormModalProps['initialLinkType'],
) => {
  const [formRef, setFormRef] =
    useState<UseFormReturn<SocialLinkModalFormValues> | null>(null);

  formRef?.watch((data, { name, type }) => {
    if (name !== 'linkType' || type !== 'change') {
      return;
    }

    formRef.reset(
      defaultValuesProp.find(
        (defaultValue) => defaultValue.linkType === data.linkType,
      ) || {
        linkType: data.linkType,
        url: '',
      },
    );
  });

  useEffect(() => {
    if (!formRef || !initialLinkType) {
      return;
    }

    formRef.reset(
      defaultValuesProp.find(
        (defaultValue) => defaultValue.linkType === initialLinkType,
      ) || {
        linkType: initialLinkType,
      },
    );
  }, [defaultValuesProp, formRef, initialLinkType]);

  return {
    setFormRef,
  };
};
