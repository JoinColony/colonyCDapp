import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { SetStateFn } from '~types';
import { Form, Select } from '~shared/Fields';
import { ModelSortDirection } from '~gql';

import styles from './ColonyDecisions.css';

const displayName = 'common.ColonyDecisions.DecisionListHeader';

const MSG = defineMessages({
  decisionsTitle: {
    id: `${displayName}.decisionsTitle`,
    defaultMessage: 'Decisions',
  },
  labelFilter: {
    id: `${displayName}.labelFilter`,
    defaultMessage: 'Filter',
  },
  soonest: {
    id: `${displayName}.soonest`,
    defaultMessage: 'Ending soonest',
  },
  latest: {
    id: `${displayName}.latest`,
    defaultMessage: 'Ending latest',
  },
});

const SortSelectOptions = [
  {
    label: MSG.soonest,
    value: ModelSortDirection.Asc,
  },
  {
    label: MSG.latest,
    value: ModelSortDirection.Desc,
  },
];

interface DecisionListHeaderProps {
  sortDirection: ModelSortDirection;
  setSortDirection: SetStateFn<ModelSortDirection>;
}

const DecisionListHeader = ({
  sortDirection,
  setSortDirection,
}: DecisionListHeaderProps) => {
  return (
    <div className={styles.bar}>
      <div className={styles.title}>
        <FormattedMessage {...MSG.decisionsTitle} />
      </div>

      <div className={styles.filter}>
        <Form onSubmit={() => {}} defaultValues={{ filter: sortDirection }}>
          <Select
            appearance={{
              alignOptions: 'left',
              theme: 'alt',
            }}
            elementOnly
            label={MSG.labelFilter}
            name="filter"
            options={SortSelectOptions}
            onChange={(value) => setSortDirection(value as ModelSortDirection)}
          />
        </Form>
      </div>
    </div>
  );
};

export default DecisionListHeader;
