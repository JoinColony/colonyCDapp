import React, { type PropsWithChildren, type FC, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage, defineMessages } from 'react-intl';

import ContentTypeText from '~shared/Extensions/Accordion/partials/ContentTypeText.tsx';
import SpecialPercentageInput from '~shared/Extensions/ConnectForm/partials/SpecialPercentageInput.tsx';
import { type InstalledExtensionData } from '~types/extensions.ts';
import { formatText } from '~utils/intl.ts';

import {
  getExtensionParams,
  getTextChunks,
} from '../ExtensionDetailsPage/utils.tsx';

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

const StakedExpenditurePageSetup: FC<
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
        <div className="flex justify-between text-gray-900">
          <ContentTypeText
            title="Required Stake"
            subTitle="What percentage of the team’s reputation, in token terms, is required to create a Payment builder, Split or Staged payment action?"
          />
          <div className="ml-6 shrink-0">
            <SpecialPercentageInput name="params.stakeFraction" />
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

StakedExpenditurePageSetup.displayName = displayName;
export default StakedExpenditurePageSetup;
