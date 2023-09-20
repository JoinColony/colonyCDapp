import React, { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useController, useWatch } from 'react-hook-form';
import ActionSidebarRow from '../ActionFormRow';
import SearchSelect from '~v5/shared/SearchSelect';
import { useActionsList } from './hooks';
import { translateAction } from './utils';
import useToggle from '~hooks/useToggle';
import { ACTION_TYPE_FIELD_NAME } from './consts';
import { useRelativePortalElement } from '~hooks/useRelativePortalElement';

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
  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isSelectVisible]);

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
              ref={relativeElementRef}
              className="flex text-md text-gray-600 transition-colors hover:text-blue-400"
              onClick={toggleSelect}
            >
              {intl.formatMessage({
                id: 'actionSidebar.chooseActionType',
              })}
            </button>
            {isSelectVisible && (
              <SearchSelect
                hideSearch
                ref={(ref) => {
                  registerContainerRef(ref);
                  portalElementRef.current = ref;
                }}
                onToggle={toggleSelectOff}
                items={actionsList}
                isOpen={isSelectVisible}
                className="z-[100]"
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
