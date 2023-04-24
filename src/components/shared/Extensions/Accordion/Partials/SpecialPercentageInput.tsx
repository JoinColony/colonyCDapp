import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useIntl } from 'react-intl';
import SpecialInput from '~common/Extensions/SpecialInput/SpecialInput';
import FormError from '~shared/Extensions/FormError/FormError';
import { FormPercengateInput } from '~common/Extensions/SpecialInput/types';

const displayName = 'Extensions.SpecialPercentageInput';

const SpecialPercentageInput = () => {
  const { formatMessage } = useIntl();
  const validationSchema = yup
    .object({
      percentage: yup
        .number()
        .positive('')
        .integer('')
        .required('')
        .typeError(formatMessage({ id: 'special.percentage.input.error.min.value' }))
        .min(1, formatMessage({ id: 'special.percentage.input.error.min.value' }))
        .max(99, formatMessage({ id: 'special.percentage.input.error.max.value' })),
    })
    .required('');

  const {
    register,
    formState: { errors },
  } = useForm<FormPercengateInput>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  return (
    <div className="text-right max-w-[8rem]">
      <form>
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
