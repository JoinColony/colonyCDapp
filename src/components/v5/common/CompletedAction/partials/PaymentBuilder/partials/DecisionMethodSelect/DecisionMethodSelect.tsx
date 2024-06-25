import clsx from 'clsx';
import React, { useCallback, type FC } from 'react';
import { useController } from 'react-hook-form';
import { type Props as ReactSelectProps, type SingleValue } from 'react-select';

import { formatText } from '~utils/intl.ts';
import {
  DropdownIndicator,
  SelectBase,
} from '~v5/common/Fields/Select/index.ts';

import {
  type DecisionMethodOption,
  type DecisionMethodSelectProps,
} from './types.ts';

import styles from './DecisionMethodSelect.module.css';

const DecisionMethodSelect: FC<DecisionMethodSelectProps> = ({
  options,
  name,
  onChange: onChangeProp,
  isDisabled,
}) => {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
  });

  const handleChange = useCallback<
    Exclude<ReactSelectProps<DecisionMethodOption>['onChange'], undefined>
  >(
    (newValue, actionMeta) => {
      if (Array.isArray(newValue)) {
        return;
      }

      onChange(newValue as SingleValue<DecisionMethodOption>, actionMeta);
      onChangeProp?.(newValue as SingleValue<DecisionMethodOption>, actionMeta);
    },
    [onChange, onChangeProp],
  );

  return (
    <>
      <h6
        className={clsx('mb-2 text-2', {
          'text-gray-700': !isDisabled,
          'text-gray-300': isDisabled,
        })}
      >
        {formatText({ id: 'decisionMethodSelect.title' })}
      </h6>
      <SelectBase
        className={clsx(styles.wrapper, {
          '[&_div]:!border-negative-400': error && !isDisabled,
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
        onChange={handleChange}
        value={value.value}
        defaultValue={value.value}
        isDisabled={isDisabled}
      />
      {error && !isDisabled && (
        <span className="text-sm text-negative-400">
          {formatText({ id: 'decisionMethodSelect.error' })}
        </span>
      )}
    </>
  );
};

export default DecisionMethodSelect;
