import React, { useEffect, type FC, type PropsWithChildren } from 'react';

import { useInputsOrderContext } from '../InputsOrderContext/InputsOrderContext.ts';

const InputsOrderCellWrapper: FC<PropsWithChildren<{ fieldName: string }>> = ({
  children,
  fieldName,
}) => {
  const { registerInput } = useInputsOrderContext();

  useEffect(() => {
    registerInput(fieldName);
  }, [fieldName, registerInput]);
  return <>{children}</>;
};

export default InputsOrderCellWrapper;
