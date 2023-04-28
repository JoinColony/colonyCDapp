import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useIntl } from 'react-intl';
import SpecialInput from '~common/Extensions/SpecialInput/SpecialInput';
import FormError from '~shared/Extensions/FormError/FormError';
import { FormPercentageInput } from '~common/Extensions/SpecialInput/types';
import { SpecialInputProps } from '../types';

const displayName = 'Extensions.SpecialPercentageInput';

const SpecialPercentageInput: FC<SpecialInputProps> = ({ maxValue }) => {
  const { formatMessage } = useIntl();
  const validationSchema = yup
    .object({
      percentage: yup
        .number()
        .positive('')
        .required('')
        .typeError(formatMessage({ id: 'special.percentage.input.error.min.value' }))
        .min(1, formatMessage({ id: 'special.percentage.input.error.min.value' }))
        .max(maxValue, formatMessage({ id: 'special.percentage.input.error.max.value' }, { maxValue })),
    })
    .required('');

  const {
    register,
    formState: { errors },
  } = useForm<FormPercentageInput>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  return (
    <div className="text-right">
      <form className="flex justify-end flex-col w-[8.8rem]">
        {/* <Form<FormValues> use it later */}
        <SpecialInput
          register={register}
          isError={!!errors.percentage?.message}
          name="percentage"
          min={1}
          max={99}
          type="percentage"
          placeholder="1"
        />
        {errors.percentage && <FormError>{errors.percentage.message}</FormError>}
      </form>
    </div>
  );
};

SpecialPercentageInput.displayName = displayName;

export default SpecialPercentageInput;
