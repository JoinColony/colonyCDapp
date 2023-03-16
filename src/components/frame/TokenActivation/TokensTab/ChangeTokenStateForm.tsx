import React, { useCallback, useMemo, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { number, object, InferType } from 'yup';
import Decimal from 'decimal.js';
import toFinite from 'lodash/toFinite';

import Button from '~shared/Button';
import {
  ActionHookForm as ActionForm,
  HookFormInput as Input,
} from '~shared/Fields';
import Numeral from '~shared/Numeral';
import { Tooltip } from '~shared/Popover';

import { ActionTypes } from '~redux';
import { pipe, mapPayload } from '~utils/actions';
import { getFormattedTokenValue } from '~utils/tokens';
import { useAppContext } from '~hooks';
import { Address, Token } from '~types';

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

const validationSchema = object({
  amount: number()
    .transform((value) => toFinite(value))
    .required()
    .moreThan(0),
}).defined();

type FormValues = InferType<typeof validationSchema>;

export interface ChangeTokenStateFormProps {
  token: Token;
  tokenDecimals: number;
  activeTokens: BigNumber;
  inactiveTokens: BigNumber;
  lockedTokens: BigNumber;
  hasLockedTokens: boolean;
  colonyAddress: Address;
}

const ChangeTokenStateForm = ({
  token,
  tokenDecimals,
  activeTokens,
  inactiveTokens,
  lockedTokens,
  hasLockedTokens,
  colonyAddress,
}: ChangeTokenStateFormProps) => {
  const [isActivate, setIsActive] = useState(true);

  const { wallet } = useAppContext();

  const formattedActiveTokens = getFormattedTokenValue(
    activeTokens,
    token.decimals,
  );
  const formattedInactiveTokens = getFormattedTokenValue(
    inactiveTokens,
    token.decimals,
  );
  const formattedLockedTokens = getFormattedTokenValue(
    lockedTokens,
    token.decimals,
  );
  const unformattedTokenBalance = moveDecimal(
    isActivate ? inactiveTokens : activeTokens,
    -tokenDecimals,
  );

  const tokenBalance = useMemo(
    () => (isActivate ? formattedInactiveTokens : formattedActiveTokens),
    [isActivate, formattedActiveTokens, formattedInactiveTokens],
  );

  const formAction = useCallback(
    (actionType: '' | '_ERROR' | '_SUCCESS') =>
      isActivate
        ? ActionTypes[`USER_DEPOSIT_TOKEN${actionType}`]
        : ActionTypes[`USER_WITHDRAW_TOKEN${actionType}`],
    [isActivate],
  );

  const transform = pipe(
    mapPayload(({ amount }) => {
      // Convert amount string with decimals to BigInt (eth to wei)
      const formattedAmount = BigNumber.from(
        moveDecimal(amount, tokenDecimals),
      );

      return {
        amount: formattedAmount,
        userAddress: wallet?.address,
        colonyAddress,
        tokenAddress: token.tokenAddress,
      };
    }),
  );

  const handleSubmitSuccess = useCallback((res, values, { reset }) => {
    reset();
  }, []);

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
        validationSchema={validationSchema}
        transform={transform}
        submit={formAction('')}
        error={formAction('_ERROR')}
        success={formAction('_SUCCESS')}
        onSuccess={handleSubmitSuccess}
      >
        {({ formState: { isValid }, getValues }) => (
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
                  numeralDecimalScale: tokenDecimals,
                }}
                maxButtonParams={{
                  maxAmount: unformattedTokenBalance,
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
                        value={tokenBalance}
                        suffix={token?.symbol}
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
                          value={formattedLockedTokens}
                          suffix={token?.symbol}
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
              disabled={
                !isValid ||
                getValues().amount === 0 ||
                new Decimal(unformattedTokenBalance).lt(
                  /* a bit hacky way of doing the check but nothing else seems to be working */
                  getValues().amount.toString() === '.'
                    ? 0
                    : getValues().amount || 0,
                )
              }
              dataTest="tokenActivationConfirm"
            />
          </div>
        )}
      </ActionForm>
    </div>
  );
};

export default ChangeTokenStateForm;
