import React, { useMemo, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import {
  ColonyRole,
  Id,
  // VotingReputationVersion,
} from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';
import { FormState, UseFormSetError, UseFormTrigger } from 'react-hook-form';

import Button from '~shared/Button';
import DialogSection from '~shared/Dialog/DialogSection';
import {
  Select,
  HookFormInput as Input,
  Annotations,
  TokenSymbolSelector,
  SelectOption,
} from '~shared/Fields';
import { Heading3 } from '~shared/Heading';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import PermissionsLabel from '~shared/PermissionsLabel';
// import {
//   useTokenBalancesForDomainsLazyQuery,
// } from '~data/index';
import { ActionDialogProps } from '~shared/Dialog';
import EthUsd from '~shared/EthUsd';
import Numeral from '~shared/Numeral';
import Icon from '~shared/Icon';
// import ForceToggle from '~shared/Fields/ForceToggle';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import {
  // getBalanceFromToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import {
  useAppContext,
  useDialogActionPermissions,
  useTransformer,
} from '~hooks'; // useEnabledExtensions
import { getUserRolesForDomain } from '~redux/transformers';
import { userHasRole } from '~utils/checks';
import { notNull } from '~utils/arrays';

import { FormValues } from './TransferFundsDialog';

import styles from './TransferFundsDialogForm.css';

// import MotionDomainSelect from '~dashboard/MotionDomainSelect';

