import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useIntl } from 'react-intl';
import SpecialInput from '~common/Extensions/SpecialInput/SpecialInput';
import { FormPercentageInput } from '~common/Extensions/SpecialInput/types';
import FormError from '~shared/Extensions/FormError/FormError';

const meta: Meta<typeof SpecialInput> = {
  title: 'Common/Special Percentage Input',
  component: SpecialInput,
};

export default meta;
type Story = StoryObj<typeof SpecialInput>;

const SpecialPercentageInputWithHooks = (args) => {
  const { formatMessage } = useIntl();
  const maxValue = 50;
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
          {...args}
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

export const Base: Story = {
  render: () => <SpecialPercentageInputWithHooks defaultValue={1} id="percentage-1" />,
};

export const Disabled: Story = {
  render: () => <SpecialPercentageInputWithHooks defaultValue={0} disabled id="percentage-2" />,
};
