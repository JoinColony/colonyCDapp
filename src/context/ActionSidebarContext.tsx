import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FieldValues } from 'react-hook-form';
import useToggle from '~hooks/useToggle';
import { DEFAULT_USE_TOGGLE_RETURN_VALUE } from '~hooks/useToggle/consts';
import {
  OnBeforeCloseCallback,
  UseToggleReturnType,
} from '~hooks/useToggle/types';
import { getPortalContainer } from '~v5/shared/Portal/utils';

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
    const reactModalPortals = Array.from(
      document.querySelectorAll('.ReactModalPortal'),
    );

    // Element inside the modal or in the portal container
    if (
      getPortalContainer().contains(element) ||
      reactModalPortals.some((portal) => portal.contains(element))
    ) {
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
