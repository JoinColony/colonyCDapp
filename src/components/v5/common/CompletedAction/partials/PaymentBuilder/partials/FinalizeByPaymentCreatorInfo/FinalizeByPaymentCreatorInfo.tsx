import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/index.ts';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import { type FinalizeByPaymentCreatorInfoProps } from './types.ts';

const displayName =
  'v5.common.CompletedAction.partials.PaymentBuilder.partials.FinalizeByPaymentCreatorInfo';

const MSG = defineMessages({
  info: {
    id: `${displayName}.info`,
    defaultMessage: 'Payment creator released the payment.',
  },
  overview: {
    id: `${displayName}.overview`,
    defaultMessage: 'Overview',
  },
  member: {
    id: `${displayName}.member`,
    defaultMessage: 'Member',
  },
});

const FinalizeByPaymentCreatorInfo: FC<FinalizeByPaymentCreatorInfoProps> = ({
  userAdddress,
}) => {
  return (
    <MenuWithStatusText
      statusTextSectionProps={{
        status: StatusTypes.Info,
        children: formatText(MSG.info),
        textClassName: 'text-4 text-gray-900',
        iconAlignment: 'top',
        iconSize: 16,
        iconClassName: 'text-gray-500',
      }}
      sections={[
        {
          key: '1',
          content: (
            <>
              <h4 className="text-1">{formatText(MSG.overview)}</h4>
              {userAdddress && (
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-sm text-gray-600">
                    {formatText(MSG.member)}
                  </span>
                  <UserPopover size={18} walletAddress={userAdddress || ''} />
                </div>
              )}
            </>
          ),
        },
      ]}
    />
  );
};

export default FinalizeByPaymentCreatorInfo;
