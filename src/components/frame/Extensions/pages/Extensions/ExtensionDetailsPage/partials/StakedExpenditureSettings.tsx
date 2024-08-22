import React, { type PropsWithChildren, type FC, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage, defineMessages } from 'react-intl';

import ContentTypeText from '~shared/Extensions/Accordion/partials/ContentTypeText.tsx';
import SpecialHourInput from '~shared/Extensions/ConnectForm/partials/SpecialHourInput.tsx';
import SpecialPercentageInput from '~shared/Extensions/ConnectForm/partials/SpecialPercentageInput.tsx';
import { type InstalledExtensionData } from '~types/extensions.ts';
import { formatText } from '~utils/intl.ts';

import {
  getExtensionParams,
  getTextChunks,
} from '../ExtensionDetailsPageContent/utils.tsx';

const displayName = 'pages.ExtensionDetailsPage.StakedExpenditureSettings';

const MSG = defineMessages({
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      '<p>Enabling this extension requires additional parameters.</p><p>These parameters can be changed at any time in future. Changes to the extension parameters require Owner permissions or above. </p>',
  },
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Extension parameters',
  },
});

interface StakedExpenditureSettingsProps {
  showForm?: boolean;
  extensionData: InstalledExtensionData;
}

const StakedExpenditureSettings: FC<
  PropsWithChildren<StakedExpenditureSettingsProps>
> = ({ showForm, extensionData, children }) => {
  const { h4, p, b, ul, li } = getTextChunks();
  const { resetField } = useFormContext();

  useEffect(() => {
    resetField('params.stakeFraction', {
      defaultValue: getExtensionParams(extensionData)?.stakeFraction,
    });
  }, [extensionData, resetField]);

  return (
    <div>
      <div className="mb-6 text-md text-gray-600">
        <FormattedMessage
          {...MSG.description}
          values={{
            h4,
            p,
            b,
            ul,
            li,
          }}
        />
      </div>
      <h3 className="mb-6 text-gray-900 heading-5">{formatText(MSG.title)}</h3>
      {showForm ? (
        <>
          {extensionData.initializationParams?.length && (
            <>
              {extensionData.initializationParams.map(
                ({ title, description, paramName, complementaryLabel }) => (
                  <div className="flex justify-between text-gray-900">
                    <ContentTypeText title={title} subTitle={description} />
                    <div className="ml-6 shrink-0">
                      {complementaryLabel === 'percent' && (
                        <SpecialPercentageInput name={`params.${paramName}`} />
                      )}
                      {complementaryLabel === 'hours' && (
                        <SpecialHourInput name={`params.${paramName}`} />
                      )}
                    </div>
                  </div>
                ),
              )}
            </>
          )}
        </>
      ) : (
        children
      )}
    </div>
  );
};

StakedExpenditureSettings.displayName = displayName;
export default StakedExpenditureSettings;
