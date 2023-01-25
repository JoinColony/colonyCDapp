import React, { useMemo, useState, useCallback } from 'react'; // useEffect
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { ColonyRole, Id } from '@colony/colony-js';
import { isConfusing } from '@colony/unicode-confusables-noascii';
import { AddressZero } from '@ethersproject/constants';
import { FormState, UseFormSetValue } from 'react-hook-form';

import EthUsd from '~shared/EthUsd';
import Numeral from '~shared/Numeral';
import PermissionsLabel from '~shared/PermissionsLabel';
import Button from '~shared/Button';
import ConfusableWarning from '~shared/ConfusableWarning';
import { ItemDataType } from '~shared/OmniPicker';
import { ActionDialogProps, DialogSection } from '~shared/Dialog';
import {
  Select,
  HookFormInput as Input,
  Annotations,
  TokenSymbolSelector,
} from '~shared/Fields';
import { Heading3 } from '~shared/Heading';
import SingleUserPicker, {
  filterUserSelection,
} from '~shared/SingleUserPicker';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import UserAvatar from '~shared/UserAvatar';
// import HookedUserAvatar from '~users/HookedUserAvatar';

// import { ForceToggle } from '~shared/Fields';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';
// import MotionDomainSelect from '~dashboard/MotionDomainSelect';

import { Address, User, ColonyWatcher } from '~types';

// import {
//   useTokenBalancesForDomainsLazyQuery,
//   useNetworkContracts,
// } from '~data/index';
import {
  // getBalanceFromToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import {
  useAppContext,
  useDialogActionPermissions,
  useTransformer,
} from '~hooks';
// import { useEnabledExtensions } from '~hooks/useEnabledExtensions';
import { getUserRolesForDomain } from '~redux/transformers';
import { userHasRole } from '~utils/checks';
import { notNull } from '~utils/arrays';
import { sortBy } from '~utils/lodash';

import { FormValues } from './CreatePaymentDialog';

import styles from './CreatePaymentDialogForm.css';

