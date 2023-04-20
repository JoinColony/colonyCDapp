import React from 'react';
import { MessageDescriptor } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import { HookFormSelect as Select } from '~shared/Fields';
import { Colony } from '~types';

import { notNull } from '~utils/arrays';
import { getDomainOptions } from '~utils/domains';

import DomainBalance from './DomainBalance';

const displayName = 'DomainFundSelectorSection.DomainFundSelector';

interface Props {
  colony: Colony;
  name: string;
  label: MessageDescriptor | string;
  onChange?: (val: any) => void;
  disabled?: boolean;
}

const DomainFundSelector = ({ colony, disabled, name, label, onChange }: Props) => {
  const {
    formState: { isSubmitting, errors },
  } = useFormContext();

  const colonyDomains = colony?.domains?.items.filter(notNull) || [];
  const domainOptions = getDomainOptions(colonyDomains);

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
    <div>
      <Select
        options={domainOptions}
        label={label}
        name={name}
        appearance={{ theme: 'grey', width: 'fluid' }}
        onChange={onChange}
        disabled={disabled || isSubmitting}
        dataTest="domainIdSelector"
        itemDataTest="domainIdItem"
      />
      {!errors[name] && <DomainBalance colony={colony} />}
    </div>
  );
};

DomainFundSelector.displayName = displayName;

export default DomainFundSelector;
