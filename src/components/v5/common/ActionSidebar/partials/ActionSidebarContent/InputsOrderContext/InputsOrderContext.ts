import { createContext, useContext } from 'react';

export interface InputsOrderContextValue {
  inputsOrder: string[];
  unregisterInputs: () => void;
  registerInput: (name: string) => void;
}

export const InputsOrderContext = createContext<
  InputsOrderContextValue | undefined
>(undefined);

export const useInputsOrderContext = () => {
  const context = useContext(InputsOrderContext);
  if (context === undefined) {
    throw new Error(
      'useInputsOrderContext must be used within the InputOrderContextProvider',
    );
  }
  return context;
};
