import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import SpecialInput from '~common/Extensions/SpecialInput/SpecialInput.tsx';
import ContentTypeText from '~shared/Extensions/Accordion/partials/ContentTypeText.tsx';

import { type ExtensionSettingsBaseProps } from '../../types.ts';

const displayName =
  'pages.ExtensionPage.partials.ExtensionSettings.partials.StakedExpenditureSettings';

const StakedExpenditureSettings: FC<ExtensionSettingsBaseProps> = ({
  params,
}) => {
  const { setValue } = useFormContext();

  if (!params) {
    return null;
  }

  const MSG = defineMessages({
    requiredStakeTitle: {
      id: 'extensionSettings.stakedExpenditure.title',
      defaultMessage: 'Required Stake',
    },
    requiredStakeSubtitle: {
      id: 'extensionSettings.stakedExpenditure.subTitle',
      defaultMessage:
        'What percentage of the team’s reputation, in token terms, is required to create a Payment builder, Split or Staged payment action?',
    },
  });

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="w-full sm:max-w-[480px]">
        <ContentTypeText
          title={MSG.requiredStakeTitle}
          subTitle={MSG.requiredStakeSubtitle}
        />
      </div>
      <SpecialInput
        type="percent"
        placeholder="1"
        name="params.stakeFraction"
        onChange={(event) =>
          setValue('params.stakeFraction', event.currentTarget.value, {
            shouldValidate: true,
          })
        }
      />
    </div>
  );
};

StakedExpenditureSettings.displayName = displayName;

export default StakedExpenditureSettings;
