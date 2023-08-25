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
}>({ formErrors: {}, changeFormErrorsState: noop });

export const ActionFormContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [formErrors, setFormErrors] = useState<Record<any, any>>();

  const changeFormErrorsState = useCallback(
    (errors) => {
      setFormErrors?.(errors);
    },
    [setFormErrors],
  );

  const value = useMemo(
    () => ({ formErrors, changeFormErrorsState }),
    [formErrors, changeFormErrorsState],
  );

  return (
    <ActionFormContext.Provider {...{ value }}>
      {children}
    </ActionFormContext.Provider>
  );
};

export const useActionFormContext = () => useContext(ActionFormContext);
