import React, { useRef } from 'react';
import { MessageDescriptor } from 'react-intl';

import { Select } from '~shared/Fields';
import { SelectOption } from '~shared/Fields/Select';
// import { FormValues } from './MembersFilter';

import { Appearance } from './types';

const displayName = 'common.ColonyMembers.MembersFilter.Filter';

interface Props {
  appearance?: Appearance;
  name: string;
  options?: SelectOption[];
  label: string | MessageDescriptor;
  // handleFiltersCallback: (filters: string) => void;
}

const Filter = ({
  appearance,
  name,
  options,
  label,
}: // handleFiltersCallback,
Props) => {
  const selectRef = useRef<HTMLDivElement>(null);

  const scrollIntoView = () => {
    selectRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      onClick={scrollIntoView}
      ref={selectRef}
      role="button"
      tabIndex={0}
      onKeyUp={scrollIntoView}
    >
      <Select
        appearance={appearance}
        name={name}
        options={options}
        label={label}
        // onChange={(val) => handleFiltersCallback(val)}
      />
    </div>
  );
};

Filter.displayName = displayName;

export default Filter;
