import React, { useCallback, type FC } from 'react';
import { type Props as ReactSelectProps, type SingleValue } from 'react-select';

import { formatText } from '~utils/intl.ts';
import {
  DropdownIndicator,
  SelectBase,
} from '~v5/common/Fields/Select/index.ts';

import {
  type DecisionMethodSelectProps,
  type DecisionMethodOption,
} from './types.ts';

import styles from './DecisionMethodSelect.module.css';

const DecisionMethodSelect: FC<DecisionMethodSelectProps> = ({
  onChange,
  options,
  value,
}) => {
  const handleChange = useCallback<
    Exclude<ReactSelectProps<DecisionMethodOption>['onChange'], undefined>
  >(
    (newValue, actionMeta) => {
      if (Array.isArray(newValue)) {
        return;
      }

      if (!onChange) {
        return;
      }

      onChange(newValue as SingleValue<DecisionMethodOption>, actionMeta);
    },
    [onChange],
  );

  return (
    <>
      <h6 className="mb-2 text-2">
        {formatText({ id: 'decisionMethodSelect.title' })}
      </h6>
      <SelectBase
        className={styles.wrapper}
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
        name="test"
        placeholder={formatText({
          id: 'decisionMethodSelect.placeholder',
        })}
        onChange={handleChange}
        value={value}
        defaultValue={value}
      />
    </>
  );
};

export default DecisionMethodSelect;
