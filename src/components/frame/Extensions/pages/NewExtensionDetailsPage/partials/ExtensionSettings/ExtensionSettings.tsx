import { ColonyRole, Extension, Id } from '@colony/colony-js';
import Decimal from 'decimal.js';
import React, { useEffect, type FC } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { paramsMap } from '~frame/Extensions/pages/ExtensionDetailsPage/consts.ts';
import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/NewExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { ExtensionDetailsPageTabId } from '~frame/Extensions/pages/NewExtensionDetailsPage/types.ts';
import { getExtensionParams } from '~frame/Extensions/pages/NewExtensionDetailsPage/utils.tsx';
import { type InstalledExtensionData } from '~types/extensions.ts';
import { addressHasRoles } from '~utils/checks/userHasRoles.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

import ExtensionDetailsSidePanel from '../ExtensionDetailsSidePanel/ExtensionDetailsSidePanel.tsx';

import { extensionsSettingsComponents } from './consts.tsx';

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

  const params = getExtensionParams(extensionData);

  const isVotingReputation =
    extensionData.extensionId === Extension.VotingReputation;
  const isStakedExpenditure =
    extensionData.extensionId === Extension.StakedExpenditure;

  const userHasRoot =
    !!user &&
    addressHasRoles({
      address: user.walletAddress,
      colony,
      requiredRoles: [ColonyRole.Root],
      requiredRolesDomain: Id.RootDomain,
    });

  const details = (
    <div>
      {Object.keys(params)
        .filter((param) => paramsMap[extensionData.extensionId][param])
        .map((param) => {
          // @TODO: Refactor to use extensions config
          const { title, complementaryLabel, description } =
            paramsMap[extensionData.extensionId][param];
          let value: string = params[param];

          if (!isStakedExpenditure) {
            if (complementaryLabel === 'percent') {
              value = new Decimal(value)
                .div(new Decimal(10).pow(16))
                .toString();
            } else {
              const valueDecimal = new Decimal(value).div(3600);
              value = valueDecimal.isInteger()
                ? valueDecimal.toFixed(0)
                : valueDecimal.toFixed(2);
            }
          }

          return (
            <div
              key={title}
              className="border-b border-gray-200 py-4 last:border-none"
            >
              <div className="flex items-center justify-between text-1">
                <p>{title}</p>
                <div>
                  {value} {complementaryLabel === 'percent' ? '%' : 'Hours'}
                </div>
              </div>
              <p className="text-sm">{description}</p>
            </div>
          );
        })}
    </div>
  );

  /**
   * Show readonly params for non-root users or if the extension is
   * initialized VotingReputation (which params can't be modified after initialization)
   */
  const shouldShowReadonlyParams =
    !userHasRoot || (isVotingReputation && extensionData.isInitialized);

  return (
    <div className="flex flex-col gap-9 md:gap-6">
      <ExtensionDetailsSidePanel
        extensionData={extensionData}
        className="md:hidden"
      />
      {shouldShowReadonlyParams
        ? details
        : extensionsSettingsComponents[extensionData.extensionId]}
    </div>
  );
};

ExtensionSettings.displayName = displayName;

export default ExtensionSettings;
