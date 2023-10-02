import React, { FC } from 'react';

import { useController, useWatch } from 'react-hook-form';
import ActionSidebarRow from '../ActionFormRow';
import SearchSelect from '~v5/shared/SearchSelect';
import { useActionsList } from './hooks';
import { translateAction } from './utils';
import useToggle from '~hooks/useToggle';
import { ACTION_TYPE_FIELD_NAME } from './consts';
import { useRelativePortalElement } from '~hooks/useRelativePortalElement';
import { formatText } from '~utils/intl';

const displayName = 'v5.common.ActionTypeSelect';

const ActionTypeSelect: FC = () => {
  const actionsList = useActionsList();
  const [
    isSelectVisible,
    { toggle: toggleSelect, toggleOff: toggleSelectOff, registerContainerRef },
  ] = useToggle();
  const actionType = useWatch({ name: ACTION_TYPE_FIELD_NAME });
  const {
    field: { onChange },
  } = useController({ name: ACTION_TYPE_FIELD_NAME });
  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isSelectVisible]);

  return (
    <ActionSidebarRow
      fieldName={ACTION_TYPE_FIELD_NAME}
      iconName="file-plus"
      title={formatText({ id: 'actionSidebar.actionType' })}
      tooltip={formatText({ id: 'actionSidebar.toolip.actionType' })}
    >
      <>
        {actionType ? (
          <span className="text-md">
            {formatText({ id: translateAction(actionType) })}
          </span>
        ) : (
          <>
            <button
              type="button"
              ref={relativeElementRef}
              className="flex text-md text-gray-600 transition-colors hover:text-blue-400"
              onClick={toggleSelect}
            >
              {formatText({
                id: 'actionSidebar.chooseActionType',
              })}
            </button>
            {isSelectVisible && (
              <SearchSelect
                hideSearchOnMobile
                ref={(ref) => {
                  registerContainerRef(ref);
                  portalElementRef.current = ref;
                }}
                onToggle={toggleSelectOff}
                items={actionsList}
                isOpen={isSelectVisible}
                className="z-[60]"
                onSelect={onChange}
              />
            )}
          </>
        )}
      </>
    </ActionSidebarRow>
  );
};

ActionTypeSelect.displayName = displayName;

export default ActionTypeSelect;
