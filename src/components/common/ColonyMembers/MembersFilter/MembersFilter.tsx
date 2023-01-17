import React, { useRef } from 'react';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~shared/Button';
import { Form, Select } from '~shared/Fields';

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
  contributors: {
    id: `${displayName}.contributors`,
    defaultMessage: 'Contributors',
  },
  watchers: {
    id: `${displayName}.watchers`,
    defaultMessage: 'Watchers',
  },
  verified: {
    id: `${displayName}.verified`,
    defaultMessage: 'Verified',
  },
  unverified: {
    id: `${displayName}.unverified`,
    defaultMessage: 'Unverified',
  },
  banned: {
    id: `${displayName}.banned`,
    defaultMessage: 'Banned',
  },
  notBanned: {
    id: `${displayName}.notBanned`,
    defaultMessage: 'Not banned',
  },
  memberType: {
    id: `${displayName}.memberType`,
    defaultMessage: 'Member type',
  },
  bannedStatus: {
    id: `${displayName}.bannedStatus`,
    defaultMessage: 'Banned status',
  },
  verificationType: {
    id: `${displayName}.verificationType`,
    defaultMessage: 'Verification type',
  },
});

export enum MemberType {
  All = 'all',
  Contributers = 'contributors',
  Watchers = 'watchers',
}

export enum VerificationType {
  All = 'all',
  Verified = 'verified',
  Unverified = 'unverified',
}

export enum BannedStatus {
  All = 'all',
  Banned = 'banned',
  Not_Banned = 'not_banned',
}

export interface FormValues {
  memberType: MemberType;
  verificationType: VerificationType;
  bannedStatus: BannedStatus;
}

const memberTypes = [
  { label: MSG.allMembers, value: MemberType.All },
  { label: MSG.contributors, value: MemberType.Contributers },
  { label: MSG.watchers, value: MemberType.Watchers },
];

const verificationTypes = [
  { label: MSG.any, value: VerificationType.All },
  { label: MSG.verified, value: VerificationType.Verified },
  { label: MSG.unverified, value: VerificationType.Unverified },
];

const bannedStatuses = [
  { label: MSG.any, value: BannedStatus.All },
  { label: MSG.banned, value: BannedStatus.Banned },
  { label: MSG.notBanned, value: BannedStatus.Not_Banned },
];

interface Props {
  handleFiltersCallback: (filters: FormValues) => void;
  isRoot: boolean;
}

const MembersFilter = ({ handleFiltersCallback, isRoot }: Props) => {
  const selectRef = useRef<HTMLDivElement>(null);

  const scrollIntoView = () => {
    selectRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <hr className={styles.divider} />
      <Form
        initialValues={{
          memberType: MemberType.All,
          verificationType: VerificationType.All,
          bannedStatus: BannedStatus.All,
        }}
        onSubmit={() => {}}
        enableReinitialize
      >
        {({ resetForm, values }: FormikProps<FormValues>) => {
          handleFiltersCallback(values);
          return (
            <div className={styles.filters}>
              <div className={styles.titleContainer}>
                <span className={styles.title}>
                  <FormattedMessage {...MSG.filter} />
                </span>
                {(values.bannedStatus !== BannedStatus.All ||
                  values.verificationType !== VerificationType.All ||
                  values.memberType !== MemberType.All) && (
                  <Button
                    text={MSG.reset}
                    appearance={{ theme: 'blue' }}
                    onClick={() => resetForm()}
                  />
                )}
              </div>
              {isRoot && (
                <Select
                  appearance={{ theme: 'grey' }}
                  name="memberType"
                  options={memberTypes}
                  label={MSG.memberType}
                />
              )}
              <Select
                appearance={{ theme: 'grey' }}
                name="verificationType"
                options={verificationTypes}
                label={MSG.verificationType}
              />
              {/* Have to use `div` and not a button as we use button
              further down in `Select` componment and it produces
              a bad html hierarcy warning */}
              <div
                onClick={scrollIntoView}
                ref={selectRef}
                role="button"
                tabIndex={0}
                onKeyUp={scrollIntoView}
              >
                <Select
                  appearance={{ theme: 'grey' }}
                  name="bannedStatus"
                  options={bannedStatuses}
                  label={MSG.bannedStatus}
                />
              </div>
            </div>
          );
        }}
      </Form>
    </>
  );
};

MembersFilter.displayName = displayName;

export default MembersFilter;
