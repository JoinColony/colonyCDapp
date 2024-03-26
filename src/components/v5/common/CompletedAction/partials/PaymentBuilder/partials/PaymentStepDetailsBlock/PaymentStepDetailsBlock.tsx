import { ArrowsClockwise } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/index.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/index.ts';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';
import StatusText from '~v5/shared/StatusText/index.ts';

import PaymentOverview from './partials/PaymentOverview/index.ts';

// @todo: replace mock data with real data
const PaymentStepDetailsBlock: FC = () => {
  const allPaid = false;

  return allPaid ? (
    <PaymentOverview
      className="rounded-lg border border-gray-200 bg-base-white px-[1.125rem] pb-3.5 pt-[1.125rem]"
      total={[
        {
          amount: '500000000000000000000',
          tokenAddress: '0x90B0A9A9Fe382423aEECBb22e5c1CaEBaeF1Af4C',
          isClaimed: true,
        },
        {
          amount: '90000000000000000000',
          tokenAddress: '0x90B0A9A9Fe382423aEECBb22e5c1CaEBaeF1Af4C',
          isClaimed: true,
        },
      ]}
      paid={[
        {
          amount: '500000000000000000000',
          tokenAddress: '0x90B0A9A9Fe382423aEECBb22e5c1CaEBaeF1Af4C',
          isClaimed: true,
        },
        {
          amount: '90000000000000000000',
          tokenAddress: '0x90B0A9A9Fe382423aEECBb22e5c1CaEBaeF1Af4C',
          isClaimed: true,
        },
      ]}
      payable={[
        {
          amount: '500000000000000000000',
          tokenAddress: '0x90B0A9A9Fe382423aEECBb22e5c1CaEBaeF1Af4C',
          isClaimed: true,
        },
        {
          amount: '90000000000000000000',
          tokenAddress: '0x90B0A9A9Fe382423aEECBb22e5c1CaEBaeF1Af4C',
          isClaimed: true,
        },
      ]}
    />
  ) : (
    <MenuWithStatusText
      statusTextSectionProps={{
        status: StatusTypes.Info,
        children: formatText({ id: 'expenditure.paymentStage.info' }),
        textClassName: 'text-4 text-gray-900',
        iconAlignment: 'top',
        iconClassName: 'text-gray-500',
        iconSize: 16,
        content: (
          <StatusText
            icon={ArrowsClockwise}
            iconAlignment="top"
            iconSize={16}
            status={StatusTypes.Info}
            textClassName="text-4 text-gray-900"
            className="mt-2"
            iconClassName="text-gray-500"
          >
            {formatText(
              { id: 'expenditure.paymentStage.info.nextClaim' },
              {
                // @todo: update counter value
                counter: 'counter',
              },
            )}
          </StatusText>
        ),
      }}
      sections={[
        {
          key: 'test',
          className: '!p-[1.125rem]',
          content: (
            <div>
              <PaymentOverview
                total={[
                  {
                    amount: '500000000000000000000',
                    tokenAddress: '0x90B0A9A9Fe382423aEECBb22e5c1CaEBaeF1Af4C',
                    isClaimed: false,
                  },
                  {
                    amount: '90000000000000000000',
                    tokenAddress: '0x90B0A9A9Fe382423aEECBb22e5c1CaEBaeF1Af4C',
                    isClaimed: false,
                  },
                ]}
                paid={[
                  {
                    amount: '50000000000000000000',
                    tokenAddress: '0x90B0A9A9Fe382423aEECBb22e5c1CaEBaeF1Af4C',
                    isClaimed: false,
                  },
                  {
                    amount: '00000000000000000000',
                    tokenAddress: '0x90B0A9A9Fe382423aEECBb22e5c1CaEBaeF1Af4C',
                    isClaimed: false,
                  },
                ]}
                payable={[
                  {
                    amount: '00000000000000000000',
                    tokenAddress: '0x90B0A9A9Fe382423aEECBb22e5c1CaEBaeF1Af4C',
                    isClaimed: false,
                  },
                  {
                    amount: '10000000000000000000',
                    tokenAddress: '0x90B0A9A9Fe382423aEECBb22e5c1CaEBaeF1Af4C',
                    isClaimed: false,
                  },
                ]}
              />
              <Button
                className="mt-4 w-full"
                // @todo: add onClick handler
                // eslint-disable-next-line no-console
                onClick={() => console.log('make payment')}
              >
                {formatText({ id: 'expenditure.paymentStage.button' })}
              </Button>
            </div>
          ),
        },
      ]}
    />
  );
};

export default PaymentStepDetailsBlock;
