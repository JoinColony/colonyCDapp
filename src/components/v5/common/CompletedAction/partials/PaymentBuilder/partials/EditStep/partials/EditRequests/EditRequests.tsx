import React, { type FC } from 'react';

import { type ExpenditureAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import MenuContainer from '~v5/shared/MenuContainer/MenuContainer.tsx';

import EditRequestItem from './EditRequestItem.tsx';

interface EditRequestsProps {
  editingActions: ExpenditureAction[];
  isEditMode?: boolean;
}

const EditRequests: FC<EditRequestsProps> = ({
  editingActions,
  isEditMode,
}) => {
  return (
    <MenuContainer
      className="w-full overflow-hidden p-[1.125rem]"
      withPadding={false}
    >
      <h5 className="mb-2 text-1">
        {formatText({
          id: 'expenditure.editingRequest.title',
        })}
      </h5>
      <ul className="max-h-[6.25rem] overflow-y-auto overflow-x-hidden">
        {editingActions.map((action) => (
          <li className="mb-2 w-full last:mb-0" key={action.transactionHash}>
            <EditRequestItem action={action} disabled={isEditMode} />
          </li>
        ))}
      </ul>
    </MenuContainer>
  );
};

export default EditRequests;
