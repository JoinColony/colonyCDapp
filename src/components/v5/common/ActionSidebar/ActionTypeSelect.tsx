import { FilePlus, WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, useState } from 'react';
import { useController, useFormContext, useWatch } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import Modal from '~v5/shared/Modal/index.ts';
import SearchSelect from '~v5/shared/SearchSelect/index.ts';

import ActionFormRow from '../ActionFormRow/index.ts';

import {
  ACTION_TYPE_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
} from './consts.ts';
import useActionsList from './hooks/useActionsList.ts';
import { translateAction } from './utils.ts';

const displayName = 'v5.common.ActionTypeSelect';

interface ActionTypeSelectProps {
  className?: string;
}

const ActionTypeSelect: FC<ActionTypeSelectProps> = ({ className }) => {
  const actionsList = useActionsList();
  const [nextActionType, setNextActionType] = useState<string | undefined>(
    undefined,
  );
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
  const { formState, setValue } = useFormContext();
  const { readonly } = useAdditionalFormOptionsContext();

  return (
    <div className={className}>
      <ActionFormRow
        fieldName={ACTION_TYPE_FIELD_NAME}
        icon={FilePlus}
        title={formatText({ id: 'actionSidebar.actionType' })}
        // Disabled to improve user experience
        // tooltips={{
        //   label: {
        //     tooltipContent: formatText({
        //       id: 'actionSidebar.tooltip.actionType',
        //     }),
        //   },
        // }}
      >
        {readonly ? (
          <span className="text-md text-gray-900">
            {formatText({
              id: translateAction(actionType),
            })}
          </span>
        ) : (
          <>
            <button
              type="button"
              ref={relativeElementRef}
              className={clsx(
                'flex text-md transition-colors md:hover:text-blue-400',
                {
                  'text-gray-400': !actionType && !isSelectVisible,
                  'text-gray-900': actionType && !isSelectVisible,
                  'text-blue-400': isSelectVisible,
                },
              )}
              onClick={toggleSelect}
            >
              {formatText({
                id: actionType
                  ? translateAction(actionType)
                  : 'actionSidebar.chooseActionType',
              })}
            </button>
            {isSelectVisible && (
              <SearchSelect
                hideSearchOnMobile
                ref={(ref) => {
                  registerContainerRef(ref);
                  portalElementRef.current = ref;
                }}
                items={actionsList}
                className="z-[60]"
                onSelect={(action) => {
                  toggleSelectOff();

                  if (action === actionType) {
                    return;
                  }

                  if (
                    Object.keys(formState.dirtyFields).length > 0 &&
                    actionType
                  ) {
                    setNextActionType(action);

                    return;
                  }

                  setValue(DECISION_METHOD_FIELD_NAME, undefined);
                  onChange(action);
                }}
              />
            )}
          </>
        )}
      </ActionFormRow>
      <Modal
        title={formatText({ id: 'actionSidebar.changeActionModal.title' })}
        subTitle={formatText({
          id: 'actionSidebar.cancelModal.subtitle',
        })}
        isOpen={!!nextActionType}
        onClose={() => setNextActionType(undefined)}
        onConfirm={() => {
          setValue(ACTION_TYPE_FIELD_NAME, nextActionType);
          setValue(DECISION_METHOD_FIELD_NAME, undefined);
          setNextActionType(undefined);
        }}
        icon={WarningCircle}
        buttonMode="primarySolid"
        confirmMessage={formatText({ id: 'button.changeAction' })}
        closeMessage={formatText({
          id: 'button.continueAction',
        })}
      />
    </div>
  );
};

ActionTypeSelect.displayName = displayName;

export default ActionTypeSelect;
