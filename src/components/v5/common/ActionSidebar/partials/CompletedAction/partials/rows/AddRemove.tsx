import { PlusMinus } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { ColonyActionType } from '~gql';
import { formatText } from '~utils/intl.ts';

import ActionContent from './ActionContent.tsx';

const displayName = 'v5.common.CompletedAction.partials.AddRemoveRow';

interface AddRemoveRowProps {
  actionType: ColonyActionType;
}

// @TODO rework this to use same translation strings as the form
const MSG = defineMessages({
  addOrRemoveMembers: {
    id: `${displayName}.addOrRemoveMembers`,
    defaultMessage: 'Add/remove',
  },
  addMembers: {
    id: `${displayName}.addMembers`,
    defaultMessage: 'Add members',
  },
  removeMembers: {
    id: `${displayName}.removeMembers`,
    defaultMessage: 'Remove members',
  },
});

const AddRemoveRow = ({ actionType }: AddRemoveRowProps) => {
  const getRowContent = () => {
    switch (actionType) {
      case ColonyActionType.AddVerifiedMembers:
      case ColonyActionType.AddVerifiedMembersMotion:
      case ColonyActionType.AddVerifiedMembersMultisig:
        return formatText(MSG.addMembers);
      case ColonyActionType.RemoveVerifiedMembers:
      case ColonyActionType.RemoveVerifiedMembersMotion:
      case ColonyActionType.RemoveVerifiedMembersMultisig:
        return formatText(MSG.removeMembers);
      default:
        console.warn('Unsupported action type');
        return '';
    }
  };

  return (
    <ActionContent
      rowLabel={formatText(MSG.addOrRemoveMembers)}
      RowIcon={PlusMinus}
      tooltipContent={formatText({
        id: 'actionSidebar.tooltip.manageMembers',
      })}
      rowContent={getRowContent()}
    />
  );
};

AddRemoveRow.displayName = displayName;
export default AddRemoveRow;
