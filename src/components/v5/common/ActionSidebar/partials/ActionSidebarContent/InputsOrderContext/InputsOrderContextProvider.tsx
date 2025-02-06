import React, {
  type FC,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { TITLE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';

import { InputsOrderContext } from './InputsOrderContext.ts';

const InputsOrderContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [inputsOrder, setInputsOrder] = useState<string[]>([TITLE_FIELD_NAME]);

  const registerInput = useCallback((name: string) => {
    setInputsOrder((prevOrder) => {
      if (!prevOrder.includes(name)) {
        return [...prevOrder, name];
      }
      return prevOrder;
    });
  }, []);
  const unregisterInputs = useCallback(() => {
    setInputsOrder([TITLE_FIELD_NAME]);
  }, []);

  const value = useMemo(
    () => ({
      inputsOrder,
      registerInput,
      unregisterInputs,
    }),
    [inputsOrder, registerInput, unregisterInputs],
  );

  return (
    <InputsOrderContext.Provider value={value}>
      {children}
    </InputsOrderContext.Provider>
  );
};

export default InputsOrderContextProvider;
