import React, {
  type FC,
  type PropsWithChildren,
  useMemo,
  useState,
} from 'react';

import { PageHeadingContext } from './PageHeadingContext.ts';

const PageHeadingContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [title, setTitle] = useState<string | undefined>(undefined);

  const value = useMemo(
    () => ({
      title,
      setTitle,
    }),
    [title],
  );

  return (
    <PageHeadingContext.Provider value={value}>
      {children}
    </PageHeadingContext.Provider>
  );
};

export default PageHeadingContextProvider;
