import React, {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { type FieldValues } from 'react-hook-form';

import { DEFAULT_USE_TOGGLE_RETURN_VALUE } from '~hooks/useToggle/consts.ts';
import useToggle from '~hooks/useToggle/index.ts';
import {
  type OnBeforeCloseCallback,
  type UseToggleReturnType,
} from '~hooks/useToggle/types.ts';

import { isElementInsideModalOrPortal } from './utils.ts';

type ActionSidebarToggle = [
  boolean,
  {
    toggle: (actionSidebarInitialValues?: FieldValues) => void;
    toggleOn: (actionSidebarInitialValues?: FieldValues) => void;
    toggleOff: () => void;
    registerContainerRef: (ref: HTMLElement | null) => void;
    useRegisterOnBeforeCloseCallback: (callback: OnBeforeCloseCallback) => void;
  },
];

interface ActionSidebarContextValue {
  actionSidebarToggle: ActionSidebarToggle;
  cancelModalToggle: UseToggleReturnType;
  actionSidebarInitialValues?: FieldValues;
}

export const ActionSidebarContext = createContext<ActionSidebarContextValue>({
  actionSidebarToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
  cancelModalToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
});

export const ActionSidebarContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [actionSidebarInitialValues, setActionSidebarInitialValues] =
    useState<FieldValues>();
  const cancelModalToggle = useToggle();
  const [
    isActionSidebarOpen,
    {
      toggle: toggleActionSidebar,
      toggleOn: toggleActionSidebarOn,
      toggleOff: toggleActionSidebarOff,
      useRegisterOnBeforeCloseCallback:
        actionSidebarUseRegisterOnBeforeCloseCallback,
      registerContainerRef: actionSidebarRegisterContainerRef,
    },
  ] = useToggle();

  actionSidebarUseRegisterOnBeforeCloseCallback((element) => {
    const isClickedInside = isElementInsideModalOrPortal(element);

    if (!isClickedInside) {
      return false;
    }

    return undefined;
  });

  useEffect(() => {
    if (!isActionSidebarOpen) {
      setActionSidebarInitialValues(undefined);
    }
  }, [isActionSidebarOpen]);

  const toggleOn = useCallback(
    (initialValues) => {
      setActionSidebarInitialValues(initialValues);
      // Track the event when the action panel is opened
      return toggleActionSidebarOn();
    },
    [toggleActionSidebarOn],
  );

  const toggleOff = useCallback(() => {
    return toggleActionSidebarOff();
  }, [toggleActionSidebarOff]);

  const toggle = useCallback(
    (initialValues) => {
      if (!isActionSidebarOpen) {
        setActionSidebarInitialValues(initialValues);
      }

      return toggleActionSidebar();
    },
    [isActionSidebarOpen, toggleActionSidebar],
  );

  const value = useMemo<ActionSidebarContextValue>(
    () => ({
      actionSidebarToggle: [
        isActionSidebarOpen,
        {
          toggleOn,
          toggleOff,
          toggle,
          useRegisterOnBeforeCloseCallback:
            actionSidebarUseRegisterOnBeforeCloseCallback,
          registerContainerRef: actionSidebarRegisterContainerRef,
        },
      ],
      cancelModalToggle,
      actionSidebarInitialValues,
    }),
    [
      actionSidebarInitialValues,
      actionSidebarRegisterContainerRef,
      actionSidebarUseRegisterOnBeforeCloseCallback,
      cancelModalToggle,
      isActionSidebarOpen,
      toggle,
      toggleOff,
      toggleOn,
    ],
  );

  return (
    <ActionSidebarContext.Provider {...{ value }}>
      {children}
    </ActionSidebarContext.Provider>
  );
};

export const useActionSidebarContext = () => useContext(ActionSidebarContext);
