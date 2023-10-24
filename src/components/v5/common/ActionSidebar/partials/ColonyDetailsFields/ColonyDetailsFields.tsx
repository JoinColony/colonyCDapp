import React, { FC } from 'react';
import { useController } from 'react-hook-form';
import ActionSidebarRow from '~v5/common/ActionFormRow';
import { useColonyContext } from '~hooks';
import ColonyAvatar from '~shared/ColonyAvatar';
import ChangeColonyLogo from './partials/ChangeColonyLogo';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase';
import { MAX_COLONY_DISPLAY_NAME } from '~constants';
import { formatText } from '~utils/intl';

const displayName = 'v5.common.ActionsContent.partials.ColonyDetailsFields';

const ColonyDetailsFields: FC = () => {
  const { colony } = useColonyContext();
  const {
    avatarModalToggle: [, { toggleOn: toggleChangeAvatarModalOn }],
  } = useActionSidebarContext();
  const { colonyAddress } = colony || {};
  const { readonly } = useAdditionalFormOptionsContext();
  const { field } = useController({
    name: 'colonyAvatar',
  });

  return (
    <>
      <ActionSidebarRow
        iconName="pencil-circle"
        title={formatText({ id: 'actionSidebar.colonyName' })}
        fieldName="colonyName"
      >
        <FormInputBase
          name="colonyName"
          maxLength={MAX_COLONY_DISPLAY_NAME}
          placeholder={formatText({
            id: 'actionSidebar.colonyName.placeholder',
          })}
          mode="secondary"
          readOnly={readonly}
        />
      </ActionSidebarRow>
      <ActionSidebarRow
        iconName="image"
        title={formatText({ id: 'actionSidebar.colonyLogo' })}
        fieldName="colonyLogo"
      >
        <div className="flex items-center">
          <div className="flex mr-2 shrink-0">
            <ColonyAvatar
              colony={colony}
              externalAvatar={field.value}
              colonyAddress={colonyAddress || ''}
              size="xs"
            />
          </div>
          {!readonly && (
            <button
              type="button"
              className="text-3 underline text-gray-700 hover:text-blue-400"
              onClick={() => toggleChangeAvatarModalOn()}
            >
              Change logo
            </button>
          )}
        </div>
      </ActionSidebarRow>
      <ActionSidebarRow
        iconName="file-text"
        title={formatText({ id: 'actionSidebar.colonyDescription' })}
        fieldName="colonyDescription"
      >
        <FormInputBase
          name="colonyDescription"
          placeholder={formatText({
            id: 'actionSidebar.colonyDescription.placeholder',
          })}
          mode="secondary"
          readOnly={readonly}
        />
      </ActionSidebarRow>
      <ChangeColonyLogo
        fileOptions={{
          fileFormat: ['.PNG', '.JPG', '.SVG'],
          fileDimension: '250x250px',
          fileSize: '1MB',
        }}
      />
    </>
  );
};

ColonyDetailsFields.displayName = displayName;

export default ColonyDetailsFields;
