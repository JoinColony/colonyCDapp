import { FilePlus } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';
import { usePopperTooltip } from 'react-popper-tooltip';

import { type Action } from '~constants/actions.ts';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import { formatText } from '~utils/intl.ts';
import SearchSelectPopover from '~v5/shared/SearchSelect/SearchSelectPopover.tsx';

import ActionFormRow from '../ActionFormRow/index.ts';

import useActionsList from './hooks/useActionsList.ts';
import { translateAction } from './utils.ts';

const displayName = 'v5.common.ActionTypeSelect';

const MSG = defineMessages({
  chooseActionType: {
    id: `${displayName}.chooseActionType`,
    defaultMessage: 'Choose action type',
  },
});

interface ActionTypeSelectProps {
  className?: string;
  // Maybe the form can just know this from the form context?
  action?: Action;
  onSelect: (actionType: Action) => void;
}

const ActionTypeSelect: FC<ActionTypeSelectProps> = ({
  className,
  action,
  onSelect,
}) => {
  const actionsList = useActionsList();
  const { readonly } = useAdditionalFormOptionsContext();

  const { getTooltipProps, setTooltipRef, setTriggerRef, triggerRef, visible } =
    usePopperTooltip({
      placement: 'bottom-start',
      trigger: ['click'],
      interactive: true,
      closeOnOutsideClick: true,
    });

  return (
    <div className={className}>
      <ActionFormRow
        icon={FilePlus}
        title={formatText({ id: 'actionSidebar.actionType' })}
      >
        {readonly && action ? (
          <span className="text-md text-gray-900">
            {translateAction(action)}
          </span>
        ) : (
          <>
            <button
              type="button"
              ref={setTriggerRef}
              className={clsx(
                'flex text-left text-md transition-colors md:hover:text-blue-400',
                {
                  'text-gray-400': !action && !visible,
                  'text-gray-900': action && !visible,
                  'text-blue-400': visible,
                },
              )}
            >
              {formatText(
                action
                  ? {
                      id: translateAction(action),
                    }
                  : MSG.chooseActionType,
              )}
            </button>
            {visible && (
              <SearchSelectPopover
                items={actionsList}
                hideSearchOnMobile
                // FIXME: We might need to update the action sidebar initial values on select?
                // See https://github.com/JoinColony/colonyCDapp/blob/76626dd9fc3ef778bc39f631dc25241f8cd8413c/src/components/v5/common/ActionSidebar/ActionTypeSelect.tsx#L113-L115
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
