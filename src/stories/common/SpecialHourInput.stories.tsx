import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useIntl } from 'react-intl';
import SpecialInput from '~common/Extensions/SpecialInput/SpecialInput';
import { FormHourInput } from '~common/Extensions/SpecialInput/types';
import FormError from '~shared/Extensions/FormError/FormError';

const meta: Meta<typeof SpecialInput> = {
  title: 'Common/Special Hour Input',
  component: SpecialInput,
};

export default meta;
type Story = StoryObj<typeof SpecialInput>;

const SpecialHourInputWithHooks = (args) => {
  const { formatMessage } = useIntl();
  const maxValue = 8766;
  const validationSchema = yup
    .object({
      hour: yup
        .number()
        .positive('')
        .required('')
        .typeError(formatMessage({ id: 'special.hour.input.error.min.value' }))
        .min(1, formatMessage({ id: 'special.hour.input.error.min.value' }))
        .max(maxValue, formatMessage({ id: 'special.hour.input.error.max.value' }, { maxValue })),
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
    <div className="text-right">
      <form className="flex justify-end flex-col w-[8.8rem]">
        {/* <Form<FormValues> use it later */}
        <SpecialInput
          {...args}
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

export const Base: Story = {
  render: () => <SpecialHourInputWithHooks defaultValue={1} id="hour-1" />,
};

export const Disabled: Story = {
  render: () => <SpecialHourInputWithHooks defaultValue={0} disabled id="hour-2" />,
};
