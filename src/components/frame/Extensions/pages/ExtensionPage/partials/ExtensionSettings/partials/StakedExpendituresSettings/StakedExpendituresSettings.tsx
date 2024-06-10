import { Id } from '@colony/colony-js';
import { get } from 'lodash';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import SpecialInput from '~common/Extensions/SpecialInput/SpecialInput.tsx';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { getExtensionDataParams } from '~frame/Extensions/pages/ExtensionPage/utils.tsx';
import ContentTypeText from '~shared/Extensions/Accordion/partials/ContentTypeText.tsx';
import { type Message } from '~types';
import { addressHasRoles } from '~utils/checks/userHasRoles.ts';
import { formatText } from '~utils/intl.ts';
import { formatMessage } from '~utils/yup/tests/helpers.ts';
import FormError from '~v5/shared/FormError/FormError.tsx';

import { type ExtensionSettingsBaseProps } from '../../types.ts';

const displayName =
  'pages.ExtensionPage.partials.ExtensionSettings.partials.StakedExpenditureSettings';

const StakedExpenditureSettings: FC<ExtensionSettingsBaseProps> = ({
  extensionData,
}) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();

  const params = getExtensionDataParams(extensionData);

  /**
   * In the future, if this extension happens to have more than 1 param,
   * refactor the UI so it maps through all param and error fields instead
   */
  const stakeFractionParam = 'params.stakeFraction';

  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, stakeFractionParam)?.message as Message | undefined;

  if (!params) {
    return null;
  }

  const MSG = defineMessages({
    requiredStakeTitle: {
      id: 'extensionSettings.stakedExpenditure.stakeField.title',
      defaultMessage: 'Required Stake',
    },
    requiredStakeSubtitle: {
      id: 'extensionSettings.stakedExpenditure.stakeField.subTitle',
      defaultMessage:
        'What percentage of the team’s reputation, in token terms, is required to create a Payment builder, Split or Staged payment action?',
    },
    contentTitleA: {
      id: 'extensionSettings.stakedExpenditure.contentTitleA',
      defaultMessage: 'Enabling this extension requires additional parameters.',
    },
    contentTitleB: {
      id: 'extensionSettings.stakedExpenditure.contentTitleB',
      defaultMessage:
        'These parameters can be changed at any time in the future. Changes to the extension parameters require Owner permissions or above.',
    },
    parametersHeading: {
      id: 'extensionSettings.stakedExpenditure.parametersHeading',
      defaultMessage: 'Extension parameters',
    },
  });

  const hasNeededPermissions =
    !!user &&
    addressHasRoles({
      address: user.walletAddress,
      colony,
      requiredRoles: extensionData.neededColonyPermissions,
      requiredRolesDomains: [Id.RootDomain],
    });

  return (
    <div>
      <p className="pb-5 text-md text-gray-600">
        {formatMessage(MSG.contentTitleA)}
      </p>
      <p className="pb-5 text-md text-gray-600">
        {formatMessage(MSG.contentTitleB)}
      </p>
      <p className="pb-5 font-bold">{formatMessage(MSG.parametersHeading)}</p>
      <div className="flex items-center justify-between gap-4">
        <div className="w-full sm:max-w-[480px]">
          <ContentTypeText
            title={MSG.requiredStakeTitle}
            subTitle={MSG.requiredStakeSubtitle}
          />
        </div>
        <div>
          {hasNeededPermissions ? (
            <>
              <SpecialInput
                type="percent"
                placeholder="1"
                name={stakeFractionParam}
                onChange={(event) =>
                  setValue(stakeFractionParam, event.currentTarget.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                isError={!!errors.params}
              />
              {error && <FormError>{formatText(error)}</FormError>}
            </>
          ) : (
            <p className="text-sm">{params.stakeFraction}%</p>
          )}
        </div>
      </div>
    </div>
  );
};

StakedExpenditureSettings.displayName = displayName;

export default StakedExpenditureSettings;
