import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';
import Decimal from 'decimal.js';
import { useFormContext } from 'react-hook-form';

import { ItemDataType } from '~shared/OmniPicker';
import {
  ActionDialogProps,
  DialogControls,
  DialogHeading,
  DialogSection,
} from '~shared/Dialog';
import { HookFormSelect as Select, Annotations } from '~shared/Fields';
import ExternalLink from '~shared/ExternalLink';
import SingleUserPicker, {
  filterUserSelection,
} from '~shared/SingleUserPicker';
import UserAvatar from '~shared/UserAvatar';
import { REPUTATION_LEARN_MORE } from '~constants/externalUrls';

import { MemberUser, SetStateFn, User } from '~types';

import { useActionDialogStatus, useUserReputation } from '~hooks';
import { sortBy } from '~utils/lodash';
import { notNull } from '~utils/arrays';
import { findDomainByNativeId } from '~utils/domains';

import {
  NoPermissionMessage,
  CannotCreateMotionMessage,
  PermissionRequiredInfo,
  NotEnoughReputation,
} from '../../Messages';
import ReputationAmountInput from './ReputationAmountInput';
import TeamDropdownItem from './TeamDropdownItem';

import styles from './ManageReputationDialogForm.css';

const displayName =
  'common.ManageReputationContainer.ManageReputationDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: `{isSmiteAction, select,
      true {Smite Reputation}
      other {Award Reputation}}`,
  },
  team: {
    id: `${displayName}.team`,
    defaultMessage: `Team in which Reputation should be {isSmiteAction, select,
      true {deducted}
      other {awarded}
    }`,
  },
  recipient: {
    id: `${displayName}.recipient`,
    defaultMessage: 'Recipient',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: `Explain why you're {isSmiteAction, select,
      true {smiting}
      other {awarding}
    } the user (optional)`,
  },
  userPickerPlaceholder: {
    id: `${displayName}.userPickerPlaceholder`,
    defaultMessage: 'Search for a user or paste wallet address',
  },
  warningTitle: {
    id: `${displayName}.warningTitle`,
    defaultMessage: `Caution!`,
  },
  warningText: {
    id: `${displayName}.warningText`,
    defaultMessage: `Improper use of this feature can break your colony. <a>Learn more</a>`,
  },
});

interface Props extends ActionDialogProps {
  nativeTokenDecimals: number;
  users: MemberUser[];
  schemaUserReputation?: number;
  updateSchemaUserReputation?: (
    userPercentageReputation: number,
    totalRep?: string,
  ) => void;
  isSmiteAction?: boolean;
  isForce: boolean;
  setIsForce: SetStateFn;
}

const supRenderAvatar = (item: ItemDataType<User>) => (
  <UserAvatar user={item} size="xs" />
);

const LearnMoreLink = (chunks: React.ReactNode[]) => (
  <ExternalLink href={REPUTATION_LEARN_MORE}>{chunks}</ExternalLink>
);

const ManageReputationDialogForm = ({
  back,
  colony: { domains, colonyAddress },
  colony,
  schemaUserReputation,
  updateSchemaUserReputation,
  nativeTokenDecimals,
  users,
  isSmiteAction = false,
  enabledExtensionData,
  isForce,
  setIsForce,
}: Props) => {
  const { watch, trigger } = useFormContext();
  const { domainId, motionDomainId, user: selectedUser, forceAction } = watch();

  useEffect(() => {
    if (forceAction !== isForce) {
      setIsForce(forceAction);
    }
  }, [forceAction, isForce, setIsForce]);

  const requiredRoles = [
    isSmiteAction ? ColonyRole.Arbitration : ColonyRole.Root,
  ];

  const {
    userHasPermission,
    disabledInput,
    disabledSubmit,
    canCreateMotion,
    canOnlyForceAction,
  } = useActionDialogStatus(
    colony,
    requiredRoles,
    [domainId],
    enabledExtensionData,
    motionDomainId,
  );

  const { userReputation } = useUserReputation(
    colonyAddress,
    selectedUser?.walletAddress,
    Number(domainId),
  );

  const unformattedUserReputationAmount = new Decimal(userReputation || 0)
    .div(new Decimal(10).pow(nativeTokenDecimals))
    .toNumber();

  const colonyDomains = domains?.items.filter(notNull) || [];
  const domainOptions = sortBy(
    colonyDomains.map((domain) => ({
      children: (
        <TeamDropdownItem
          domain={domain}
          colonyAddress={colony.colonyAddress}
        />
      ),
      value: domain.nativeId,
      label: domain.metadata?.name || `Domain #${domain.nativeId}`,
    })),
    ['value'],
  );

  const selectedDomain = findDomainByNativeId(domainId, colony);
  const domainName = selectedDomain?.metadata?.name;

  const renderActiveOption = (option) => {
    const value = option ? option.value : undefined;
    const activeDomain =
      colonyDomains.find((domain) => Number(value) === domain?.nativeId) ||
      null;
    return (
      <div className={styles.activeItem}>
        <TeamDropdownItem
          domain={activeDomain}
          colonyAddress={colony.colonyAddress}
        />
      </div>
    );
  };

  useEffect(() => {
    if (updateSchemaUserReputation) {
      updateSchemaUserReputation(unformattedUserReputationAmount);
    }
  }, [updateSchemaUserReputation, unformattedUserReputationAmount]);

  useEffect(() => {
    if (isSmiteAction) {
      trigger('amount');
    }
  }, [schemaUserReputation, isSmiteAction, trigger]);

  const formattedData = users.map((user) => ({
    ...user,
    id: user.walletAddress,
  }));

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading
          title={MSG.title}
          titleValues={{
            isSmiteAction,
          }}
          userHasPermission={userHasPermission}
          colony={colony}
          isVotingExtensionEnabled={
            enabledExtensionData.isVotingReputationEnabled
          }
          isRootMotion={!isSmiteAction}
          selectedDomainId={selectedDomain?.nativeId}
        >
          {!isSmiteAction && (
            <div className={styles.warningContainer}>
              <p className={styles.warningTitle}>
                <FormattedMessage {...MSG.warningTitle} />
              </p>
              <p className={styles.warningText}>
                <FormattedMessage
                  {...MSG.warningText}
                  values={{
                    a: LearnMoreLink,
                  }}
                />
              </p>
            </div>
          )}
        </DialogHeading>
      </DialogSection>
      {!isSmiteAction && <hr className={styles.divider} />}
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={requiredRoles} />
        </DialogSection>
      )}
      <DialogSection>
        <div className={styles.singleUserContainer}>
          <SingleUserPicker
            appearance={{ width: 'wide' }}
            data={formattedData}
            label={MSG.recipient}
            name="user"
            filter={filterUserSelection}
            renderAvatar={supRenderAvatar}
            placeholder={MSG.userPickerPlaceholder}
            disabled={disabledInput}
            dataTest="reputationRecipientSelector"
            itemDataTest="reputationRecipientSelectorItem"
            valueDataTest="reputationRecipientName"
          />
        </div>
      </DialogSection>
      <DialogSection>
        <div className={styles.domainSelects}>
          <div>
            <Select
              options={domainOptions}
              label={MSG.team}
              labelValues={{
                isSmiteAction,
              }}
              name="domainId"
              appearance={{ theme: 'grey', width: 'fluid' }}
              renderActiveOption={renderActiveOption}
              disabled={!userHasPermission || canOnlyForceAction}
            />
          </div>
        </div>
      </DialogSection>
      <DialogSection>
        <ReputationAmountInput
          colony={colony}
          disabled={disabledInput}
          nativeTokenDecimals={nativeTokenDecimals}
          isSmiteAction={isSmiteAction}
        />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          labelValues={{
            isSmiteAction,
          }}
          name="annotation"
          disabled={disabledInput}
          dataTest="reputationAnnotation"
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <NoPermissionMessage
            requiredPermissions={requiredRoles}
            domainName={domainName}
          />
        </DialogSection>
      )}

      {canOnlyForceAction && (
        <DialogSection>
          <NotEnoughReputation
            appearance={{ marginTop: 'negative' }}
            domainId={Number(motionDomainId)}
          />
        </DialogSection>
      )}
      {!canCreateMotion && (
        <DialogSection>
          <CannotCreateMotionMessage />
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          onSecondaryButtonClick={back}
          disabled={disabledSubmit}
          dataTest="reputationConfirmButton"
          isVotingReputationEnabled={
            enabledExtensionData.isVotingReputationEnabled
          }
        />
      </DialogSection>
    </>
  );
};

ManageReputationDialogForm.displayName = displayName;

export default ManageReputationDialogForm;
