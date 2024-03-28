import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useMemo, type FC } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useToggle from '~hooks/useToggle/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import TokenIcon from '~shared/TokenIcon/index.ts';
import { type ExpenditurePayout } from '~types/graphql.ts';
import { sortPayouts } from '~utils/sortPayouts.ts';
import { getSelectedToken } from '~utils/tokens.ts';

import { type PaymentBuilderPayoutsTotalProps } from './types.ts';

const PaymentBuilderTokensTotal: FC<PaymentBuilderPayoutsTotalProps> = ({
  payouts,
}) => {
  const { colony } = useColonyContext();
  const [isExpanded, { toggle }] = useToggle();
  const sortedPayouts = useMemo(() => sortPayouts(payouts), [payouts]) || [];

  const getItem = (token: ExpenditurePayout) => {
    const tokenData = getSelectedToken(colony, token.tokenAddress);

    return tokenData ? (
      <div className="flex items-center gap-3 text-gray-900 text-1">
        <Numeral value={token.amount} decimals={tokenData?.decimals} />
        <div className="flex items-center gap-1">
          <TokenIcon
            token={tokenData}
            size="xxs"
            className="flex-shrink-0 text-gray-900"
          />
          <span>{tokenData?.symbol}</span>
        </div>
      </div>
    ) : null;
  };

  if (!sortedPayouts.length) {
    return null;
  }

  return (
    <div className="w-full">
      {sortedPayouts.length > 1 ? (
        <>
          <button
            type="button"
            className="flex w-full items-center gap-2 py-[.3125rem]"
            onClick={toggle}
          >
            {getItem(sortedPayouts[0])}
            <CaretDown
              size={12}
              className={clsx('flex-shrink-0 transition', {
                'rotate-180': isExpanded,
              })}
            />
          </button>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                variants={accordionAnimation}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="overflow-hidden"
              >
                <ul>
                  {sortedPayouts.slice(1).map((token) => (
                    <li
                      key={token.tokenAddress}
                      className="w-full py-[.3125rem]"
                    >
                      {getItem(token)}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div className="w-full py-[.3125rem]">{getItem(sortedPayouts[0])}</div>
      )}
    </div>
  );
};

export default PaymentBuilderTokensTotal;
