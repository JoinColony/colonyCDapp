import React from 'react';
import { useFormContext } from 'react-hook-form';

import ActionSidebarRow from '~v5/common/ActionSidebarRow';
import DefaultField from '../DefaultField';
import { useActionFormContext } from '~v5/common/ActionSidebar/partials/ActionForm/ActionFormContext';
import { useColonyContext } from '~hooks';
import ColonyAvatar from '~shared/ColonyAvatar';
import ChangeColonyLogo from './partials/ChangeColonyLogo';
import { useActionSidebarContext } from '~context/ActionSidebarContext';

const displayName = 'v5.common.ActionsContent.partials.ColonyDetailsFields';

const ColonyDetailsFields = () => {
  const { formErrors } = useActionFormContext();
  const { colony } = useColonyContext();
  const { toggleChangeAvatarModalOn } = useActionSidebarContext();
  const { colonyAddress } = colony || {};
  const { watch } = useFormContext();
  const { colonyDisplayName } = watch();

  return (
    <>
      <ActionSidebarRow
        iconName="pencil-circle"
        title={{ id: 'actionSidebar.colonyName' }}
        isErrors={formErrors?.colonyDisplayName}
      >
        <DefaultField
          name="colonyDisplayName"
          placeholder={{ id: 'actionSidebar.colonyName.placeholder' }}
          isErrors={formErrors?.colonyDisplayName}
          defaultValue={colonyDisplayName}
        />
      </ActionSidebarRow>
      <ActionSidebarRow
        iconName="image"
        title={{ id: 'actionSidebar.colonyLogo' }}
        isErrors={formErrors?.colonyLogo}
      >
        <div className="flex items-center">
          <div className="flex mr-2 shrink-0">
            <ColonyAvatar
              colony={colony}
              colonyAddress={colonyAddress || ''}
              size="xs"
            />
          </div>
          <button
            type="button"
            className="text-3 underline text-gray-700 hover:text-blue-400"
            onClick={() => toggleChangeAvatarModalOn()}
          >
            Change logo
          </button>
        </div>
      </ActionSidebarRow>
      <ActionSidebarRow
        iconName="file-text"
        title={{ id: 'actionSidebar.colonyDescription' }}
        isErrors={formErrors?.colonyDescription}
      >
        <DefaultField
          name="colonyDescription"
          placeholder={{ id: 'actionSidebar.colonyDescription.placeholder' }}
          isErrors={formErrors?.colonyDescription}
        />
      </ActionSidebarRow>

      <ChangeColonyLogo />
    </>
  );
};

ColonyDetailsFields.displayName = displayName;

export default ColonyDetailsFields;
