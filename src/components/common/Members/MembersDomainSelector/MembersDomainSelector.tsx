import React from 'react';
import { defineMessages } from 'react-intl';

import { Select, HookForm as Form } from '~shared/Fields';

import { SelectOption } from '~shared/Fields/Select';

import styles from './MembersDomainSelector.css';

const displayName = 'common.Members.MembersDomainSelector';

const MSG = defineMessages({
  labelFilter: {
    id: `${displayName}.labelFilter`,
    defaultMessage: 'Filter',
  },
});

interface FormValues {
  filter: string;
}

interface Props {
  currentDomainId: number;
  domainSelectOptions: SelectOption[];
  handleDomainChange: (domainId: number) => void;
}

const MembersDomainSelector = ({
  currentDomainId,
  handleDomainChange,
  domainSelectOptions,
}: Props) => {
  return (
    <Form<FormValues>
      defaultValues={{ filter: currentDomainId.toString() }}
      onSubmit={() => {}}
    >
      <div className={styles.titleSelect}>
        <Select
          appearance={{
            alignOptions: 'right',
            size: 'mediumLarge',
            theme: 'alt',
            // unrestrictedOptionsWidth: 'true',
          }}
          elementOnly
          label={MSG.labelFilter}
          name="filter"
          onChange={(domainId) => handleDomainChange(parseInt(domainId, 10))}
          options={domainSelectOptions}
        />
      </div>
    </Form>
  );
};

MembersDomainSelector.displayName = displayName;

export default MembersDomainSelector;
