import {
  ArrowSquareOut,
  FilePlus,
  ShareNetwork,
  Repeat,
} from '@phosphor-icons/react';
import { type Row } from '@tanstack/react-table';
import React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import { APP_URL, DEFAULT_NETWORK_INFO } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';
import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_HOME_ROUTE,
  TX_SEARCH_PARAM,
} from '~routes';
import TransactionLink from '~shared/TransactionLink/index.ts';
import { formatText } from '~utils/intl.ts';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

import MeatballMenuCopyItem from '../partials/MeatballMenuCopyItem/index.ts';
import { type ColonyActionsTableProps } from '../types.ts';

import { useBuildRedoEnabledActionsMap } from './useBuildRedoEnabledActionsMap.ts';

export const useGetMenuProps = ({
  colonyActionsLoading,
  setAction,
  colonyActions,
}: {
  colonyActionsLoading: boolean;
  setAction: ColonyActionsTableProps['actionProps']['setSelectedAction'];
  colonyActions: ActivityFeedColonyAction[];
}) => {
  const navigate = useNavigate();

  const {
    colony: { name: colonyName },
  } = useColonyContext();

  const redoEnabledActionsMap = useBuildRedoEnabledActionsMap({
    colonyActions,
    colonyActionsLoading,
  });

  const getMenuProps: (
    row: Row<ActivityFeedColonyAction>,
  ) => MeatBallMenuProps | undefined = ({ original: colonyAction }) => {
    const { transactionHash } = colonyAction;

    return {
      disabled: colonyActionsLoading,
      items: [
        {
          key: '1',
          label: formatText({ id: 'activityFeedTable.menu.view' }),
          icon: FilePlus,
          onClick: () => {
            navigate(
              `${window.location.pathname}?${TX_SEARCH_PARAM}=${transactionHash}`,
              {
                replace: true,
              },
            );
          },
        },
        {
          key: '2',
          label: (
            <TransactionLink hash={transactionHash}>
              {formatText(
                { id: 'activityFeedTable.menu.viewOnNetwork' },
                {
                  blockExplorerName: DEFAULT_NETWORK_INFO.blockExplorerName,
                },
              )}
            </TransactionLink>
          ),
          icon: ArrowSquareOut,
        },
        {
          key: '3',
          label: formatText({ id: 'activityFeedTable.menu.share' }),
          renderItemWrapper: (itemWrapperProps, children) => (
            <MeatballMenuCopyItem
              textToCopy={`${APP_URL.origin}/${generatePath(COLONY_HOME_ROUTE, {
                colonyName,
              })}${COLONY_ACTIVITY_ROUTE}?${TX_SEARCH_PARAM}=${transactionHash}`}
              {...itemWrapperProps}
            >
              {children}
            </MeatballMenuCopyItem>
          ),
          icon: ShareNetwork,
          onClick: () => false,
        },
        ...(redoEnabledActionsMap[colonyAction.transactionHash]
          ? [
              {
                key: '4',
                label: formatText({ id: 'completedAction.redoAction' }),
                icon: Repeat,
                onClick: () => setAction(transactionHash),
              },
            ]
          : []),
      ],
    };
  };

  return getMenuProps;
};
