import { defineMessages } from '@formatjs/intl';
import React from 'react';

import { HookForm as Form, HookFormSelect as Select } from '~shared/Fields';
import { SortDirection } from '~types';

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
  onChange: (optionValue: SortDirection) => void;
}

const SortControls = ({
  options = SortSelectOptions,
  onChange,
}: SortControlsProps) => {
  return (
    <Form defaultValues={{ filter: SortDirection.Desc }} onSubmit={() => null}>
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
