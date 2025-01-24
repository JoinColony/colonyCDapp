import { FilePlus, WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import Modal from '~v5/shared/Modal/index.ts';
import { renderWithBadgesOption } from '~v5/shared/SearchSelect/partials/OptionRenderer/WithBadgesOptionRenderer.tsx';
import SearchSelect from '~v5/shared/SearchSelect/SearchSelect.tsx';

import ActionFormRow from '../ActionFormRow/index.ts';

import { ACTION_TYPE_FIELD_NAME, NON_RESETTABLE_FIELDS } from './consts.ts';
import useActionsList from './hooks/useActionsList.ts';
import { useActiveActionType } from './hooks/useActiveActionType.ts';
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
  const actionType = useActiveActionType();
  const { updateActionSidebarInitialValues } = useActionSidebarContext();
  const {
    field: { onChange },
  } = useController({ name: ACTION_TYPE_FIELD_NAME });
  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isSelectVisible], {
    top: 8,
  });
  const { formState, reset, watch } = useFormContext();
  const { readonly } = useAdditionalFormOptionsContext();

  const defaultValues = NON_RESETTABLE_FIELDS.reduce(
    (acc, fieldName) => ({
      ...acc,
      [fieldName]:
        fieldName === ACTION_TYPE_FIELD_NAME
          ? nextActionType
          : watch(fieldName),
    }),
    {},
  );

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
                'flex text-left text-md transition-colors md:hover:text-blue-400',
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
                renderOption={renderWithBadgesOption}
                items={actionsList}
                onSelect={(action) => {
                  toggleSelectOff();
                  updateActionSidebarInitialValues({
                    [ACTION_TYPE_FIELD_NAME]: action,
                  });

                  if (action === actionType) {
                    return;
                  }

                  const hasMadeChanges = Object.keys(
                    formState.dirtyFields,
                  ).find(
                    (fieldName) =>
                      NON_RESETTABLE_FIELDS.indexOf(fieldName) === -1,
                  );

                  if (hasMadeChanges && actionType) {
                    setNextActionType(action);

                    return;
                  }

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
          reset(defaultValues);
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
