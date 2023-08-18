import React, { FC, PropsWithChildren, useRef, useState } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import { useOnClickOutside } from 'usehooks-ts';

import { FormProvider } from 'react-hook-form';
import styles from './ActionSidebar.module.css';
import Icon from '~shared/Icon';
import { useMobile } from '~hooks';
import Button from '~v5/shared/Button';
import ActionSidebarRow from '../ActionSidebarRow';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import SearchSelect from '~v5/shared/SearchSelect';
import { useActionSidebar, useActionsList } from './hooks';
import { translateAction } from './utils';
import ActionsContent from '../ActionsContent';
import PopularActions from './partials/PopularActions';

const displayName = 'v5.common.ActionSidebar';

const ActionSidebar: FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef(null);
  const [isSidebarFullscreen, setIsSidebarFullscreen] = useState(false);
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { toggleActionSidebarOff, selectedAction, setSelectedAction } =
    useActionSidebarContext();
  const { isSelectVisible, toggleSelect, toggleSelectOff, methods, onSubmit } =
    useActionSidebar(toggleActionSidebarOff);
  const actionsList = useActionsList();

  useOnClickOutside(ref, () => !isMobile && toggleActionSidebarOff());

  return (
    <div
      className={clsx(styles.sidebar, {
        'sm:max-w-[43.375rem]': !isSidebarFullscreen,
        'max-w-full': isSidebarFullscreen,
      })}
      ref={ref}
    >
      <div className="py-4 px-6 flex w-full items-center justify-between border-b border-gray-200">
        {isMobile ? (
          <button
            type="button"
            className={styles.button}
            onClick={toggleActionSidebarOff}
            aria-label={formatMessage({ id: 'ariaLabel.closeModal' })}
          >
            <Icon name="close" appearance={{ size: 'tiny' }} />
          </button>
        ) : (
          <button
            type="button"
            className={styles.button}
            onClick={() => setIsSidebarFullscreen((prevState) => !prevState)}
            aria-label={formatMessage({ id: 'ariaLabel.fullWidth' })}
          >
            <Icon
              name={
                isSidebarFullscreen ? 'arrow-right-line' : 'arrows-out-simple'
              }
              appearance={{ size: 'tiny' }}
            />
          </button>
        )}
        {children}
      </div>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="h-full flex flex-col"
        >
          <div className="px-6 py-8 overflow-scroll h-[40rem]">
            <input
              type="text"
              className={styles.titleInput}
              placeholder={formatMessage({ id: 'placeholder.title' })}
            />
            <ActionSidebarRow
              iconName="file-plus"
              title={{ id: 'actionSidebar.actionType' }}
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
            <ActionsContent />
          </div>
          <div className="mt-auto">
            {!selectedAction && (
              <PopularActions setSelectedAction={setSelectedAction} />
            )}
            <div
              className="flex items-center flex-col-reverse sm:flex-row 
              justify-end gap-2 p-6 border-t border-gray-200"
            >
              <Button
                mode="primaryOutline"
                text={{ id: 'button.cancel' }}
                onClick={toggleActionSidebarOff}
                isFullSize={isMobile}
              />
              <Button
                mode="primarySolid"
                disabled={
                  !selectedAction
                  // || !!Object.keys(methods.formState.errors).length
                }
                text={{ id: 'button.createAction' }}
                isFullSize={isMobile}
                type="submit"
                loading={methods.formState.isSubmitting}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

ActionSidebar.displayName = displayName;

export default ActionSidebar;
