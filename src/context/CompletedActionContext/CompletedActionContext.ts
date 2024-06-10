import { createContext, useContext } from 'react';

export const CompletedActionContext = createContext<{
  showRejectMultiSigStep: boolean;
  setShowRejectMultiSigStep: (showRejectMultiSigStep: boolean) => void;
}>({
  showRejectMultiSigStep: false,
  setShowRejectMultiSigStep: () => {},
});

export const useCompletedActionContext = () => {
  const context = useContext(CompletedActionContext);

  if (!context) {
    throw new Error(
      'This hook must be used within the "CompletedActionContext" provider',
    );
  }

  return context;
};
