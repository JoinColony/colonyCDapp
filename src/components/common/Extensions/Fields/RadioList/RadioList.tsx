import React, { type FC } from 'react';

import RadioBase from './RadioBase.tsx';
import { type RadioListProps } from './types.ts';

const displayName = 'common.Extensions.Fields.RadioList';

const RadioList: FC<RadioListProps> = ({
  title,
  items,
  onChange,
  name,
  checkedRadios,
}) => (
  <>
    <h3 className="text-2 mb-4">{title}</h3>
    <ul className="flex flex-col gap-y-3">
      {items.map(({ value, disabled, label, description, badge, tooltip }) => (
        <li key={value}>
          <RadioBase
            name={name}
            onChange={onChange}
            item={{
              value,
              disabled,
              label,
              description,
              badge,
              tooltip,
            }}
            checked={checkedRadios?.[value]}
          />
        </li>
      ))}
    </ul>
  </>
);

RadioList.displayName = displayName;

export default RadioList;
