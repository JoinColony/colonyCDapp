import { ComponentProps, ComponentType, useContext } from 'react';

import { DialogContext } from './DialogProvider';

const useDialogContext = <N extends ComponentType<any>>(component: N) => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('This hook must be used within a "DialogContext" provider');
  }

  return (props?: Omit<ComponentProps<N>, 'close' | 'cancel'>) => {
    if (!context.openDialog) {
      throw new Error('Could not find DialogContext');
    }
    return context.openDialog(component, props);
  };
};

export default useDialogContext;
