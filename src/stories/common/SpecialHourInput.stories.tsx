import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useIntl } from 'react-intl';
import SpecialHourInput from '~common/Extensions/SpecialInput/SpecialHourInput';
import { Inputs } from '~common/Extensions/SpecialInput/types';
import FormError from '~shared/Extensions/FormError/FormError';

const meta: Meta<typeof SpecialHourInput> = {
  title: 'Common/Special Hour Input',
  component: SpecialHourInput,
};

export default meta;
type Story = StoryObj<typeof SpecialHourInput>;

const SpecialHourInputWithHooks = (args) => {
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
  } = useForm<Inputs>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  return (
    <div className="text-right max-w-[8rem]">
      <form>
        {/* <Form<FormValues> use it later */}
        <SpecialHourInput {...args} register={register} isError={!!errors.hour?.message} />
        {errors.hour && <FormError>{errors.hour.message}</FormError>}
      </form>
    </div>
  );
};

export const Base: Story = {
  render: () => <SpecialHourInputWithHooks defaultValue={1} name="hour" id="hour-1" placeholder="8" />,
};

export const Disabled: Story = {
  render: () => <SpecialHourInputWithHooks defaultValue={0} name="hour" disabled id="hour-2" placeholder="8" />,
};
