import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import noop from 'lodash/noop';
import { RadioListProps } from './types';
import RadioBase from './RadioBase';
import FormError from '~shared/Extensions/FormError/FormError';

const displayName = 'common.Extensions.RadioList';

const RadioList: FC<RadioListProps> = ({ onChange = noop, error, value, title, items, ...rest }) => {
  const { formatMessage } = useIntl();
  const errorText = typeof error == 'string' ? error : error && formatMessage(error);

  return (
    <div>
      <h3 className="text-gray-900 font-semibold text-md mb-4">{title}</h3>
      <ul className="flex flex-col gap-y-3">
        {items.map((item) => (
          <li key={item.value}>
            <RadioBase
              {...{ error, ...item, ...rest }}
              checked={item.value === value}
              onChange={(event): void => {
                const { target } = event;
                onChange(target.checked ? item.value : undefined);
              }}
            />
          </li>
        ))}
      </ul>
      {!!error && (
        <FormError isFullSize alignment="left">
          {errorText}
        </FormError>
      )}
    </div>
  );
};

RadioList.displayName = displayName;

export default RadioList;
