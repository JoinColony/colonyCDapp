import React, { FC } from 'react';
import { defineMessages } from 'react-intl';

import { MAX_COLONY_DISPLAY_NAME } from '~constants';
import { formatText } from '~utils/intl';
import ActionFormRow from '~v5/common/ActionFormRow';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase';

import ColonyAvatarField from './partials/ColonyAvatarField';
import NativeTokenAvatarField from './partials/NativeTokenAvatarField';

const displayName = 'v5.common.ActionsContent.partials.ColonyDetailsFields';

const MSG = defineMessages({
  colonyName: {
    id: `${displayName}.colonyName`,
    defaultMessage: 'Colony name',
  },
  colonyNameTooltip: {
    id: `${displayName}.colonyNameTooltip`,
    defaultMessage: 'The display name of the Colony.',
  },
  colonyNamePlaceholder: {
    id: `${displayName}.colonyNamePlaceholder`,
    defaultMessage: 'Enter colony name',
  },
  colonyLogo: {
    id: `${displayName}.colonyLogo`,
    defaultMessage: 'Colony logo',
  },
  colonyLogoTooltip: {
    id: `${displayName}.colonyLogoTooltip`,
    defaultMessage: 'The logo of the Colony.',
  },
  colonyDescription: {
    id: `${displayName}.colonyDescription`,
    defaultMessage: 'Colony description',
  },
  colonyDescriptionPlaceholder: {
    id: `${displayName}.colonyDescriptionPlaceholder`,
    defaultMessage: 'Short colony description',
  },
  colonyDescriptionTooltip: {
    id: `${displayName}.colonyDescriptionTooltip`,
    defaultMessage:
      "Short overview describing what the Colony is about and it's purpose.",
  },
  tokenLogo: {
    id: `${displayName}.tokenLogo`,
    defaultMessage: 'Token logo',
  },
  tokenLogoTooltip: {
    id: `${displayName}.tokenLogoTooltip`,
    defaultMessage: "The logo of the Colony's native token.",
  },
});

const ColonyDetailsFields: FC = () => (
  <>
    <ActionFormRow
      icon="pencil-circle"
      fieldName="colonyName"
      title={formatText(MSG.colonyName)}
      tooltips={{
        label: {
          tooltipContent: formatText(MSG.colonyNameTooltip),
        },
      }}
    >
      <FormInputBase
        name="colonyName"
        maxLength={MAX_COLONY_DISPLAY_NAME}
        placeholder={formatText(MSG.colonyNamePlaceholder)}
        mode="secondary"
      />
    </ActionFormRow>
    <ActionFormRow
      icon="image"
      fieldName="avatar"
      title={formatText(MSG.colonyLogo)}
      tooltips={{
        label: {
          tooltipContent: formatText(MSG.colonyLogoTooltip),
        },
      }}
    >
      <div className="flex items-center">
        <ColonyAvatarField
          name="avatar"
          fileOptions={{
            fileFormat: ['.PNG', '.JPG', '.SVG'],
            fileDimension: '250x250px',
            fileSize: '1MB',
          }}
        />
      </div>
    </ActionFormRow>
    <ActionFormRow
      icon="file-text"
      fieldName="colonyDescription"
      title={formatText(MSG.colonyDescription)}
      isMultiLine
      tooltips={{
        label: {
          tooltipContent: formatText(MSG.colonyDescriptionTooltip),
        },
      }}
    >
      <FormTextareaBase
        message={false}
        name="colonyDescription"
        placeholder={formatText(MSG.colonyDescriptionPlaceholder)}
      />
    </ActionFormRow>
    <ActionFormRow
      icon="image"
      fieldName="nativeTokenAvatar"
      title={formatText(MSG.tokenLogo)}
      tooltips={{
        label: {
          tooltipContent: formatText(MSG.tokenLogoTooltip),
        },
      }}
    >
      <div className="flex items-center">
        <NativeTokenAvatarField
          name="nativeTokenAvatar"
          fileOptions={{
            fileFormat: ['.PNG', '.JPG', '.SVG'],
            fileDimension: '250x250px',
            fileSize: '1MB',
          }}
        />
      </div>
    </ActionFormRow>
  </>
);

ColonyDetailsFields.displayName = displayName;

export default ColonyDetailsFields;
