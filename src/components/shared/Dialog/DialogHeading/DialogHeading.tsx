import React, { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';
import { Id } from '@colony/colony-js';

import { useFormContext } from 'react-hook-form';
import { Heading3 } from '~shared/Heading';
import { Colony, UniversalMessageValues } from '~types';

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
}

const DialogHeading = ({
  colony,
  title,
  titleValues,
  children,
  userHasPermission,
  isVotingExtensionEnabled,
  isRootMotion,
}: Props) => {
  const {
    watch,
    formState: { isSubmitting },
  } = useFormContext();
  const { fromDomainId } = watch();
  const handleFilterMotionDomains = (optionDomain) => {
    const optionDomainId = parseInt(optionDomain.value, 10);
    if (fromDomainId === Id.RootDomain) {
      return optionDomainId === Id.RootDomain;
    }
    return optionDomainId === fromDomainId || optionDomainId === Id.RootDomain;
  };

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
