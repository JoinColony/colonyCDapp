import { CaretDown, FilePlus, ShareNetwork } from '@phosphor-icons/react';
import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useCallback, useMemo } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import MeatballMenuCopyItem from '~common/ColonyActionsTable/partials/MeatballMenuCopyItem/MeatballMenuCopyItem.tsx';
import { APP_URL, DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_HOME_ROUTE,
  TX_SEARCH_PARAM,
} from '~routes';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { formatText } from '~utils/intl.ts';
import StreamingPaymentStatusPill from '~v5/common/ActionSidebar/partials/StreamingPaymentStatusPill/StreamingPaymentStatusPill.tsx';
import { EXPANDER_COLUMN_ID } from '~v5/common/Table/consts.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/MeatBallMenu.tsx';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

import { type StreamingActionTableFieldModel } from '../StreamingPaymentsTable/types.ts';

import TeamField from './partials/TeamField/TeamField.tsx';
import TitleField from './partials/TitleField/TitleField.tsx';

export const useStreamingActionsTableColumns = () => {
  const navigate = useNavigate();
  const { colony } = useColonyContext();

  const getMenuProps = useCallback(
    ({ original: { transactionId } }) => ({
      items: [
        {
          key: '1',
          label: formatText({ id: 'activityFeedTable.menu.view' }),
          icon: FilePlus,
          onClick: () => {
            navigate(
              `${window.location.pathname}?${TX_SEARCH_PARAM}=${transactionId}`,
              {
                replace: true,
              },
            );
          },
        },
        {
          key: '2',
          label: formatText({ id: 'activityFeedTable.menu.share' }),
          renderItemWrapper: (itemWrapperProps, children) => (
            <MeatballMenuCopyItem
              textToCopy={`${APP_URL.origin}/${generatePath(COLONY_HOME_ROUTE, {
                colonyName: colony.name,
              })}${COLONY_ACTIVITY_ROUTE}?${TX_SEARCH_PARAM}=${transactionId}`}
              {...itemWrapperProps}
            >
              {children}
            </MeatballMenuCopyItem>
          ),
          icon: ShareNetwork,
          onClick: () => false,
        },
      ],
    }),
    [colony.name, navigate],
  );
  return useMemo(() => {
    const helper = createColumnHelper<StreamingActionTableFieldModel>();

    return [
      helper.display({
        id: 'title',
        enableSorting: false,
        cell: ({ row }) => (
          <TitleField
            title={row.original.title}
            tokenSymbol={row.original.token?.symbol || ''}
            amount={row.original.amount}
            initiator={row.original.creatorAddress}
            recipient={row.original.recipientAddress}
            period={row.original.interval}
            decimals={row.original.token?.decimals || DEFAULT_TOKEN_DECIMALS}
            hideDescription={row.getIsExpanded()}
          />
        ),
        colSpan: (isExpanded) => (isExpanded ? 3 : undefined),
        header: formatText({ id: 'streamingPayment.table.description' }),
      }),
      helper.accessor('totalStreamedAmount', {
        id: 'totalStreamedAmount',
        staticSize: '8.75rem',
        enableSorting: true,
        cell: ({ row }) => (
          <Numeral
            className="text-md text-gray-600"
            value={row.original.totalStreamedAmount}
            decimals={row.original.token?.decimals || DEFAULT_TOKEN_DECIMALS}
          />
        ),
        colSpan: (isExpanded) => (isExpanded ? 0 : undefined),
        header: formatText({ id: 'streamingPayment.table.streamed' }),
        headCellClassName: '[&>svg]:opacity-100',
      }),
      helper.accessor('token.symbol', {
        id: 'token',
        staticSize: '6.25rem',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <TokenAvatar
              size={18}
              tokenAddress={row.original.token?.tokenAddress ?? ''}
              tokenName={row.original.token?.name}
              tokenAvatarSrc={row.original.token?.avatar ?? undefined}
            />
            <p className="text-md text-gray-600">
              {row.original.token?.symbol || ''}
            </p>
          </div>
        ),
        colSpan: (isExpanded) => (isExpanded ? 0 : undefined),
        header: formatText({ id: 'streamingPayment.table.token' }),
        headCellClassName: '[&>svg]:opacity-100',
      }),
      helper.accessor('nativeDomainId', {
        id: 'team',
        staticSize: '6.875rem',
        enableSorting: true,
        cell: ({ row }) => <TeamField domainId={row.original.nativeDomainId} />,
        header: formatText({ id: 'streamingPayment.table.team' }),
      }),
      helper.display({
        id: 'status',
        staticSize: '7.5rem',
        enableSorting: false,
        cell: ({ row }) => (
          <StreamingPaymentStatusPill status={row.original.status} />
        ),
        header: formatText({ id: 'streamingPayment.table.status' }),
      }),
      helper.display({
        id: EXPANDER_COLUMN_ID,
        staticSize: '2.25rem',
        header: () => null,
        enableSorting: false,
        cell: ({ row }) => {
          const meatBallMenuProps = getMenuProps(row);
          return (
            <div className="flex flex-col items-center justify-between">
              <button type="button" onClick={() => row.toggleExpanded()}>
                <CaretDown
                  size={18}
                  className={clsx('transition', {
                    'rotate-180': row.getIsExpanded(),
                  })}
                />
              </button>

              {meatBallMenuProps && row.getIsExpanded() && (
                <div className="flex-1 translate-y-1">
                  <MeatBallMenu
                    {...meatBallMenuProps}
                    contentWrapperClassName="!left-6 right-6"
                    buttonClassName={(isMenuOpen) =>
                      clsx({ '!text-gray-600': !isMenuOpen })
                    }
                    iconSize={18}
                  />
                </div>
              )}
            </div>
          );
        },
        cellContentWrapperClassName: 'pl-0',
      }),
    ];
  }, [getMenuProps]);
};
