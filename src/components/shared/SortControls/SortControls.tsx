import { defineMessages } from '@formatjs/intl';
import React from 'react';

import { Form, Select } from '~shared/Fields';
import { SearchableSortDirection } from '~types';

import { SortSelectOptions } from './sortControlsConfig';

import styles from './SortControls.css';

const displayName = 'SortControls';

const MSG = defineMessages({
  labelFilter: {
    id: `${displayName}.labelFilter`,
    defaultMessage: 'Filter',
  },
});

type Options = typeof SortSelectOptions;

interface SortControlsProps {
  options?: Options;
  onChange: (optionValue: SearchableSortDirection) => void;
  sortDirection: SearchableSortDirection;
}

const SortControls = ({
  options = SortSelectOptions,
  onChange,
  sortDirection,
}: SortControlsProps) => {
  return (
    <Form defaultValues={{ filter: sortDirection }} onSubmit={() => null}>
      <div className={styles.filter}>
        <Select
          appearance={{ theme: 'alt' }}
          elementOnly
          label={MSG.labelFilter}
          name="filter"
          options={options}
          onChange={onChange}
          placeholder={MSG.labelFilter}
        />
      </div>
    </Form>
  );
};

SortControls.displayName = displayName;

export default SortControls;
