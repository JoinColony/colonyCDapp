import { type Row } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { type StreamingActionTableFieldModel } from '~frame/v5/pages/StreamingPaymentsPage/partials/StreamingPaymentsTable/types.ts';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { formatText } from '~utils/intl.ts';
import StreamingPaymentStatusPill from '~v5/common/ActionSidebar/partials/StreamingPaymentStatusPill/StreamingPaymentStatusPill.tsx';
import MeatBallMenu from '~v5/shared/MeatBallMenu/MeatBallMenu.tsx';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

import TeamField from '../TeamField/TeamField.tsx';

interface StreamingActionMobileItemProps {
  actionRow: Row<StreamingActionTableFieldModel>;
  getMenuProps: (
    row: Row<StreamingActionTableFieldModel>,
  ) => MeatBallMenuProps | undefined;
}

const displayName =
  'pages.StreamingPaymentsPage.partials.StreamingActionsTable.partials.StreamingActionMobileItem';

const MSG = defineMessages({
  streamed: {
    id: `${displayName}.streamed`,
    defaultMessage: '<p>Streamed:</p> {streamed}',
  },
  token: {
    id: `${displayName}.token`,
    defaultMessage: '<p>Token:</p> {token}',
  },
  team: {
    id: `${displayName}.team`,
    defaultMessage: '<p>Team:</p> {team}',
  },
  status: {
    id: `${displayName}.status`,
    defaultMessage: '<p>Status:</p> {status}',
  },
});

const StreamingActionMobileItem: FC<StreamingActionMobileItemProps> = ({
  actionRow,
  getMenuProps,
}) => {
  const {
    original: { amount, nativeDomainId, token, status },
  } = actionRow;

  const meatBallMenuProps = getMenuProps(actionRow);

  const textClassName = 'font-normal text-sm';
  const renderLabel = (chunks: string[]) => (
    <p className={clsx(textClassName, 'inline-block')}>{chunks}</p>
  );

  return (
    <div className="expandable flex items-start justify-between gap-1 pb-4 pl-[1.125rem] pr-[.9375rem]">
      <div className="flex flex-col gap-2 text-gray-500">
        <div className="flex items-center gap-2">
          {formatText(MSG.streamed, {
            streamed: (
              <span className={clsx(textClassName, 'text-gray-600')}>
                <Numeral value={amount} decimals={token?.decimals} />
              </span>
            ),
            p: renderLabel,
          })}
        </div>
        <div className="flex items-center gap-2">
          {formatText(MSG.token, {
            token: (
              <span className={clsx(textClassName, 'text-gray-600')}>
                {token?.symbol}
              </span>
            ),
            p: renderLabel,
          })}
        </div>
        <div className="flex items-center gap-2">
          {formatText(MSG.team, {
            team: (
              <span className={clsx(textClassName, 'text-gray-600')}>
                <TeamField domainId={nativeDomainId} />
              </span>
            ),
            p: renderLabel,
          })}
        </div>
        <div className="flex items-center gap-2">
          {formatText(MSG.status, {
            status: (
              <span className={clsx(textClassName, 'text-gray-600')}>
                <StreamingPaymentStatusPill status={status} />
              </span>
            ),
            p: renderLabel,
          })}
        </div>
      </div>
      {meatBallMenuProps && (
        <MeatBallMenu
          {...meatBallMenuProps}
          contentWrapperClassName="!left-6 right-6"
          buttonClassName={(isMenuOpen) =>
            clsx({ '!text-gray-600': !isMenuOpen })
          }
          iconSize={18}
        />
      )}
    </div>
  );
};

StreamingActionMobileItem.displayName = displayName;

export default StreamingActionMobileItem;
