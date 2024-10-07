import { FilePlus } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';
import { usePopperTooltip } from 'react-popper-tooltip';

import { type CoreAction } from '~actions/index.ts';
import { getActionName } from '~actions/utils.ts';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import { formatText } from '~utils/intl.ts';
import SearchSelectPopover from '~v5/shared/SearchSelect/SearchSelectPopover.tsx';

import ActionFormRow from '../ActionFormRow/index.ts';

import { ACTION_TYPE_FIELD_NAME } from './consts.ts';
import useActionsList from './hooks/useActionsList.ts';

const displayName = 'v5.common.ActionTypeSelect';

const MSG = defineMessages({
  chooseActionType: {
    id: `${displayName}.chooseActionType`,
    defaultMessage: 'Choose action type',
  },
});

interface ActionTypeSelectProps {
  className?: string;
  selectedAction?: CoreAction;
  onSelect: (actionType: CoreAction) => void;
}

const ActionTypeSelect: FC<ActionTypeSelectProps> = ({
  className,
  selectedAction,
  onSelect,
}) => {
  // FIXME: this needs to be from the available actions
  const actionsList = useActionsList();
  const { readonly } = useAdditionalFormOptionsContext();

  const { getTooltipProps, setTooltipRef, setTriggerRef, triggerRef, visible } =
    usePopperTooltip({
      placement: 'bottom-start',
      trigger: ['click'],
      interactive: true,
      closeOnOutsideClick: true,
    });

  const actionName = selectedAction ? getActionName(selectedAction) : undefined;

  return (
    <div className={className}>
      <ActionFormRow
        fieldName={ACTION_TYPE_FIELD_NAME}
        icon={FilePlus}
        title={formatText({ id: 'actionSidebar.actionType' })}
      >
        {readonly && actionName ? (
          <span className="text-md text-gray-900">
            {formatText(actionName)}
          </span>
        ) : (
          <>
            <button
              type="button"
              ref={setTriggerRef}
              className={clsx(
                'flex text-left text-md transition-colors md:hover:text-blue-400',
                {
                  'text-gray-400': !selectedAction && !visible,
                  'text-gray-900': selectedAction && !visible,
                  'text-blue-400': visible,
                },
              )}
            >
              {formatText(actionName || MSG.chooseActionType)}
            </button>
            {visible && (
              <SearchSelectPopover
                items={actionsList}
                hideSearchOnMobile
                onSelect={onSelect}
                setTooltipRef={setTooltipRef}
                tooltipProps={getTooltipProps}
                triggerRef={triggerRef}
              />
            )}
          </>
        )}
      </ActionFormRow>
    </div>
  );
};

ActionTypeSelect.displayName = displayName;

export default ActionTypeSelect;
