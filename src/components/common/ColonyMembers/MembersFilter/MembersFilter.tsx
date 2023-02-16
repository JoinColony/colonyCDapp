import React from 'react';
// import { FormikProps } from 'formik';
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
  handleFiltersCallback: (filters: FormValues) => void;
  isRoot: boolean;
}

const MembersFilter = ({ handleFiltersCallback, isRoot }: Props) => {
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
        {/* {({ resetForm, values }: FormikProps<FormValues>) => { */}
        {({ formState: { isSubmitting, isValid }, getValues }) => {
          const values = getValues();
          const showReset =
            values.verificationType !== VerificationType.All ||
            values.memberType !== MemberType.All;
          console.log('values', values);
          handleFiltersCallback(values);
          return (
            <div className={styles.filters}>
              <div className={styles.titleContainer}>
                <span className={styles.title}>
                  <FormattedMessage {...MSG.filter} />
                </span>
                {showReset && (
                  <Button
                    disabled={!isValid || isSubmitting}
                    text={MSG.reset}
                    type="submit"
                    appearance={{ theme: 'blue' }}
                    // onClick={() => submit()}
                  />
                )}
              </div>
              {filterItems.map(
                ({ appearance, name, options, label, isRootRequired }) => {
                  const hideFilter = isRootRequired && !isRoot;
                  return (
                    !hideFilter && (
                      <Filter
                        key={name}
                        appearance={appearance}
                        name={name}
                        options={options}
                        label={label}
                        // handleFiltersCallback={handleFiltersCallback}
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
