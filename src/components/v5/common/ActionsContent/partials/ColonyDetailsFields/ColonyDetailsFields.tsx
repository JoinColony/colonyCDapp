import React from 'react';

import ActionSidebarRow from '~v5/common/ActionSidebarRow';
import DefaultField from '../DefaultField';
import { useActionFormContext } from '~v5/common/ActionSidebar/partials/ActionForm/ActionFormContext';
import { useColonyContext } from '~hooks';
import ColonyAvatar from '~shared/ColonyAvatar';

const displayName = 'v5.common.ActionsContent.partials.ColonyDetailsFields';

const ColonyDetailsFields = () => {
  const { formErrors } = useActionFormContext();
  const { colony } = useColonyContext();

  const { metadata, colonyAddress } = colony || {};
  const { displayName: colonyName } = metadata || {};

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
          defaultValue={colonyName}
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
          <button type="button" className="text-3 text-blue-400 underline">
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
    </>
  );
};

ColonyDetailsFields.displayName = displayName;

export default ColonyDetailsFields;
