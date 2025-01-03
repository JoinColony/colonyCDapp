import { useRef } from 'react';
import { useFormContext, type UseFormReturn } from 'react-hook-form';

import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { type ActionFormProps } from '~shared/Fields/Form/ActionForm.tsx';

const useCloseSidebarClick = () => {
  const formContext = useFormContext();
  const formRef = useRef<UseFormReturn<object>>(null);

  const {
    actionSidebarToggle: [, { toggleOff: toggleActionSidebarOff }],
    cancelModalToggle: [, { toggle: toggleCancelModal }],
  } = useActionSidebarContext();

  const closeSidebarClick = (args: ActionFormProps['onFormClose']) => {
    const { dirtyFields } = (formContext || formRef.current)?.formState ?? {};

    const hasDirtyFields = dirtyFields && Object.keys(dirtyFields).length > 0;
    const shouldShowCancelModal = args?.shouldShowCancelModal ?? true;

    if (hasDirtyFields && shouldShowCancelModal) {
      toggleCancelModal();
    } else {
      toggleActionSidebarOff();
    }
  };

  return { closeSidebarClick, formRef };
};

export default useCloseSidebarClick;
