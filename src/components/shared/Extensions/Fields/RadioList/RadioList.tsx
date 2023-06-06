import React, { FC } from 'react';
import { RadioListProps } from './types';
import RadioBase from './RadioBase';
import FormError from '~shared/Extensions/FormError/FormError';

const displayName = 'Extensions.Fields.RadioList';

const RadioList: FC<RadioListProps> = ({ title, items, onChange, errors, register, name }) => (
  <>
    <h3 className="text-gray-900 font-semibold text-md mb-4">{title}</h3>
    <ul className="flex flex-col gap-y-3">
      {items.map(({ value, disabled, label, description, badge, tooltip }) => (
        <li key={value}>
          <RadioBase
            name={name}
            register={register}
            isError={!!errors.governance?.message}
            onChange={onChange}
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
    {errors.governance && (
      <FormError isFullSize alignment="left">
        {errors.governance.message}
      </FormError>
    )}
  </>
);

RadioList.displayName = displayName;

export default RadioList;
