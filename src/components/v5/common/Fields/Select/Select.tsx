import clsx from 'clsx';
import React, { useCallback } from 'react';
import { type Props as ReactSelectProps, type SingleValue } from 'react-select';

import CustomOption from './partials/CustomOption/index.ts';
import DropdownIndicator from './partials/DropdownIndicator/index.ts';
import SelectBase from './SelectBase.tsx';
import { type SelectOption, type SelectProps } from './types.ts';

import styles from './Select.module.css';

const displayName = 'v5.common.Fields.Select';

const Select: React.FC<SelectProps> = ({
  onChange: onChangeProp,
  isSearchable = false,
  className,
  isError = false,
  ...rest
}) => {
  const onChange = useCallback<
    Exclude<ReactSelectProps<SelectOption>['onChange'], undefined>
  >(
    (newValue, actionMeta) => {
      if (!onChangeProp) {
        return;
      }

      if (Array.isArray(newValue)) {
        return;
      }

      onChangeProp(newValue as SingleValue<SelectOption>, actionMeta);
    },
    [onChangeProp],
  );

  return (
    <SelectBase<SelectOption>
      className={clsx(styles.wrapper, className, {
        [styles['wrapper--error']]: isError,
      })}
      classNames={{
        menu: () => styles.menu,
        option: ({ data }) => (data?.to ? 'with-link' : ''),
      }}
      components={{
        DropdownIndicator,
        IndicatorSeparator: null,
      }}
      formatOptionLabel={CustomOption}
      menuPortalTarget={document.body}
      onChange={onChange}
      isSearchable={isSearchable}
      {...rest}
    />
  );
};

Select.displayName = displayName;

export default Select;
