import React, { FC } from 'react';
import { RadioListProps } from './types';
import RadioBase from './RadioBase';

const displayName = 'common.Extensions.RadioList';

const RadioList: FC<RadioListProps> = ({ defaultValue, name, disabled, id, isError, title, items }) => {
  return (
    <>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li>
            <RadioBase {...{ defaultValue, name, disabled, id, isError, ...item }} />
          </li>
        ))}
      </ul>
    </>
  );
};
RadioList.displayName = displayName;

export default RadioList;
