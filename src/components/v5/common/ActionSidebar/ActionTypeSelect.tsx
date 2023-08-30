import React, { FC, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useOnClickOutside } from 'usehooks-ts';

import { useMobile } from '~hooks';
import ActionSidebarRow from '../ActionSidebarRow';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import SearchSelect from '~v5/shared/SearchSelect';
import { useActionsList } from './hooks';
import { translateAction } from './utils';
import useToggle from '~hooks/useToggle';
import { ActionSidebarRowFieldNameEnum } from '../ActionSidebarRow/enums';

const displayName = 'v5.common.ActionTypeSelect';

const ActionTypeSelect: FC = () => {
  const ref = useRef(null);
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { toggleActionSidebarOff, selectedAction, isCancelModalOpen } =
    useActionSidebarContext();
  const actionsList = useActionsList();
  const [
    isSelectVisible,
    { toggle: toggleSelect, toggleOff: toggleSelectOff },
  ] = useToggle();

  useOnClickOutside(
    ref,
    () => !isMobile && !isCancelModalOpen && toggleActionSidebarOff(),
  );

  return (
    <ActionSidebarRow
      iconName="file-plus"
      title={{ id: 'actionSidebar.actionType' }}
      fieldName={ActionSidebarRowFieldNameEnum.ACTION_TYPE}
    >
      <>
        {!selectedAction && (
          <>
            <button
              type="button"
              className="flex text-md text-gray-600 transition-colors hover:text-blue-400"
              onClick={toggleSelect}
            >
              {formatMessage({
                id: 'actionSidebar.chooseActionType',
              })}
            </button>
            {isSelectVisible && (
              <SearchSelect
                onToggle={toggleSelectOff}
                items={actionsList}
                isOpen={isSelectVisible}
              />
            )}
          </>
        )}
        {selectedAction && (
          <span className="text-md">
            {formatMessage({ id: translateAction(selectedAction) })}
          </span>
        )}
      </>
    </ActionSidebarRow>
  );
};

ActionTypeSelect.displayName = displayName;

export default ActionTypeSelect;
