import { noop } from 'lodash';
import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export const ActionFormContext = createContext<{
  formErrors?: Record<any, any>;
  changeFormErrorsState: (data) => void;
  isSubmitting: boolean;
  changeFormSubmitting: (submitting: boolean) => void;
}>({
  formErrors: {},
  changeFormErrorsState: noop,
  isSubmitting: false,
  changeFormSubmitting: noop,
});

export const ActionFormContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [formErrors, setFormErrors] = useState<Record<any, any>>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const changeFormErrorsState = useCallback(
    (errors) => {
      setFormErrors?.(errors);
    },
    [setFormErrors],
  );

  const changeFormSubmitting = useCallback(
    (submitting) => {
      setIsSubmitting?.(submitting);
    },
    [setIsSubmitting],
  );

  const value = useMemo(
    () => ({
      formErrors,
      changeFormErrorsState,
      isSubmitting,
      changeFormSubmitting,
    }),
    [formErrors, changeFormErrorsState, isSubmitting, changeFormSubmitting],
  );

  return (
    <ActionFormContext.Provider {...{ value }}>
      {children}
    </ActionFormContext.Provider>
  );
};

export const useActionFormContext = () => useContext(ActionFormContext);
