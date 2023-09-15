import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import ActionSidebarRow from '~v5/common/ActionFormRow';
import DefaultField from '../DefaultField';
import { useColonyContext } from '~hooks';
import ColonyAvatar from '~shared/ColonyAvatar';
import ChangeColonyLogo from './partials/ChangeColonyLogo';
import { useActionSidebarContext } from '~context/ActionSidebarContext';

const displayName = 'v5.common.ActionsContent.partials.ColonyDetailsFields';

const ColonyDetailsFields: FC = () => {
  const intl = useIntl();
  const { colony } = useColonyContext();
  const {
    avatarModalToggle: [, { toggleOn: toggleChangeAvatarModalOn }],
  } = useActionSidebarContext();
  const { colonyAddress } = colony || {};

  return (
    <>
      <ActionSidebarRow
        iconName="pencil-circle"
        title={intl.formatMessage({ id: 'actionSidebar.colonyName' })}
        fieldName="colonyName"
      >
        <DefaultField
          name="colonyName"
          placeholder={intl.formatMessage({
            id: 'actionSidebar.colonyName.placeholder',
          })}
        />
      </ActionSidebarRow>
      <ActionSidebarRow
        iconName="image"
        title={intl.formatMessage({ id: 'actionSidebar.colonyLogo' })}
        fieldName="colonyLogo"
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
        title={intl.formatMessage({ id: 'actionSidebar.colonyDescription' })}
        fieldName="colonyDescription"
      >
        <DefaultField
          name="colonyDescription"
          placeholder={intl.formatMessage({
            id: 'actionSidebar.colonyDescription.placeholder',
          })}
        />
      </ActionSidebarRow>
      <ChangeColonyLogo />
    </>
  );
};

ColonyDetailsFields.displayName = displayName;

export default ColonyDetailsFields;
