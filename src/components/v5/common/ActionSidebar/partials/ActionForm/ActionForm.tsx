import React, { FC, PropsWithChildren } from 'react';
import { FormProvider } from 'react-hook-form';
import { useIntl } from 'react-intl';

import { ActionFormProps } from './types';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import Modal from '~v5/shared/Modal';

const displayName = 'v5.common.ActionSidebar.partials.ActionForm';

const ActionForm: FC<PropsWithChildren<ActionFormProps>> = ({
  children,
  useActionHook,
}) => {
  const { methods, onSubmit } = useActionHook();
  const { formatMessage } = useIntl();
  const { isCancelModalOpen, toggleCancelModalOff, toggleActionSidebarOff } =
    useActionSidebarContext();

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="h-full flex flex-col"
      >
        {children}
      </form>
      <Modal
        title={formatMessage({ id: 'actionSidebar.cancelModal.title' })}
        subTitle={formatMessage({
          id: 'actionSidebar.cancelModal.subtitle',
        })}
        isOpen={isCancelModalOpen}
        onClose={toggleCancelModalOff}
        onConfirm={() => {
          toggleCancelModalOff();
          toggleActionSidebarOff();
        }}
        icon="warning-circle"
        buttonMode="primarySolid"
        confirmMessage={formatMessage({ id: 'button.cancelAction' })}
        closeMessage={formatMessage({
          id: 'button.continueAction',
        })}
      />
    </FormProvider>
  );
};

ActionForm.displayName = displayName;

export default ActionForm;
