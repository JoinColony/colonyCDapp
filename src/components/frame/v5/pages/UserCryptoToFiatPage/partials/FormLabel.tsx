import clsx from 'clsx';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';

interface FormLabelProps {
  labelMessage: string;
  labelClassName?: string;
  name: string;
}
export const FormLabel: FC<FormLabelProps> = ({
  labelMessage,
  labelClassName,
  name,
}) => {
  return labelMessage ? (
    <label
      className={clsx(labelClassName, 'flex flex-col text-1')}
      htmlFor={`id-${name}`}
    >
      {formatText(labelMessage)}
    </label>
  ) : null;
};
