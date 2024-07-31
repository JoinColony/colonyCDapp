import clsx from 'clsx';
import React, { type FC } from 'react';
import { useController } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import {
  DropdownIndicator,
  SelectBase,
} from '~v5/common/Fields/Select/index.ts';

import { type DecisionMethodSelectProps } from './types.ts';

import styles from './DecisionMethodSelect.module.css';

const DecisionMethodSelect: FC<DecisionMethodSelectProps> = ({
  options,
  name,
}) => {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
  });

  return (
    <>
      <h6 className="mb-2 text-gray-700 text-2">
        {formatText({ id: 'decisionMethodSelect.title' })}
      </h6>
      <SelectBase
        className={clsx(styles.wrapper, {
          '[&_div]:!border-negative-400': error,
        })}
        classNames={{
          menu: () => styles.menu,
        }}
        components={{
          DropdownIndicator,
          IndicatorSeparator: null,
        }}
        isSearchable={false}
        options={options}
        menuPortalTarget={document.body}
        name={name}
        placeholder={formatText({
          id: 'decisionMethodSelect.placeholder',
        })}
        onChange={onChange}
        value={value.value}
        defaultValue={value.value}
      />
      {error && (
        <span className="text-sm text-negative-400">
          {formatText({ id: 'decisionMethodSelect.error' })}
        </span>
      )}
    </>
  );
};

export default DecisionMethodSelect;
