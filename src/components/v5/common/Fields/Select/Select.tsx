import React, { useCallback } from 'react';
import { Props as ReactSelectProps, SingleValue } from 'react-select';
import clsx from 'clsx';

import CustomOption from './partials/CustomOption';
import DropdownIndicator from './partials/DropdownIndicator';
import SelectBase from './SelectBase';
import styles from './Select.module.css';
import { SelectOption, SelectProps } from './types';

const displayName = 'v5.common.Fields.Select';

const Select: React.FC<SelectProps> = ({
  onChange: onChangeProp,
  isSearchable = false,
  className,
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
      className={clsx(styles.wrapper, className)}
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
