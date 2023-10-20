import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';

import noop from '~utils/noop';

export const SelectedTokenContext = createContext<{
  selectToken: any;
  setSelectToken: (value: any) => void;
}>({ selectToken: {}, setSelectToken: noop });

export const SelectedTokenContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [selectToken, setSelectToken] = useState('');

  const value = useMemo(
    () => ({ selectToken, setSelectToken }),
    [selectToken, setSelectToken],
  );

  console.log(selectToken);

  return (
    <SelectedTokenContext.Provider {...{ value }}>
      {children}
    </SelectedTokenContext.Provider>
  );
};

export const useSelectedTokenContext = () => useContext(SelectedTokenContext);