const displayName =
  'common.ColonyHome.TransferFundsDialog.TransferFundsDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Transfer Funds',
  },
  from: {
    id: `${displayName}.from`,
    defaultMessage: 'From',
  },
  to: {
    id: `${displayName}.to`,
    defaultMessage: 'To',
  },
  amount: {
    id: `${displayName}.amount`,
    defaultMessage: 'Amount',
  },
  token: {
    id: `${displayName}.address`,
    defaultMessage: 'Token',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: 'Explain why you’re transferring these funds (optional)',
  },
  domainTokenAmount: {
    id: `${displayName}.domainTokenAmount`,
    defaultMessage: 'Available: {amount} {symbol}',
  },
  noAmount: {
    id: `${displayName}.noAmount`,
    defaultMessage: 'Amount must be greater than zero',
  },
  noBalance: {
    id: `${displayName}.noBalance`,
    defaultMessage: 'Insufficient balance in from team pot',
  },
  noPermissionFrom: {
    id: `${displayName}.noPermissionFrom`,
    defaultMessage: `You need the {permissionLabel} permission in {domainName}
      to take this action`,
  },
  samePot: {
    id: `${displayName}.samePot`,
    defaultMessage: 'Cannot move to same team pot',
  },
  transferIconTitle: {
    id: `${displayName}.transferIconTitle`,
    defaultMessage: 'Transfer',
  },
  cannotCreateMotion: {
    id: `${displayName}.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

interface Props extends ActionDialogProps {
  domainOptions: SelectOption[];
  values: FormValues;
  triggerValidation: UseFormTrigger<FormValues>;
  setError: UseFormSetError<FormValues>;
}

const TransferFundsDialogForm = ({
  back,
  colony,
  colony: { colonyAddress, domains, tokens },
  domainOptions,
  isSubmitting,
  isValid,
  setError,
  values,
  triggerValidation,
  errors,
}: Props & FormState<FormValues>) => {
  const { wallet } = useAppContext();
  const { tokenAddress, amount } = values;

  // const {
  //   isVotingExtensionEnabled,
  //   votingExtensionVersion,
  // } = useEnabledExtensions({
  //   colonyAddress: colony.colonyAddress,
  // });

  const fromDomainId = values.fromDomain ? values.fromDomain : Id.RootDomain;
  const colonyDomains = useMemo(() => domains?.items || [], [domains]);
  const fromDomain = colonyDomains.find(
    (domain) => domain?.nativeId === fromDomainId,
  );
  const toDomainId = values.toDomain ? values.toDomain : undefined;
  const toDomain = colonyDomains.find(
    (domain) => domain?.nativeId === toDomainId,
  );
  const colonyTokens = useMemo(
    () =>
      tokens?.items.filter(notNull).map((colonyToken) => colonyToken.token) ||
      [],
    [tokens],
  );
  const selectedToken = useMemo(
    () =>
      colonyTokens.find((token) => token.tokenAddress === values.tokenAddress),
    [colonyTokens, values.tokenAddress],
  );

  const fromDomainRoles = useTransformer(getUserRolesForDomain, [
    colony,
    wallet?.address,
    fromDomainId,
  ]);

  const toDomainRoles = useTransformer(getUserRolesForDomain, [
    colony,
    wallet?.address,
    toDomainId,
  ]);
  const hasRoleInFromDomain = userHasRole(fromDomainRoles, ColonyRole.Funding);
  const hasRoleInToDomain = userHasRole(toDomainRoles, ColonyRole.Funding);
  const canTransferFunds = hasRoleInFromDomain && hasRoleInToDomain;

  const requiredRoles: ColonyRole[] = [ColonyRole.Funding];

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colonyAddress,
    canTransferFunds,
    false, // isVotingExtensionEnabled,
    values.forceAction,
  );

  const inputDisabled = !userHasPermission || onlyForceAction || isSubmitting;

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
  //         domainIds: [fromDomainId, toDomainId || Id.RootDomain],
  //       },
  //     });
  //   }
  // }, [
  //   colonyAddress,
  //   tokenAddress,
  //   fromDomainId,
  //   toDomainId,
  //   loadTokenBalances,
  // ]);

  // const fromDomainTokenBalance = useMemo(() => {
  //   const token =
  //     tokenBalancesData &&
  //     tokenBalancesData.tokens.find(({ address }) => address === tokenAddress);
  //   return // (token, fromDomainId);
  // }, [fromDomainId, tokenAddress, tokenBalancesData]);

  // const toDomainTokenBalance = useMemo(() => {
  //   if (toDomainId) {
  //     const token =
  //       tokenBalancesData &&
  //       tokenBalancesData.tokens.find(
  //         ({ address }) => address === tokenAddress,
  //       );
  //     return // (token, toDomainId);
  //   }
  //   return undefined;
  // }, [toDomainId, tokenAddress, tokenBalancesData]);

  // Perform form validations
  useEffect(() => {
    const customValidationErrors: {
      amount?: any;
      toDomain?: any;
    } = {
      ...errors,
    };

    if (
      !selectedToken ||
      !amount // || !fromDomainTokenBalance
    ) {
      // silent error
      return setError('amount', { message: '' });
    }

    const convertedAmount = BigNumber.from(
      moveDecimal(amount, getTokenDecimalsWithFallback(selectedToken.decimals)),
    );

    if (convertedAmount.isZero()) {
      customValidationErrors.amount = MSG.noAmount;
    }

    // if (fromDomainTokenBalance.lt(convertedAmount)) {
    //   customValidationErrors.amount = MSG.noBalance;
    // }

    if (toDomainId !== undefined && toDomainId === fromDomainId) {
      customValidationErrors.toDomain = MSG.samePot;
    }

    return Object.entries(customValidationErrors).forEach((error) =>
      setError(error[0], error[1]),
    );
  }, [
    errors,
    amount,
    fromDomainId,
    // fromDomainTokenBalance,
    selectedToken,
    setError,
    toDomainId,
  ]);

  // const cannotCreateMotion =
  //   votingExtensionVersion ===
  //     VotingReputationVersion.FuchsiaLightweightSpaceship &&
  //   !values.forceAction;

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
  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.modalHeading}>
          {/*
           * @NOTE Always disabled since you can only create this motion in root
           */}
          {/* {isVotingExtensionEnabled && (
            <div className={styles.motionVoteDomain}>
              <MotionDomainSelect
                colony={colony}
                disabled
              />
            </div>
          )} */}
          <div className={styles.headingContainer}>
            <Heading3
              appearance={{ margin: 'none', theme: 'dark' }}
              text={MSG.title}
            />
            {/* {canTransferFunds && isVotingExtensionEnabled && (
              <ForceToggle disabled={isSubmitting} />
            )} */}
          </div>
        </div>
      </DialogSection>
      {!userHasPermission && (
        <div className={styles.permissionsRequired}>
          <DialogSection>
            <PermissionRequiredInfo requiredRoles={requiredRoles} />
          </DialogSection>
        </div>
      )}
      <DialogSection>
        <div className={styles.domainSelects}>
          <div>
            <Select
              options={domainOptions}
              label={MSG.from}
              name="fromDomain"
              appearance={{ theme: 'grey' }}
              onChange={() => triggerValidation()}
              disabled={onlyForceAction || isSubmitting}
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
                        value={0} // fromDomainTokenBalance ||
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
          <Icon
            className={styles.transferIcon}
            name="circle-arrow-back"
            title={MSG.transferIconTitle}
            appearance={{ size: 'medium' }}
          />
          <div>
            <Select
              options={domainOptions}
              label={MSG.to}
              name="toDomain"
              appearance={{ theme: 'grey' }}
              onChange={() => triggerValidation()}
              disabled={onlyForceAction || isSubmitting}
              dataTest="domainIdSelector"
              itemDataTest="domainIdItem"
            />
            {!!tokenAddress &&
              !errors?.toDomain && ( // && toDomainTokenBalance
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
                          value={0} // toDomainTokenBalance ||
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
        <div className={styles.tokenAmount}>
          <div className={styles.amountContainer}>
            <Input
              label={MSG.amount}
              name="amount"
              appearance={{
                theme: 'minimal',
                align: 'right',
              }}
              formattingOptions={formattingOptions}
              disabled={inputDisabled}
              onChange={() => triggerValidation()}
              dataTest="transferAmountInput"
              valueAsNumber
            />
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
                  value={
                    /*
                     * @NOTE Set value to 0 if amount is only the decimal point
                     * Just entering the decimal point will pass it through to EthUsd
                     * and that will try to fetch the balance for, which, obviously, will fail
                     */
                    values.amount ? values.amount : '0'
                  }
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
          dataTest="transferFundsAnnotation"
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <span className={styles.permissionsError}>
            <FormattedMessage
              {...MSG.noPermissionFrom}
              values={{
                permissionLabel: (
                  <PermissionsLabel
                    permission={ColonyRole.Funding}
                    name={{ id: `role.${ColonyRole.Funding}` }}
                  />
                ),
                domainName:
                  (!hasRoleInFromDomain && fromDomain?.name) ||
                  (!hasRoleInToDomain && toDomain?.name),
              }}
            />
          </span>
        </DialogSection>
      )}
      {/* {onlyForceAction && (
        <NotEnoughReputation appearance={{ marginTop: 'negative' }} />
      )} */}
      {/* {cannotCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.cannotCreateMotion}>
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
        {back && (
          <Button
            appearance={{ theme: 'secondary', size: 'large' }}
            onClick={back}
            text={{ id: 'button.back' }}
          />
        )}
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
          data-test="transferFundsConfirmButton"
        />
      </DialogSection>
    </>
  );
};

TransferFundsDialogForm.displayName = displayName;

export default TransferFundsDialogForm;
