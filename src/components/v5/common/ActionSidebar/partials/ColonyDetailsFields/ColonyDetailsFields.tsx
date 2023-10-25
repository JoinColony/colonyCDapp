import React, { FC } from 'react';
import ActionSidebarRow from '~v5/common/ActionFormRow';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase';
import { MAX_COLONY_DISPLAY_NAME } from '~constants';
import ColonyAvatarField from './partials/ColonyAvatarField';
import { formatText } from '~utils/intl';

const displayName = 'v5.common.ActionsContent.partials.ColonyDetailsFields';

const ColonyDetailsFields: FC = () => (
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
      />
    </ActionSidebarRow>
    <ActionSidebarRow
      iconName="image"
      title={formatText({ id: 'actionSidebar.colonyLogo' })}
      fieldName="avatar"
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
      />
    </ActionSidebarRow>
  </>
);

ColonyDetailsFields.displayName = displayName;

export default ColonyDetailsFields;
