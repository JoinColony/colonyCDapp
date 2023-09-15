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
  isRecipientNotVerified: boolean;
  onChangeRecipientVerification: (isVerified: boolean) => void;
}>({
  formErrors: {},
  changeFormErrorsState: noop,
  isSubmitting: false,
  changeFormSubmitting: noop,
  isRecipientNotVerified: false,
  onChangeRecipientVerification: noop,
});

export const ActionFormContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [formErrors, setFormErrors] = useState<Record<any, any>>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRecipientNotVerified, setIsRecipientNotVerified] =
    useState<boolean>(false);

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

  const onChangeRecipientVerification = useCallback(
    (isVerified) => {
      setIsRecipientNotVerified?.(isVerified);
    },
    [setIsRecipientNotVerified],
  );

  const value = useMemo(
    () => ({
      formErrors,
      changeFormErrorsState,
      isSubmitting,
      changeFormSubmitting,
      isRecipientNotVerified,
      onChangeRecipientVerification,
    }),
    [
      formErrors,
      changeFormErrorsState,
      isSubmitting,
      changeFormSubmitting,
      isRecipientNotVerified,
      onChangeRecipientVerification,
    ],
  );

  return (
    <ActionFormContext.Provider {...{ value }}>
      {children}
    </ActionFormContext.Provider>
  );
};

export const useActionFormContext = () => useContext(ActionFormContext);
