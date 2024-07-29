import React, { type FC, type PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import { get } from '~utils/lodash.ts';
import FormError from '~v5/shared/FormError/FormError.tsx';

import { FormLabel } from './FormLabel.tsx';

interface FormInputGroupProps extends PropsWithChildren {
  names: string[];
  groupName: string;
  groupLabel?: string;
}
export const FormInputGroup: FC<FormInputGroupProps> = ({
  names,
  groupName,
  groupLabel,
  children,
}) => {
  const {
    formState: { errors },
  } = useFormContext();
  const errorFields = names.filter((name) => !!get(errors, name)?.message);
  const hasGroupError = !!errorFields.length;

  return (
    <div className="flex flex-col gap-2">
      {groupLabel && <FormLabel labelMessage={groupLabel} name={groupName} />}

      {children}
      {hasGroupError && (
        <FormError isFullSize alignment="left">
          {formatText({
            id: `cryptoToFiat.forms.error.${groupName}.${errorFields.join('-')}`,
          })}
        </FormError>
      )}
    </div>
  );
};