const displayName =
  'common.ColonyHome.CreatePaymentDialog.CreatePaymentDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Payment',
  },
  from: {
    id: `${displayName}.from`,
    defaultMessage: 'From',
  },
  to: {
    id: `${displayName}.to`,
    defaultMessage: 'Assignee',
  },
  amount: {
    id: `${displayName}.amount`,
    defaultMessage: 'Amount',
  },
  fee: {
    id: `${displayName}.fee`,
    defaultMessage: 'Network fee: {fee} {symbol}',
  },
  token: {
    id: `${displayName}.address`,
    defaultMessage: 'Token',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: 'Explain why you’re making this payment (optional)',
  },
  domainTokenAmount: {
    id: `${displayName}.domainTokenAmount`,
    defaultMessage: 'Available Funds: {amount} {symbol}',
  },
  noAmount: {
    id: `${displayName}.noAmount`,
    defaultMessage: 'Amount must be greater than zero',
  },
  noBalance: {
    id: `${displayName}.noBalance`,
    defaultMessage: 'Insufficient balance in from domain pot',
  },
  noPermissionFrom: {
    id: `${displayName}.noPermissionFrom`,
    defaultMessage: `You do not have the {firstRoleRequired} and
    {secondRoleRequired} permissions required to take this action.`,
  },
  noOneTxExtension: {
    id: `${displayName}.noOneTxExtension`,
    defaultMessage: `The OneTxPayment extension is not installed in this colony.
    Please use the Extensions Manager to install it if you want to make a new
    payment.`,
  },
  userPickerPlaceholder: {
    id: `${displayName}.userPickerPlaceholder`,
    defaultMessage: 'Search for a user or paste wallet address',
  },
  warningText: {
    id: `${displayName}.warningText`,
    defaultMessage: `<span>Warning.</span> You are about to make a payment to an address not on the whitelist. Are you sure the address is correct?`,
  },
  cannotCreateMotion: {
    id: `${displayName}.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

interface Props extends ActionDialogProps {
  verifiedUsers: ColonyWatcher['user'][];
  // showWhitelistWarning: boolean;
  values: FormValues;
  setValue: UseFormSetValue<FormValues>;
  filteredDomainId?: number;
}

// const UserAvatar = HookedUserAvatar({ fetchUser: false });

const renderAvatar = (address: Address, item: ItemDataType<User>) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

// NOTE: The equation to calculate totalToPay is as following (in Wei)
// totalToPay = (receivedAmount + 1) * (feeInverse / (feeInverse -1))
// The network adds 1 wei extra fee after the percentage calculation
// For more info check out
// https://github.com/JoinColony/colonyNetwork/blob/806e4d5750dc3a6b9fa80f6e007773b28327c90f/contracts/colony/ColonyFunding.sol#L656

export const calculateFee = (
  receivedAmount: string, // amount that the recipient finally receives
  feeInverse: string,
  decimals: number,
): { feesInWei: string; totalToPay: string } => {
  const amountInWei = moveDecimal(receivedAmount, decimals);
  const totalToPayInWei = BigNumber.from(amountInWei)
    .add(1)
    .mul(feeInverse)
    .div(BigNumber.from(feeInverse).sub(1));
  const feesInWei = totalToPayInWei.sub(amountInWei);
  return {
    feesInWei: feesInWei.toString(),
    totalToPay: moveDecimal(totalToPayInWei, -1 * decimals),
  }; // NOTE: seems like moveDecimal does not have strict typing
};

const CreatePaymentDialogForm = ({
  back,
  colony,
  verifiedUsers,
  isSubmitting,
  isValid,
  values,
  setValue,
  filteredDomainId: preselectedDomainId,
}: // showWhitelistWarning,
Props & FormState<FormValues>) => {
  const { wallet } = useAppContext();

  const selectedDomain =
    preselectedDomainId === 0 || preselectedDomainId === undefined
      ? Id.RootDomain
      : preselectedDomainId;

  const domainId = values.domainId
    ? parseInt(values.domainId, 10)
    : selectedDomain;
  /*
   * Custom error state tracking
   */
  const [customAmountError] = useState<
    // setCustomAmountError
    MessageDescriptor | string | undefined
  >(undefined);
  const [currentFromDomain, setCurrentFromDomain] = useState<number>(domainId);
  const { tokenAddress, amount } = values;
  const colonyTokens = useMemo(
    () =>
      colony?.tokens?.items
        .filter(notNull)
        .map((colonyToken) => colonyToken.token) || [],
    [colony?.tokens],
  );
  const selectedToken = useMemo(
    () =>
      colonyTokens.find((token) => token?.tokenAddress === values.tokenAddress),
    [colonyTokens, values.tokenAddress],
  );

  // const {
  //   isOneTxPaymentExtensionEnabled,
  //   votingExtensionVersion,
  //   isVotingExtensionEnabled,
  // } = useEnabledExtensions({
  //   colonyAddress,
  // });

  const fromDomainRoles = useTransformer(getUserRolesForDomain, [
    colony,
    wallet?.address,
    domainId,
  ]);

  const colonyDomains = useMemo(
    () => colony?.domains?.items || [],
    [colony?.domains],
  );
  const domainOptions = useMemo(
    () =>
      sortBy(
        colonyDomains.map((domain) => ({
          value: `${domain?.nativeId}`,
          label: domain?.name || `Domain #${domain?.nativeId}`,
        })),
        ['value'],
      ),

    [colonyDomains],
  );

  // const [
  //   loadTokenBalances,
  //   { data: tokenBalancesData },
  // ] = useTokenBalancesForDomainsLazyQuery();

  // useEffect(() => {
  //   if (tokenAddress) {
  //     loadTokenBalances({
  //       variables: {
  //         colonyAddress,
  //         tokenAddresses: [tokenAddress],
  //         domainIds: [domainId],
  //       },
  //     });
  //   }
  // }, [colonyAddress, tokenAddress, domainId, loadTokenBalances]);

  // const fromDomainTokenBalance = useMemo(() => {
  //   const token =
  //     tokenBalancesData.tokens.find(({ address }) => address === tokenAddress);
  //   if (token) {
  //     /*
  //      * Reset our custom error state, since we changed the domain
  //      */
  //     setCustomAmountError(undefined);
  //     return getBalanceFromToken(token, domainId);
  //   }
  //   return null;
  // }, [domainId, tokenAddress, tokenBalancesData]);

  // const { feeInverse: networkFeeInverse } = useNetworkContracts();
  // useEffect(() => {
  //   if (selectedToken && amount) {
  //     const decimals = getTokenDecimalsWithFallback(
  //       selectedToken.token.decimals,
  //     );
  //     const convertedAmount = BigNumber.from(
  //       moveDecimal(
  //         // networkFeeInverse
  //         //   ? calculateFee(amount, networkFeeInverse, decimals).totalToPay
  //         //   :
  //         amount,
  //         decimals,
  //       ),
  //     );

  //     if (
  //       fromDomainTokenBalance &&
  //       (fromDomainTokenBalance.lt(convertedAmount) ||
  //         fromDomainTokenBalance.isZero())
  //     ) {
  //       /*
  //        * @NOTE On custom, parallel, in-component error handling
  //        *
  //        * We need to keep track of a separate error state, since we are doing
  //        * custom validation (checking if a domain has enough funds), alongside
  //        * using a validationSchema.
  //        *
  //        * This makes it so that even if we manual set the error, it will get
  //        * overwritten instantly when the next Formik State update triggers, making
  //        * it basically impossible for us to manually put the Form into an error
  //        * state.
  //        *
  //        * See: https://github.com/formium/formik/issues/706
  //        *
  //        * Because of this, we keep our own error state that runs in parallel
  //        * to Formik's error state.
  //        */
  //       setCustomAmountError(MSG.noBalance);
  //     } else {
  //       setCustomAmountError(undefined);
  //     }
  //   }
  // }, [
  //   amount,
  //   domainId,
  //   fromDomainRoles,
  //   fromDomainTokenBalance,
  //   selectedToken,
  //   setCustomAmountError,
  //   networkFeeInverse,
  // ]);

  const userHasFundingPermission = userHasRole(
    fromDomainRoles,
    ColonyRole.Funding,
  );
  const userHasAdministrationPermission = userHasRole(
    fromDomainRoles,
    ColonyRole.Administration,
  );
  const hasRoles = userHasFundingPermission && userHasAdministrationPermission;
  const requiredRoles: ColonyRole[] = [
    ColonyRole.Funding,
    ColonyRole.Administration,
  ];

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony?.colonyAddress || '',
    hasRoles,
    false, // isVotingExtensionEnabled,
    values.forceAction,
    domainId,
  );

  // const cannotCreateMotion =
  //   votingExtensionVersion ===
  //     VotingReputationExtensionVersion.FuchsiaLightweightSpaceship &&
  //   !values.forceAction;

  const handleFromDomainChange = useCallback(
    (fromDomainValue) => {
      const fromDomainId = parseInt(fromDomainValue, 10);
      if (
        fromDomainId !== Id.RootDomain &&
        fromDomainId !== currentFromDomain
      ) {
        setCurrentFromDomain(fromDomainId);
      } else {
        setCurrentFromDomain(Id.RootDomain);
      }
      if (values.motionDomainId !== fromDomainId) {
        setValue('motionDomainId', fromDomainId);
      }
    },
    [currentFromDomain, setValue, values.motionDomainId],
  );

  // const handleFilterMotionDomains = useCallback(
  //   (optionDomain) => {
  //     const optionDomainId = parseInt(optionDomain.value, 10);
  //     if (currentFromDomain === Id.RootDomain) {
  //       return optionDomainId === Id.RootDomain;
  //     }
  //     return (
  //       optionDomainId === currentFromDomain ||
  //       optionDomainId === Id.RootDomain
  //     );
  //   },
  //   [currentFromDomain],
  // );

  // const handleMotionDomainChange = useCallback(
  //   (motionDomainId) => setFieldValue('motionDomainId', motionDomainId),
  //   [setFieldValue],
  // );

  const canMakePayment = userHasPermission; // && isOneTxPaymentExtensionEnabled;

  const inputDisabled = !canMakePayment || onlyForceAction || isSubmitting;

  const formattingOptions = useMemo(
    () => ({
      delimiter: ',',
      numeral: true,
      numeralDecimalScale: getTokenDecimalsWithFallback(
        selectedToken && selectedToken.decimals,
      ),
    }),
    [selectedToken],
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
           * create a payment from that subdomain
           */}
          {/* {isVotingExtensionEnabled && (
            <div className={styles.motionVoteDomain}>
              <MotionDomainSelect
                colony={colony}
                onDomainChange={handleMotionDomainChange}
                disabled={values.forceAction || isSubmitting}
                filterDomains={handleFilterMotionDomains}
                initialSelectedDomain={domainId}
              />
            </div>
          )} */}
          <div className={styles.headingContainer}>
            <Heading3
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
              text={MSG.title}
            />
            {/* {hasRoles && isVotingExtensionEnabled && (
              <ForceToggle disabled={!canMakePayment || isSubmitting} />
            )} */}
          </div>
        </div>
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={requiredRoles} />
        </DialogSection>
      )}
      <DialogSection>
        <div className={styles.domainSelects}>
          <div>
            <Select
              options={domainOptions}
              label={MSG.from}
              name="domainId"
              appearance={{ theme: 'grey', width: 'fluid' }}
              onChange={handleFromDomainChange}
              disabled={isSubmitting}
              dataTest="domainIdSelector"
              itemDataTest="domainIdItem"
            />
            {!!tokenAddress && (
              <div className={styles.domainPotBalance}>
                <FormattedMessage
                  {...MSG.domainTokenAmount}
                  values={{
                    amount: (
                      <Numeral
                        // appearance={{
                        //   size: 'small',
                        //   theme: 'grey',
                        // }}
                        value={0} // fromDomainTokenBalance || ...
                        decimals={getTokenDecimalsWithFallback(
                          selectedToken && selectedToken.decimals,
                        )}
                      />
                    ),
                    symbol: (selectedToken && selectedToken.symbol) || '???',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </DialogSection>
      <DialogSection>
        <div className={styles.singleUserContainer}>
          <SingleUserPicker
            appearance={{ width: 'wide' }}
            data={formattedData}
            label={MSG.to}
            name="recipient"
            filter={filterUserSelection}
            renderAvatar={renderAvatar}
            disabled={inputDisabled}
            placeholder={MSG.userPickerPlaceholder}
            dataTest="paymentRecipientPicker"
            itemDataTest="paymentRecipientItem"
            valueDataTest="paymentRecipientName"
          />
        </div>
        {/* {showWhitelistWarning && (
          <div className={styles.warningContainer}>
            <p className={styles.warningText}>
              <FormattedMessage
                {...MSG.warningText}
                values={{
                  span: (chunks) => (
                    <span className={styles.warningLabel}>{chunks}</span>
                  ),
                }}
              />
            </p>
          </div>
        )} */}
        {values.recipient &&
          isConfusing(
            values.recipient.profile.walletAddress ||
              values.recipient.profile?.displayName,
          ) && (
            <ConfusableWarning
              walletAddress={values.recipient.profile.walletAddress}
              colonyAddress={colony?.colonyAddress}
            />
          )}
      </DialogSection>
      <DialogSection>
        <div className={styles.tokenAmount}>
          <div className={styles.tokenAmountInputContainer}>
            <Input
              label={MSG.amount}
              name="amount"
              appearance={{
                theme: 'minimal',
                align: 'right',
              }}
              formattingOptions={formattingOptions}
              disabled={inputDisabled}
              dataTest="paymentAmountInput"
              valueAsNumber
            />
            {/* {networkFeeInverse &&
              customAmountError === undefined &&
              values.amount &&
              Number(values.amount) > 0 && (
                <div className={styles.networkFee}>
                  <FormattedMessage
                    {...MSG.fee}
                    values={{
                      fee: (
                        <Numeral
                          appearance={{
                            size: 'small',
                            theme: 'grey',
                          }}
                          value={
                            calculateFee(
                              values.amount,
                              networkFeeInverse,
                              getTokenDecimalsWithFallback(
                                selectedToken?.decimals,
                              ),
                            ).feesInWei
                          }
                          unit={getTokenDecimalsWithFallback(
                            selectedToken && selectedToken.decimals,
                          )}
                        />
                      ),
                      symbol: (selectedToken && selectedToken.symbol) || '???',
                    }}
                  />
                </div>
              )} */}
          </div>
          <div className={styles.tokenAmountContainer}>
            <div className={styles.tokenAmountSelect}>
              <TokenSymbolSelector
                label={MSG.token}
                tokens={colonyTokens}
                name="tokenAddress"
                elementOnly
                appearance={{ alignOptions: 'right', theme: 'grey' }}
                disabled={inputDisabled}
              />
            </div>
            {values.tokenAddress === AddressZero && (
              <div className={styles.tokenAmountUsd}>
                <EthUsd
                  // appearance={{ theme: 'grey' }}
                  value={amount}
                />
              </div>
            )}
          </div>
        </div>
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={inputDisabled}
          dataTest="paymentAnnotation"
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionFromMessage}>
            <FormattedMessage
              {...MSG.noPermissionFrom}
              values={{
                firstRoleRequired: (
                  <PermissionsLabel
                    permission={ColonyRole.Funding}
                    name={{ id: `role.${ColonyRole.Funding}` }}
                  />
                ),
                secondRoleRequired: (
                  <PermissionsLabel
                    permission={ColonyRole.Administration}
                    name={{ id: `role.${ColonyRole.Administration}` }}
                  />
                ),
              }}
            />
          </div>
        </DialogSection>
      )}
      {/* {userHasPermission && !isOneTxPaymentExtensionEnabled && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionFromMessage}>
            <FormattedMessage {...MSG.noOneTxExtension} />
          </div>
        </DialogSection>
      )} */}
      {/* {onlyForceAction && (
        <NotEnoughReputation
          appearance={{ marginTop: 'negative' }}
          domainId={domainId}
        />
      )} */}
      {/* {cannotCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionFromMessage}>
            <FormattedMessage
              {...MSG.cannotCreateMotion}
              values={{
                version:
                  VotingReputationExtensionVersion.FuchsiaLightweightSpaceship,
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
          /*
           * Disable Form submissions if either the form is invalid, or
           * if our custom state was triggered.
           */
          disabled={
            // cannotCreateMotion ||
            !isValid || !!customAmountError || inputDisabled
          }
          style={{ minWidth: styles.wideButton }}
          data-test="paymentConfirmButton"
        />
      </DialogSection>
    </>
  );
};

CreatePaymentDialogForm.displayName = displayName;

export default CreatePaymentDialogForm;
