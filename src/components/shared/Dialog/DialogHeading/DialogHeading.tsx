import React, { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { Id } from '@colony/colony-js';

import { Heading3 } from '~shared/Heading';
import { Colony, UniversalMessageValues } from '~types';
import { SelectOption } from '~shared/Fields';

import ForceToggle from './ForceToggle';
import MotionDomainSelect from './MotionDomainSelect';

import styles from './DialogHeading.css';

const displayName = 'DialogHeading';

interface Props {
  title: MessageDescriptor;
  userHasPermission: boolean;
  colony: Colony;
  isVotingExtensionEnabled: boolean;
  isRootMotion?: boolean;
  titleValues?: UniversalMessageValues;
  children?: ReactNode;
  selectedDomainId?: number;
}

const DialogHeading = ({
  colony,
  title,
  titleValues,
  children,
  userHasPermission,
  isVotingExtensionEnabled,
  isRootMotion,
  selectedDomainId = Id.RootDomain,
}: Props) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  const handleFilterMotionDomains = (optionDomain: SelectOption) =>
    optionDomain.value === selectedDomainId ||
    optionDomain.value === Id.RootDomain;

  return (
    <div className={styles.modalHeading}>
      {isVotingExtensionEnabled && (
        <div className={styles.motionVoteDomain}>
          <MotionDomainSelect
            colony={colony}
            disabled={isRootMotion || isSubmitting}
            filterDomains={handleFilterMotionDomains}
          />
        </div>
      )}
      <div className={styles.headingContainer}>
        <Heading3
          appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
          text={title}
          textValues={titleValues}
        />
        {userHasPermission && isVotingExtensionEnabled && (
          <ForceToggle disabled={isSubmitting} />
        )}
      </div>
      {children}
    </div>
  );
};

DialogHeading.displayName = displayName;

export default DialogHeading;
