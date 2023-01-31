import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import Numeral from '~shared/Numeral';
import { Select } from '~shared/Fields';
import { useColonyContext } from '~hooks';

import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { notNull } from '~utils/arrays';
import { sortBy } from '~utils/lodash';

import styles from './DomainFundSelector.css';

const displayName =
  'common.CreatePaymentDialog.CreatePaymentDialogForm.DomainFundSelector';

const MSG = defineMessages({
  from: {
    id: `${displayName}.from`,
    defaultMessage: 'From',
  },
  domainTokenAmount: {
    id: `${displayName}.domainTokenAmount`,
    defaultMessage: 'Available Funds: {amount} {symbol}',
  },
  noBalance: {
    id: `${displayName}.noBalance`,
    defaultMessage: 'Insufficient balance in from domain pot',
  },
});

interface Props {
  filteredDomainId?: number;
}

const DomainFundSelector = ({ filteredDomainId }: Props) => {
  const {
    getValues,
    setValue,
    formState: { isSubmitting },
  } = useFormContext();
  const { colony } = useColonyContext();
  const values = getValues();
  const selectedDomain =
    filteredDomainId === 0 || filteredDomainId === undefined
      ? Id.RootDomain
      : filteredDomainId;

  const domainId = values.domainId
    ? parseInt(values.domainId, 10)
    : selectedDomain;

  const [currentFromDomain, setCurrentFromDomain] = useState<number>(domainId);
  const { tokenAddress } = values;
  const colonyTokens =
    colony?.tokens?.items
      .filter(notNull)
      .map((colonyToken) => colonyToken.token) || [];
  const selectedToken = colonyTokens.find(
    (token) => token?.tokenAddress === values.tokenAddress,
  );

  const colonyDomains = colony?.domains?.items || [];
  const domainOptions = sortBy(
    colonyDomains.map((domain) => ({
      value: `${domain?.nativeId}`,
      label: domain?.name || `Domain #${domain?.nativeId}`,
    })),
    ['value'],
  );

  const handleFromDomainChange = (fromDomainValue) => {
    const fromDomainId = parseInt(fromDomainValue, 10);
    if (fromDomainId !== Id.RootDomain && fromDomainId !== currentFromDomain) {
      setCurrentFromDomain(fromDomainId);
    } else {
      setCurrentFromDomain(Id.RootDomain);
    }
    if (values.motionDomainId !== fromDomainId) {
      setValue('motionDomainId', fromDomainId);
    }
  };

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

  return (
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
  );
};

DomainFundSelector.displayName = displayName;

export default DomainFundSelector;
