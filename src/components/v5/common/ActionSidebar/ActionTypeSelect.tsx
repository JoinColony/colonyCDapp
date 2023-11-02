import React, { FC, useState } from 'react';
import clsx from 'clsx';

import { useController, useFormContext, useWatch } from 'react-hook-form';
import ActionSidebarRow from '../ActionFormRow';
import SearchSelect from '~v5/shared/SearchSelect';
import { useActionsList } from './hooks';
import { translateAction } from './utils';
import useToggle from '~hooks/useToggle';
import { ACTION_TYPE_FIELD_NAME } from './consts';
import { useRelativePortalElement } from '~hooks/useRelativePortalElement';
import { formatText } from '~utils/intl';
import Modal from '~v5/shared/Modal';
import { ActionTypeSelectProps } from './types';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';

const displayName = 'v5.common.ActionTypeSelect';

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
      <ActionSidebarRow
        fieldName={ACTION_TYPE_FIELD_NAME}
        iconName="file-plus"
        title={formatText({ id: 'actionSidebar.actionType' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.actionType',
            }),
          },
        }}
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
                  'text-gray-600': !actionType,
                  'text-gray-900': actionType,
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
                onToggle={toggleSelectOff}
                items={actionsList}
                isOpen={isSelectVisible}
                className="z-[60]"
                onSelect={(action) => {
                  toggleSelectOff();

                  if (action === actionType) {
                    return;
                  }

                  if (Object.keys(formState.dirtyFields).length > 0) {
                    setNextActionType(action);

                    return;
                  }

                  onChange(action);
                }}
              />
            )}
          </>
        )}
      </ActionSidebarRow>
      <Modal
        title={formatText({ id: 'actionSidebar.changeActionModal.title' })}
        subTitle={formatText({
          id: 'actionSidebar.cancelModal.subtitle',
        })}
        isOpen={!!nextActionType}
        onClose={() => setNextActionType(undefined)}
        onConfirm={() => {
          setValue(ACTION_TYPE_FIELD_NAME, nextActionType);
          setNextActionType(undefined);
        }}
        icon="warning-circle"
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
