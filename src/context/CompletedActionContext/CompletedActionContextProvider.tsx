import React, {
  type FC,
  type PropsWithChildren,
  useMemo,
  useState,
} from 'react';

import { CompletedActionContext } from './CompletedActionContext.ts';

export const CompletedActionProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [showRejectMultiSigStep, setShowRejectMultiSigStep] = useState(false);

  const value = useMemo(
    () => ({
      showRejectMultiSigStep,
      setShowRejectMultiSigStep,
    }),
    [showRejectMultiSigStep, setShowRejectMultiSigStep],
  );

  return (
    <CompletedActionContext.Provider value={value}>
      {children}
    </CompletedActionContext.Provider>
  );
};
