import React, { type FC } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/NewExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { getTextChunks } from '~frame/Extensions/pages/NewExtensionDetailsPage/utils.tsx';
import ContentTypeText from '~shared/Extensions/Accordion/partials/ContentTypeText.tsx';
import SpecialPercentageInput from '~shared/Extensions/ConnectForm/partials/SpecialPercentageInput.tsx';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';

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
  userHasRoot: boolean;
}

const StakedExpenditureSettings: FC<StakedExpenditureSettingsProps> = ({
  userHasRoot,
}) => {
  const { extensionData } = useExtensionDetailsPageContext();

  const { h4, p, b, ul, li } = getTextChunks();

  const isFormDisabled =
    !userHasRoot ||
    (isInstalledExtensionData(extensionData) && extensionData.isDeprecated);

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
      <div className="flex justify-between text-gray-900">
        <ContentTypeText
          title="Required Stake"
          subTitle="What percentage of the team’s reputation, in token terms, is required to create a Payment builder, Split or Staged payment action?"
        />
        <div className="ml-6 shrink-0">
          <SpecialPercentageInput
            name="stakeFraction"
            disabled={isFormDisabled}
          />
        </div>
      </div>
    </div>
  );
};

StakedExpenditureSettings.displayName = displayName;
export default StakedExpenditureSettings;
