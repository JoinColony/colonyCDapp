import React, { type FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { type Message } from '~types/index.ts';
import { formatText } from '~utils/intl.ts';
import { get } from '~utils/lodash.ts';
import { FieldState } from '~v5/common/Fields/consts.ts';
import { DEFAULT_DATE_FORMAT } from '~v5/common/Fields/datepickers/common/consts.ts';
import Datepicker from '~v5/common/Fields/datepickers/Datepicker/Datepicker.tsx';
import FormError from '~v5/shared/FormError/index.ts';

interface FormDatepickerProps {
  name: string;
  label?: string;
  placeholder?: string;
}
export const FormDatepicker: FC<FormDatepickerProps> = ({
  name,
  label,
  placeholder,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, name)?.message as Message | undefined;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <>
            <Datepicker
              selected={field.value}
              onChange={(date) => {
                field.onChange(date);
              }}
              dateFormat="yyyy-MM-dd"
              dateFormatCalendar={DEFAULT_DATE_FORMAT}
              shouldCloseOnSelect
              placeholderText={placeholder}
              inputProps={{
                label,
                labelClassName: 'text-gray-900',
                state: error ? FieldState.Error : undefined,
                className: 'py-3',
                id: `id-${name}`,
              }}
              wrapperClassName="w-full"
            />
            {error && (
              <FormError isFullSize alignment="left">
                {formatText(error)}
              </FormError>
            )}
          </>
        );
      }}
    />
  );
};
