import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Decimal from 'decimal.js';
import { useFormContext } from 'react-hook-form';

import { HookFormInput as Input } from '~shared/Fields';
import Numeral from '~shared/Numeral';
import { Colony } from '~types';

import { useUserReputation } from '~hooks';
import { getFormattedTokenValue } from '~utils/tokens';
import { calculatePercentageReputation } from '~utils/reputation';

import styles from './ReputationAmountInput.css';

const displayName = 'common.ManageReputationContainer.ManageReputationDialogForm.ReputationAmountInput';

const MSG = defineMessages({
  amount: {
    id: `${displayName}.amount`,
    defaultMessage: `Amount of reputation points to {isSmiteAction, select,
      true {deduct}
      other {award}
    }`,
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
});

interface Props {
  colony: Colony;
  nativeTokenDecimals: number;
  disabled: boolean;
  isSmiteAction?: boolean;
}

const formattingOptions = {
  numeral: true,
  tailPrefix: true,
  numeralDecimalScale: 10,
  numeralPositiveOnly: true,
};

const ReputationAmountInput = ({
  colony: { colonyAddress },
  nativeTokenDecimals,
  isSmiteAction = false,
  disabled,
}: Props) => {
  const { watch } = useFormContext();
  const { user, domainId } = watch();
  const { userReputation, totalReputation } = useUserReputation(colonyAddress, user?.walletAddress, Number(domainId));

  const userPercentageReputation = calculatePercentageReputation(userReputation, totalReputation);
  const unformattedUserReputationAmount = new Decimal(userReputation || 0).div(
    new Decimal(10).pow(nativeTokenDecimals),
  );
  const formattedUserReputationAmount = getFormattedTokenValue(userReputation || 0, nativeTokenDecimals);

  return (
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
                  maxAmount: unformattedUserReputationAmount.toString(),
                  options: {
                    shouldValidate: true,
                    shouldTouch: true,
                    shouldDirty: true,
                  },
                }
              : undefined
          }
          disabled={disabled}
          dataTest="reputationAmountInput"
        />
        <div className={styles.percentageSign}>pts</div>
      </div>
      <p className={styles.inputText}>
        <FormattedMessage
          {...MSG.maxReputation}
          values={{
            isSmiteAction,
            userReputationAmount: <Numeral value={formattedUserReputationAmount} />,
            userPercentageReputation: userPercentageReputation === null ? 0 : userPercentageReputation,
          }}
        />
      </p>
    </div>
  );
};

ReputationAmountInput.displayName = displayName;

export default ReputationAmountInput;
