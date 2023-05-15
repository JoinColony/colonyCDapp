import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormRadioButton, RadioListProps } from './types';
import RadioBase from './RadioBase';
import FormError from '~shared/Extensions/FormError/FormError';
import Button from '~shared/Extensions/Button/Button';

const displayName = 'Extensions.Fields.RadioList';

const RadioList: FC<RadioListProps> = ({ title, items }) => {
  const { formatMessage } = useIntl();

  const validationSchema = yup.object().shape({
    radio: yup
      .string()
      .required()
      .typeError(formatMessage({ id: 'radio.error.governance' })),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormRadioButton>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    alert(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-gray-900 font-semibold text-md mb-4">{title}</h3>
      <ul className="flex flex-col gap-y-3">
        {items.map(({ value, disabled, label, description, badge, tooltip }) => (
          <li key={value}>
            <RadioBase
              register={register}
              isError={!!errors.radio?.message}
              item={{
                value,
                disabled,
                label,
                description,
                badge,
                tooltip,
              }}
            />
          </li>
        ))}
      </ul>
      {errors.radio && (
        <FormError isFullSize alignment="left">
          {errors.radio.message}
        </FormError>
      )}
      <div className="mt-3">
        <Button mode="primaryOutline" disabled={!!errors.radio} type="submit">
          {formatMessage({ id: 'button.enable' })}
        </Button>
      </div>
    </form>
  );
};

RadioList.displayName = displayName;

export default RadioList;
