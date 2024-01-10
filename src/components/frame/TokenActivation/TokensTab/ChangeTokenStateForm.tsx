import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import React, { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { number, object, InferType } from 'yup';

import { useUserTokenBalanceContext } from '~context';
import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import Button from '~shared/Button';
import { ActionForm, Input } from '~shared/Fields';
import Numeral from '~shared/Numeral';
import { Tooltip } from '~shared/Popover';
import { UserTokenBalanceData } from '~types';
import { pipe, mapPayload } from '~utils/actions';
import { toFinite } from '~utils/lodash';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './TokensTab.css';

const displayName = 'frame.TokenActivation.TokensTab.ChangeTokenStateForm';

const MSG = defineMessages({
  tokenActivation: {
    id: `${displayName}.tokenActivation`,
    defaultMessage: 'Token activation',
  },
  activate: {
    id: `${displayName}.activate`,
    defaultMessage: 'Activate',
  },
  deactivate: {
    id: `${displayName}.deactivate`,
    defaultMessage: 'Deactivate',
  },
  balance: {
    id: `${displayName}.balance`,
    defaultMessage: 'balance: {tokenBalance}',
  },
  locked: {
    id: `${displayName}.locked`,
    defaultMessage: 'Locked: {lockedTokens}',
  },
  lockedTooltip: {
    id: `${displayName}.lockedTooltip`,
    defaultMessage: `You have unclaimed transactions which must be claimed
    before these tokens can be withdrawn.`,
  },
  max: {
    id: `${displayName}.max`,
    defaultMessage: 'Max',
  },
});

/** @TODO Add validation against amount higher than the balance */
const validationSchema = object({
  amount: number()
    .transform((value) => toFinite(value))
    .required()
    .moreThan(0),
}).defined();

type FormValues = InferType<typeof validationSchema>;

export interface ChangeTokenStateFormProps {
  tokenBalanceData: UserTokenBalanceData;
  hasLockedTokens: boolean;
}

const ChangeTokenStateForm = ({
  tokenBalanceData: { inactiveBalance, activeBalance, lockedBalance },
  hasLockedTokens,
}: ChangeTokenStateFormProps) => {
  const {
    colony: { nativeToken, colonyAddress },
  } = useColonyContext();
  const { pollActiveTokenBalance } = useUserTokenBalanceContext();

  const [isActivate, setIsActive] = useState(true);

  const tokenDecimals = getTokenDecimalsWithFallback(nativeToken.decimals);
  const tokenBalance = isActivate ? inactiveBalance : activeBalance;
  const tokenBalanceInEthers = moveDecimal(tokenBalance, -tokenDecimals);

  const actionType = isActivate
    ? ActionTypes.USER_DEPOSIT_TOKEN
    : ActionTypes.USER_WITHDRAW_TOKEN;

  const transform = pipe(
    mapPayload(({ amount }) => {
      // Convert amount string with decimals to BigInt (eth to wei)
      const formattedAmount = BigNumber.from(
        moveDecimal(amount, nativeToken.decimals),
      );

      return {
        amount: formattedAmount,
        colonyAddress,
        tokenAddress: nativeToken.tokenAddress,
      };
    }),
  );

  return (
    <div className={styles.changeTokensState}>
      <div className={styles.changeStateTitle}>
        <FormattedMessage {...MSG.tokenActivation} />
      </div>
      <div className={styles.changeStateButtonsContainer}>
        <div className={isActivate ? styles.activate : styles.activateInactive}>
          <Button
            appearance={{ theme: isActivate ? 'primary' : 'white' }}
            onClick={() => setIsActive(true)}
            text={MSG.activate}
          />
        </div>
        <div className={isActivate ? styles.withdrawInactive : styles.withdraw}>
          <Button
            appearance={{ theme: !isActivate ? 'primary' : 'white' }}
            onClick={() => setIsActive(false)}
            text={MSG.deactivate}
            dataTest="deactivateTokensToggle"
          />
        </div>
      </div>
      <ActionForm<FormValues>
        defaultValues={{ amount: 0 }}
        actionType={actionType}
        validationSchema={validationSchema}
        transform={transform}
        onSuccess={(_, { reset }) => {
          pollActiveTokenBalance();
          reset();
        }}
      >
        {({ formState: { isValid } }) => (
          <div className={styles.form}>
            <div className={styles.inputField}>
              <Input
                name="amount"
                appearance={{
                  theme: 'minimal',
                  align: 'right',
                }}
                elementOnly
                formattingOptions={{
                  delimiter: ',',
                  numeral: true,
                  numeralDecimalScale: nativeToken.decimals,
                }}
                maxButtonParams={{
                  maxAmount: tokenBalanceInEthers,
                  options: {
                    shouldTouch: true,
                    shouldValidate: true,
                    shouldDirty: true,
                  },
                }}
                dataTest="activateTokensInput"
              />
            </div>
            {!hasLockedTokens || isActivate ? (
              <div
                className={
                  isActivate
                    ? styles.balanceInfoActivate
                    : styles.balanceInfoWithdraw
                }
              >
                <FormattedMessage
                  {...MSG.balance}
                  values={{
                    tokenBalance: (
                      <Numeral
                        value={tokenBalance ?? 0}
                        decimals={tokenDecimals}
                        suffix={nativeToken.symbol}
                        className={styles.balanceAmount}
                      />
                    ),
                  }}
                />
              </div>
            ) : (
              <Tooltip
                placement="right"
                content={<FormattedMessage {...MSG.lockedTooltip} />}
              >
                <div
                  className={
                    hasLockedTokens
                      ? styles.balanceInfoWithdrawLocked
                      : styles.balanceInfoWithdraw
                  }
                >
                  <FormattedMessage
                    {...(hasLockedTokens ? MSG.locked : MSG.balance)}
                    values={{
                      lockedTokens: (
                        <Numeral
                          value={lockedBalance ?? 0}
                          decimals={tokenDecimals}
                          suffix={nativeToken.symbol}
                          className={styles.balanceAmount}
                        />
                      ),
                    }}
                  />
                </div>
              </Tooltip>
            )}
            <Button
              text={{ id: 'button.confirm' }}
              type="submit"
              disabled={!isValid}
              dataTest="tokenActivationConfirm"
            />
          </div>
        )}
      </ActionForm>
    </div>
  );
};

export default ChangeTokenStateForm;
