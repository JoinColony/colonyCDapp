import { ColonyRole, Extension, Id } from '@colony/colony-js';
import React, { useEffect, type FC } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/NewExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { ExtensionDetailsPageTabId } from '~frame/Extensions/pages/NewExtensionDetailsPage/types.ts';
import { type InstalledExtensionData } from '~types/extensions.ts';
import { addressHasRoles } from '~utils/checks/userHasRoles.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

import ExtensionDetailsSidePanel from '../ExtensionDetailsSidePanel/ExtensionDetailsSidePanel.tsx';

import MultiSigSettings from './MultiSigSettings/MultiSigSettings.tsx';
import StakedExpenditureSettings from './StakedExpenditureSettings.tsx';
import VotingReputationSettings from './VotingReputationSettings.tsx';

interface ExtensionSettingsProps {
  extensionData: InstalledExtensionData;
}

const displayName =
  'frame.Extensions.pages.ExtensionDetailsPage.partials.ExtensionSettings';

const ExtensionSettings: FC<ExtensionSettingsProps> = ({ extensionData }) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const { setActiveTab } = useExtensionDetailsPageContext();

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

  const userHasRoot =
    !!user &&
    addressHasRoles({
      address: user.walletAddress,
      colony,
      requiredRoles: [ColonyRole.Root],
      requiredRolesDomain: Id.RootDomain,
    });

  return (
    <div className="flex flex-col gap-9 md:gap-6">
      <ExtensionDetailsSidePanel
        extensionData={extensionData}
        className="md:hidden"
      />
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
