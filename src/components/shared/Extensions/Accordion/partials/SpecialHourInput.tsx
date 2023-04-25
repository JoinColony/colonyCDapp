import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useIntl } from 'react-intl';
import SpecialInput from '~common/Extensions/SpecialInput/SpecialInput';
import FormError from '~shared/Extensions/FormError/FormError';
import { FormHourInput } from '~common/Extensions/SpecialInput/types';

const displayName = 'Extensions.SpecialHourInput';

const SpecialHourInput = () => {
  const { formatMessage } = useIntl();
  const validationSchema = yup
    .object({
      hour: yup
        .number()
        .positive('')
        .integer('')
        .required('')
        .typeError(formatMessage({ id: 'special.hour.input.error.min.value' }))
        .min(1, formatMessage({ id: 'special.hour.input.error.min.value' }))
        .max(8765, formatMessage({ id: 'special.hour.input.error.max.value' })),
    })
    .required('');

  const {
    register,
    formState: { errors },
  } = useForm<FormHourInput>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  return (
    <div className="text-right max-w-[8rem]">
      <form>
        {/* <Form<FormValues> use it later */}
        <SpecialInput
          register={register}
          isError={!!errors.hour?.message}
          name="hour"
          min={1}
          max={8765}
          type="hour"
          placeholder="8"
        />
        {errors.hour && <FormError>{errors.hour.message}</FormError>}
      </form>
    </div>
  );
};

SpecialHourInput.displayName = displayName;

export default SpecialHourInput;
