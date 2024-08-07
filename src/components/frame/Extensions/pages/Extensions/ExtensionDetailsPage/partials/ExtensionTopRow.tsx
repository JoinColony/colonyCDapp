import { Extension } from '@colony/colony-js';
import React, { type FC } from 'react';
import { useLocation } from 'react-router-dom';

import { type AnyExtensionData } from '~types/extensions.ts';
import { formatText } from '~utils/intl.ts';

import { useExtensionDetailsPageContext } from '../context/ExtensionDetailsPageContext.ts';
import { ExtensionsBadgeMap } from '../ExtensionDetailsPageContent/consts.ts';

import ActionButtons from './ActionButtons/ActionButtons.tsx';

interface ExtensionsTopRowProps {
  extensionData: AnyExtensionData;
}

const displayName = 'pages.ExtensionDetailsPage.ExtensionTopRow';

const ExtensionsTopRow: FC<ExtensionsTopRowProps> = ({ extensionData }) => {
  const { pathname } = useLocation();
  const { setWaitingForActionConfirmation, waitingForActionConfirmation } =
    useExtensionDetailsPageContext();

  const isSetupRoute = pathname.split('/').pop() === 'setup';

  const isVotingReputationExtension =
    extensionData.extensionId === Extension.VotingReputation;

  return (
    <div className="flex min-h-10 flex-col flex-wrap justify-between sm:flex-row sm:items-center sm:gap-6">
      <div className="flex w-full flex-col flex-wrap gap-4 sm:flex-row sm:flex-nowrap sm:items-center sm:gap-6">
        <ActionButtons
          waitingForActionConfirmation={waitingForActionConfirmation}
          setWaitingForActionConfirmation={setWaitingForActionConfirmation}
          isSetupRoute={isSetupRoute}
          extensionData={extensionData}
          extensionStatusMode={ExtensionsBadgeMap[extensionData.extensionId]}
          extensionStatusText={formatText({
            id: isVotingReputationExtension
              ? 'status.governance'
              : 'status.payments',
          })}
        />
      </div>
    </div>
  );
};

ExtensionsTopRow.displayName = displayName;

export default ExtensionsTopRow;
