import React, { FC } from 'react';
import Decimal from 'decimal.js';
import { Extension } from '@colony/colony-js';

import { paramsMap } from './consts';

interface ParamDetailsTabProps {
  extension: Extension;
  params?: Record<string, string> | null;
}

const displayName = 'pages.ExtensionDetailsPage.ParamDetailsTab';

const ParamDetailsTab: FC<ParamDetailsTabProps> = ({ extension, params }) => {
  if (!params) {
    return null;
  }

  return (
    <li>
      {Object.keys(params)
        .filter((key) => key !== '__typename')
        .filter((param) => paramsMap[extension][param])
        .map((param) => {
          const { title, complementaryLabel, description } =
            paramsMap[extension][param];
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
    </li>
  );
};

ParamDetailsTab.displayName = displayName;

export default ParamDetailsTab;
