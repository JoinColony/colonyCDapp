import React, { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { defineMessages, useIntl } from 'react-intl';

import Numeral, { Props as NumeralProps } from '~shared/Numeral/Numeral';
import { SpinnerLoader } from '~shared/Preloaders';
import { getEthToUsd } from '~utils/external';
import { DEFAULT_NETWORK, DEFAULT_TOKEN_DECIMALS } from '~constants';
import { Network } from '~types';

const displayName = 'EthUsd';

const MSG = defineMessages({
  usdAbbreviation: {
    id: `${displayName}.usdAbbreviation`,
    defaultMessage: 'USD',
  },
});

interface Props extends NumeralProps {
  /** Should the prefix be visible? */
  showPrefix?: boolean;

  /** Should the suffix be visible? */
  showSuffix?: boolean;

  /** Ether unit the number is notated in (e.g. 'ether' = 10^18 wei) */
  unit?: string;

  /** Value in ether to convert to USD */
  value: number | string | BigNumber;
}

const EthUsd = ({
  showPrefix = true,
  showSuffix = true,
  unit = 'ether',
  value,
  ...rest
}: Props) => {
  const [valueUsd, setValueUsd] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { formatMessage } = useIntl();

  const suffixText = formatMessage(MSG.usdAbbreviation);

  useEffect(() => {
    let didCancel = false;

    setIsLoading(true);

    const convertEthToUsd = async () => {
      let valueToConvert;
      if (BigNumber.isBigNumber(value)) {
        valueToConvert = value;
      } else {
        const fixedNum =
          typeof value === 'number'
            ? value.toFixed(DEFAULT_TOKEN_DECIMALS)
            : value;
        valueToConvert = parseUnits(fixedNum, unit);
      }
      const newValue = await getEthToUsd(valueToConvert);
      if (!didCancel) {
        setValueUsd(newValue || undefined);
        setIsLoading(false);
      }
    };

    convertEthToUsd();

    return () => {
      didCancel = true;
    };
  }, [unit, value]);

  if (DEFAULT_NETWORK === Network.Goerli) {
    return null;
  }

  if (isLoading) {
    return <SpinnerLoader />;
  }

  return (
    <Numeral
      prefix={showPrefix && valueUsd ? '~ ' : ''}
      suffix={showSuffix ? ` ${suffixText}` : ''}
      value={valueUsd || '-'}
      {...rest}
    />
  );
};

EthUsd.displayName = displayName;

export default EthUsd;
