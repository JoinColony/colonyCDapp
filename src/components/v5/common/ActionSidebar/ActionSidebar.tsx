import React, { FC, PropsWithChildren, useRef, useState } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import { useOnClickOutside } from 'usehooks-ts';

import styles from './ActionSidebar.module.css';
import Icon from '~shared/Icon';
import { useMobile } from '~hooks';
import ActionSidebarRow from '../ActionSidebarRow';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import SearchSelect from '~v5/shared/SearchSelect';
import { useActionsList, useUserPermissionsErrors } from './hooks';
import { translateAction } from './utils';
import ActionsContent from '../ActionsContent';
import PopularActions from './partials/PopularActions';
import useToggle from '~hooks/useToggle';
import SinglePaymentForm from './partials/SinglePaymentForm';
import MintTokenForm from './partials/MintTokenForm';
import { Actions } from '~constants/actions';
import ActionButtons from './partials/ActionButtons';
import ErrorBanner from './partials/ErrorBanner';

const displayName = 'v5.common.ActionSidebar';

const ActionSidebar: FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef(null);
  const [isSidebarFullscreen, setIsSidebarFullscreen] = useState(false);
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { toggleActionSidebarOff, selectedAction, setSelectedAction } =
    useActionSidebarContext();
  const actionsList = useActionsList();
  const [
    isSelectVisible,
    { toggle: toggleSelect, toggleOff: toggleSelectOff },
  ] = useToggle();
  const isUserHasPermission = useUserPermissionsErrors();

  useOnClickOutside(ref, () => !isMobile && toggleActionSidebarOff());

  const formContent = (
    <>
      <div className="px-6 py-8 overflow-scroll h-[40rem]">
        <input
          type="text"
          className={styles.titleInput}
          placeholder={formatMessage({ id: 'placeholder.title' })}
        />
        {isUserHasPermission && selectedAction && (
          <ErrorBanner
            title={{ id: 'actionSidebar.mint.token.permission.error' }}
          />
        )}
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
        <ActionButtons isActionDisabled={isUserHasPermission} />
      </div>
    </>
  );

  const prepareFormContent = () => {
    if (selectedAction === Actions.SIMPLE_PAYMENT) {
      return <SinglePaymentForm>{formContent}</SinglePaymentForm>;
    }
    if (selectedAction === Actions.MINT_TOKENS) {
      return <MintTokenForm>{formContent}</MintTokenForm>;
    }
    return formContent;
  };

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
      {prepareFormContent()}
    </div>
  );
};

ActionSidebar.displayName = displayName;

export default ActionSidebar;
