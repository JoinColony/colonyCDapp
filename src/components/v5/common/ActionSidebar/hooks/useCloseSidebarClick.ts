import { useRef } from 'react';

import { useFormContext, UseFormReturn } from 'react-hook-form';
import { useActionSidebarContext } from '~context/ActionSidebarContext';

export const useCloseSidebarClick = () => {
  const formContext = useFormContext();
  const formRef = useRef<UseFormReturn<object>>(null);
  const {
    actionSidebarToggle: [, { toggleOff: toggleActionSidebarOff }],
    cancelModalToggle: [, { toggle: toggleCancelModal }],
  } = useActionSidebarContext();

  return {
    closeSidebarClick: () => {
      const { dirtyFields } = (formContext || formRef.current)?.formState || {};

      if (Object.keys(dirtyFields).length > 0) {
        toggleCancelModal();
      } else {
        toggleActionSidebarOff();
      }
    },
    formRef,
  };
};
