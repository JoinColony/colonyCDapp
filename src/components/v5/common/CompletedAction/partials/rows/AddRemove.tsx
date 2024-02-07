import { PlusMinus } from 'phosphor-react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { ColonyActionType } from '~gql';
import { formatText } from '~utils/intl.ts';

import { ICON_SIZE } from '../../consts.ts';

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
  return (
    <>
      <div>
        <div className="flex items-center gap-2">
          <PlusMinus size={ICON_SIZE} />
          <span>{formatText(MSG.addOrRemoveMembers)}</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {formatText(
          actionType === ColonyActionType.AddVerifiedMembers
            ? MSG.addMembers
            : MSG.removeMembers,
        )}
      </div>
    </>
  );
};

AddRemoveRow.displayName = displayName;
export default AddRemoveRow;
