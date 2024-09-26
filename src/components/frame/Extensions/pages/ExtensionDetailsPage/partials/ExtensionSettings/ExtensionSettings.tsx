import { Extension } from '@colony/colony-js';
import React, { useEffect, type FC } from 'react';

import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/ExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { ExtensionDetailsPageTabId } from '~frame/Extensions/pages/ExtensionDetailsPage/types.ts';
import { type InstalledExtensionData } from '~types/extensions.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

import ExtensionDetailsSidePanel from '../ExtensionDetailsSidePanel/ExtensionDetailsSidePanel.tsx';

import MultiSigSettings from './MultiSigSettings/MultiSigSettings.tsx';
import StakedExpenditureSettings from './StakedExpenditureSettings.tsx';
import VotingReputationSettings from './VotingReputationSettings/VotingReputationSettings.tsx';

interface ExtensionSettingsProps {
  extensionData: InstalledExtensionData;
}

const displayName =
  'frame.Extensions.pages.ExtensionDetailsPage.partials.ExtensionSettings';

const ExtensionSettings: FC<ExtensionSettingsProps> = ({ extensionData }) => {
  const { setActiveTab, userHasRoot } = useExtensionDetailsPageContext();

  /*
   * If we arrive here but the extension is not installed,
   * navigate back to overview tab
   */
  useEffect(() => {
    if (!isInstalledExtensionData(extensionData)) {
      setActiveTab(ExtensionDetailsPageTabId.Overview);
    }
  }, [extensionData, setActiveTab]);

  const isVotingReputation =
    extensionData.extensionId === Extension.VotingReputation;
  const isStakedExpenditure =
    extensionData.extensionId === Extension.StakedExpenditure;
  const isMultiSig =
    extensionData.extensionId === Extension.MultisigPermissions;

  return (
    <div className="flex flex-col gap-9 md:gap-6">
      <ExtensionDetailsSidePanel className="md:hidden" />
      {isVotingReputation && (
        <VotingReputationSettings userHasRoot={userHasRoot} />
      )}
      {isStakedExpenditure && (
        <StakedExpenditureSettings userHasRoot={userHasRoot} />
      )}
      {isMultiSig && <MultiSigSettings userHasRoot={userHasRoot} />}
    </div>
  );
};

ExtensionSettings.displayName = displayName;

export default ExtensionSettings;
