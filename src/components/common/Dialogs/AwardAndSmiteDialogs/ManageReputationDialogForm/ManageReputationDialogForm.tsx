import React, { useMemo, useCallback, useEffect, ReactNode } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import {
  Id,
  ColonyRole,
  // VotingReputationVersion,
} from '@colony/colony-js';
import Decimal from 'decimal.js';
import { FormState, UseFormSetValue } from 'react-hook-form';

import Button from '~shared/Button';
import { ItemDataType } from '~shared/OmniPicker';
import { ActionDialogProps } from '~shared/Dialog';
import DialogSection from '~shared/Dialog/DialogSection';
import {
  Select,
  HookFormInput as Input,
  Annotations,
  SelectOption,
} from '~shared/Fields';
import { Heading3 } from '~shared/Heading';
// import { ForceToggle } from '~shared/Fields';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import PermissionsLabel from '~shared/PermissionsLabel';
import Numeral from '~shared/Numeral';
import ExternalLink from '~shared/ExternalLink';
import SingleUserPicker, {
  filterUserSelection,
} from '~shared/SingleUserPicker';
import UserAvatar from '~shared/UserAvatar';
// import MotionDomainSelect from '~dashboard/MotionDomainSelect';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import { REPUTATION_LEARN_MORE } from '~constants/externalUrls';

import { Address, ColonyWatcher, User } from '~types/index';

import {
  useAppContext,
  useDialogActionPermissions,
  useTransformer,
  useUserReputation,
} from '~hooks'; // useEnabledExtensions
import { getFormattedTokenValue } from '~utils/tokens';
import { calculatePercentageReputation } from '~utils/reputation';
import { userHasRole } from '~utils/checks';
import { sortBy } from '~utils/lodash';

import { getUserRolesForDomain } from '~redux/transformers';

