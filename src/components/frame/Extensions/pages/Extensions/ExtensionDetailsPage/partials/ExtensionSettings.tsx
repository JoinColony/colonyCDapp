import Decimal from 'decimal.js';
import React, { type FC } from 'react';

import { type InstalledExtensionData } from '~types/extensions.ts';

import { paramsMap } from '../ExtensionDetailsPageContent/consts.ts';
import { getExtensionParams } from '../ExtensionDetailsPageContent/utils.tsx';

import ExtensionDetails from './ExtensionDetails/ExtensionDetails.tsx';

interface ExtensionSettingsProps {
  extensionData: InstalledExtensionData;
}

const displayName =
  'frame.Extensions.pages.ExtensionDetailsPage.partials.ExtensionSettings';

const ExtensionSettings: FC<ExtensionSettingsProps> = ({ extensionData }) => {
  const params: Record<string, string> | null =
    getExtensionParams(extensionData);

  if (!params) {
    return null;
  }

  const details = (
    <div>
      {Object.keys(params)
        .filter((key) => key !== '__typename')
        .filter((param) => paramsMap[extensionData.extensionId][param])
        .map((param) => {
          const { title, complementaryLabel, description } =
            paramsMap[extensionData.extensionId][param];
          let value: string = params[param];

          if (complementaryLabel === 'percent') {
            value = new Decimal(value).div(new Decimal(10).pow(16)).toString();
          } else {
            const valueDecimal = new Decimal(value).div(3600);
            value = valueDecimal.isInteger()
              ? valueDecimal.toFixed(0)
              : valueDecimal.toFixed(2);
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
      {details}
    </div>
  );
};

ExtensionSettings.displayName = displayName;

export default ExtensionSettings;
