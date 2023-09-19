import React, { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useController, useWatch } from 'react-hook-form';
import ActionSidebarRow from '../ActionFormRow';
import SearchSelect from '~v5/shared/SearchSelect';
import { useActionsList } from './hooks';
import { translateAction } from './utils';
import useToggle from '~hooks/useToggle';
import { ACTION_TYPE_FIELD_NAME } from './consts';

const displayName = 'v5.common.ActionTypeSelect';

const ActionTypeSelect: FC = () => {
  const intl = useIntl();
  const actionsList = useActionsList();
  const [
    isSelectVisible,
    { toggle: toggleSelect, toggleOff: toggleSelectOff, registerContainerRef },
  ] = useToggle();
  const actionType = useWatch({ name: ACTION_TYPE_FIELD_NAME });
  const {
    field: { onChange },
  } = useController({ name: ACTION_TYPE_FIELD_NAME });

  return (
    <ActionSidebarRow
      fieldName={ACTION_TYPE_FIELD_NAME}
      iconName="file-plus"
      title={intl.formatMessage({ id: 'actionSidebar.actionType' })}
      tooltip={<FormattedMessage id="actionSidebar.toolip.actionType" />}
    >
      <>
        {actionType ? (
          <span className="text-md">
            {intl.formatMessage({ id: translateAction(actionType) })}
          </span>
        ) : (
          <>
            <button
              type="button"
              className="flex text-md text-gray-600 transition-colors hover:text-blue-400"
              onClick={toggleSelect}
            >
              {intl.formatMessage({
                id: 'actionSidebar.chooseActionType',
              })}
            </button>
            {isSelectVisible && (
              <SearchSelect
                ref={registerContainerRef}
                onToggle={toggleSelectOff}
                items={actionsList}
                isOpen={isSelectVisible}
                className="h-[85vh] sm:h-[60vh]"
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
