import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~shared/Button';
import { HookForm as Form } from '~shared/Fields';

import Filter from './Filter';
import { filterItems, MemberType, VerificationType } from './filtersConfig';

import styles from './MembersFilter.css';

const displayName = 'common.ColonyMembers.MembersFilter';

const MSG = defineMessages({
  filter: {
    id: `${displayName}.filter`,
    defaultMessage: 'Filters',
  },
  reset: {
    id: `${displayName}.reset`,
    defaultMessage: 'Reset',
  },
  allMembers: {
    id: `${displayName}.allMembers`,
    defaultMessage: 'All members',
  },
  any: {
    id: `${displayName}.allMembers`,
    defaultMessage: 'Any',
  },
});

export interface FormValues {
  memberType: MemberType;
  verificationType: VerificationType;
}

interface Props {
  onFilterChange: (name, value) => void;
  isRootOrAllDomains: boolean;
}

const handleReset = (handleFilterChange, reset, defaultValues) => {
  Object.entries(defaultValues).forEach(([key, value]) => {
    handleFilterChange(key, value);
  });
  reset();
};

const MembersFilter = ({ onFilterChange, isRootOrAllDomains }: Props) => {
  return (
    <>
      <hr className={styles.divider} />
      <Form
        defaultValues={{
          memberType: MemberType.All,
          verificationType: VerificationType.All,
        }}
        onSubmit={() => {}}
      >
        {({ formState: { isDirty, defaultValues }, reset }) => {
          return (
            <div className={styles.filters}>
              <div className={styles.titleContainer}>
                <span className={styles.title}>
                  <FormattedMessage {...MSG.filter} />
                </span>
                {isDirty && (
                  <Button
                    text={MSG.reset}
                    appearance={{ theme: 'blue' }}
                    onClick={() =>
                      handleReset(onFilterChange, reset, defaultValues)
                    }
                  />
                )}
              </div>
              {filterItems.map(
                ({ appearance, name, options, label, isRootRequired }) => {
                  const hideFilter = isRootRequired && !isRootOrAllDomains;
                  return (
                    !hideFilter && (
                      <Filter
                        key={name}
                        appearance={appearance}
                        name={name}
                        options={options}
                        label={label}
                        handleFilterChange={onFilterChange}
                      />
                    )
                  );
                },
              )}
            </div>
          );
        }}
      </Form>
    </>
  );
};

MembersFilter.displayName = displayName;

export default MembersFilter;
