import React, { type FC, type PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';

import { get } from '~utils/lodash.ts';
import FormError from '~v5/shared/FormError/FormError.tsx';

import { FormLabel } from './FormLabel.tsx';

interface FormInputGroupProps extends PropsWithChildren {
  names: string[];
  groupName: string;
  groupLabel?: string;
  getErrorMessage: (groupName: string, errorFieldNames: string[]) => string;
}
export const FormInputGroup: FC<FormInputGroupProps> = ({
  names,
  groupName,
  groupLabel,
  children,
  getErrorMessage,
}) => {
  const {
    formState: { errors },
  } = useFormContext();

  const errorRequiredFields = names.filter((name) => {
    const error = get(errors, name);
    return error?.type === 'required';
  });
  const hasGroupError = !!errorRequiredFields.length;

  return (
    <div className="flex flex-col gap-2">
      {groupLabel && <FormLabel labelMessage={groupLabel} name={groupName} />}

      {children}
      {hasGroupError && (
        <FormError isFullSize alignment="left">
          {errorRequiredFields.length
            ? getErrorMessage(groupName, errorRequiredFields)
            : null}
        </FormError>
      )}
    </div>
  );
};
