import { ColonyRole, Extension, Id } from '@colony/colony-js';
import Decimal from 'decimal.js';
import React, { type FC } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type InstalledExtensionData } from '~types/extensions.ts';
import { addressHasRoles } from '~utils/checks/userHasRoles.ts';

import { paramsMap } from '../consts.ts';
import { getExtensionParams } from '../utils.tsx';

import ExtensionDetails from './ExtensionDetails/ExtensionDetails.tsx';
import StakedExpenditureSettings from './StakedExpenditureSettings.tsx';

interface ExtensionSettingsProps {
  extensionData: InstalledExtensionData;
}

const displayName =
  'frame.Extensions.pages.ExtensionDetailsPage.partials.ExtensionSettings';

const ExtensionSettings: FC<ExtensionSettingsProps> = ({ extensionData }) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();

  const params: Record<string, string> | null =
    getExtensionParams(extensionData);

  if (!params) {
    return null;
  }

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
        .filter((key) => key !== '__typename')
        .filter((param) => paramsMap[extensionData.extensionId][param])
        .map((param) => {
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

  return (
    <div className="flex flex-col gap-9 md:gap-6">
      <ExtensionDetails extensionData={extensionData} className="md:hidden" />
      {isStakedExpenditure ? (
        <StakedExpenditureSettings
          showForm={userHasRoot}
          extensionData={extensionData}
        >
          {details}
        </StakedExpenditureSettings>
      ) : (
        details
      )}
    </div>
  );
};

ExtensionSettings.displayName = displayName;

export default ExtensionSettings;