import { ManageReputationDialogFormValues } from '../types';

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
  amount: {
    id: `${displayName}.amount`,
    defaultMessage: `Amount of reputation points to {isSmiteAction, select,
      true {deduct}
      other {award}
    }`,
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
  noPermission: {
    id: `${displayName}.noPermission`,
    defaultMessage: `You need the {roleRequired} permission in {domain} to take this action.`,
  },
  maxReputation: {
    id: `${displayName}.maxReputation`,
    defaultMessage: `{isSmiteAction, select,
      true {max: }
      other {}
    }{userReputationAmount} {userReputationAmount, plural,
      one {pt}
      other {pts}
    } ({userPercentageReputation}%)`,
  },
  warningTitle: {
    id: `${displayName}.warningTitle`,
    defaultMessage: `Caution!`,
  },
  warningText: {
    id: `${displayName}.noPermission`,
    defaultMessage: `Improper use of this feature can break your colony. <a>Learn more</a>`,
  },
  cannotCreateMotion: {
    id: `${displayName}.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

interface Props extends ActionDialogProps {
  nativeTokenDecimals: number;
  verifiedUsers: ColonyWatcher['user'][];
  values: ManageReputationDialogFormValues;
  setValue: UseFormSetValue<ManageReputationDialogFormValues>;
  ethDomainId?: number;
  updateReputation?: (
    userPercentageReputation: number,
    totalRep?: string,
  ) => void;
  isSmiteAction?: boolean;
}

const supRenderAvatar = (address: Address, item: ItemDataType<User>) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const LearnMoreLink = (chunks: React.ReactNode[]) => (
  <ExternalLink href={REPUTATION_LEARN_MORE}>{chunks}</ExternalLink>
);

const ManageReputationDialogForm = ({
  back,
  colony: { domains, colonyAddress },
  colony,
  isSubmitting,
  isValid,
  values,
  updateReputation,
  ethDomainId: preselectedDomainId,
  nativeTokenDecimals,
  verifiedUsers,
  isSmiteAction = false,
}: Props & FormState<ManageReputationDialogFormValues>) => {
  const { user: currentUser } = useAppContext();
  const hasRegisteredProfile =
    !!currentUser?.name && !!currentUser.walletAddress;

  const selectedDomain =
    preselectedDomainId === 0 || preselectedDomainId === undefined
      ? Id.RootDomain
      : preselectedDomainId;

  const domainId = values.domainId
    ? parseInt(values.domainId, 10)
    : selectedDomain;

  const domainRoles = useTransformer(getUserRolesForDomain, [
    colony,
    currentUser?.walletAddress,
    domainId,
  ]);

  const hasRoles =
    hasRegisteredProfile &&
    userHasRole(
      domainRoles,
      isSmiteAction ? ColonyRole.Arbitration : ColonyRole.Root,
    );

  // const {
  //   votingExtensionVersion,
  //   isVotingExtensionEnabled,
  // } = useEnabledExtensions({
  //   colonyAddress,
  // });

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colonyAddress,
    hasRoles,
    false, // isVotingExtensionEnabled,
    values.forceAction,
    domainId,
  );

  const inputDisabled = !userHasPermission || onlyForceAction;

  const { userReputation, totalReputation } = useUserReputation(
    colonyAddress,
    values.user?.walletAddress,
    Number(values.domainId),
  );

  const userPercentageReputation = calculatePercentageReputation(
    userReputation,
    totalReputation,
  );
  const unformattedUserReputationAmount = new Decimal(userReputation || 0)
    .div(new Decimal(10).pow(nativeTokenDecimals))
    .toNumber();
  const formattedUserReputationAmount = getFormattedTokenValue(
    userReputation || 0,
    nativeTokenDecimals,
  );

  const colonyDomains = useMemo(() => domains?.items || [], [domains]);
  const domainOptions = useMemo(
    () =>
      sortBy(
        colonyDomains.map((domain) => ({
          children: (
            <TeamDropdownItem
              domain={domain}
              user={values.user}
              userReputation={userReputation}
              totalReputation={totalReputation}
            />
          ),
          value: `${domain?.nativeId}`,
          label: domain?.name || `Domain #${domain?.nativeId}`,
        })),
        ['value'],
      ),

    [colonyDomains, values, totalReputation, userReputation],
  );

  const domainName = useMemo(
    () =>
      colonyDomains.filter(
        (domain) => `${domain?.nativeId}` === domainId.toString(),
      )[0]?.name,
    [colonyDomains, domainId],
  );

  const renderActiveOption = useCallback<
    (option: SelectOption | undefined) => ReactNode
  >(
    (option) => {
      const value = option ? option.value : undefined;
      const activeDomain =
        colonyDomains.find((domain) => Number(value) === domain?.nativeId) ||
        null;
      return (
        <div className={styles.activeItem}>
          <TeamDropdownItem
            domain={activeDomain}
            user={values.user}
            userReputation={userReputation}
            totalReputation={totalReputation}
          />
        </div>
      );
    },
    [values, colonyDomains, totalReputation, userReputation],
  );

  useEffect(() => {
    if (updateReputation) {
      updateReputation(unformattedUserReputationAmount);
    }
  }, [updateReputation, unformattedUserReputationAmount]);

  // const handleFilterMotionDomains = useCallback(
  //   (optionDomain) => {
  //     const optionDomainId = parseInt(optionDomain.value, 10);
  //     if (domainId === Id.RootDomain) {
  //       return optionDomainId === Id.RootDomain;
  //     }
  //     return optionDomainId === domainId || optionDomainId === Id.RootDomain;
  //   },
  //   [domainId],
  // );

  // const handleMotionDomainChange = useCallback(
  //   (motionDomainId) => setFieldValue('motionDomainId', motionDomainId),
  //   [setFieldValue],
  // );

  // const cannotCreateMotion =
  //   votingExtensionVersion ===
  //     VotingReputationVersion.FuchsiaLightweightSpaceship &&
  //   !values.forceAction;

  const formattingOptions = useMemo(
    () => ({
      numeral: true,
      tailPrefix: true,
      numeralDecimalScale: 10,
    }),
    [],
  );
  const formattedData = useMemo(
    () => verifiedUsers.map((user) => ({ ...user, id: user.walletAddress })),
    [verifiedUsers],
  );

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.modalHeading}>
          {/*
           * @NOTE We can only create a motion to vote in a subdomain if we
           * change reputation in that subdomain
           */}
          {/* {isVotingExtensionEnabled && (
            <div className={styles.motionVoteDomain}>
              <MotionDomainSelect
                colony={colony}
                onDomainChange={handleMotionDomainChange}
                disabled={values.forceAction}
                filterDomains={handleFilterMotionDomains}
                initialSelectedDomain={domainId}
              />
            </div>
          )} */}
          <div className={styles.headingContainer}>
            <Heading3
              appearance={{ margin: 'none', theme: 'dark' }}
              text={MSG.title}
              textValues={{
                isSmiteAction,
              }}
            />
            {/* {hasRoles && isVotingExtensionEnabled && (
              <ForceToggle disabled={!userHasPermission || isSubmitting} />
            )} */}
          </div>
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
        </div>
      </DialogSection>
      {!isSmiteAction && <hr className={styles.divider} />}
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={[ColonyRole.Arbitration]} />
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
            disabled={inputDisabled}
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
              disabled={!userHasPermission}
            />
          </div>
        </div>
      </DialogSection>
      <DialogSection>
        <div className={styles.inputContainer}>
          <div>
            <Input
              name="amount"
              label={MSG.amount}
              labelValues={{ isSmiteAction }}
              appearance={{
                theme: 'minimal',
                align: 'right',
              }}
              formattingOptions={formattingOptions}
              elementOnly
              maxButtonParams={
                isSmiteAction
                  ? {
                      maxAmount: String(unformattedUserReputationAmount),
                    }
                  : undefined
              }
              disabled={inputDisabled}
              dataTest="reputationAmountInput"
              valueAsNumber
            />
            <div className={styles.percentageSign}>pts</div>
          </div>
          <p className={styles.inputText}>
            <FormattedMessage
              {...MSG.maxReputation}
              values={{
                isSmiteAction,
                userReputationAmount: (
                  <Numeral value={formattedUserReputationAmount} />
                ),
                userPercentageReputation:
                  userPercentageReputation === null
                    ? 0
                    : userPercentageReputation,
              }}
            />
          </p>
        </div>
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          labelValues={{
            isSmiteAction,
          }}
          name="annotation"
          disabled={inputDisabled}
          dataTest="reputationAnnotation"
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionFromMessage}>
            <FormattedMessage
              {...MSG.noPermission}
              values={{
                roleRequired: (
                  <PermissionsLabel
                    permission={ColonyRole.Architecture}
                    name={{ id: `role.${ColonyRole.Architecture}` }}
                  />
                ),
                domain: domainName,
              }}
            />
          </div>
        </DialogSection>
      )}
      {/* {onlyForceAction && (
        <NotEnoughReputation
          appearance={{ marginTop: 'negative' }}
          domainId={Number(domainId)}
        />
      )} */}
      {/* {cannotCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionFromMessage}>
            <FormattedMessage
              {...MSG.cannotCreateMotion}
              values={{
                version:
                  VotingReputationVersion.FuchsiaLightweightSpaceship,
              }}
            />
          </div>
        </DialogSection>
      )} */}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={
            values.forceAction || true // || !isVotingExtensionEnabled
              ? { id: 'button.confirm' }
              : { id: 'button.createMotion' }
          }
          loading={isSubmitting}
          disabled={!isValid || inputDisabled} // cannotCreateMotion ||
          style={{ minWidth: styles.wideButton }}
          data-test="reputationConfirmButton"
        />
      </DialogSection>
    </>
  );
};

ManageReputationDialogForm.displayName = displayName;

export default ManageReputationDialogForm;
