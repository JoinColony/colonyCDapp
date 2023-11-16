import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

interface WizardContextValues {
  currentStep: number;
  setCurrentStep: (currentStep: number) => void;
}

const WizardContext = createContext<WizardContextValues | undefined>(undefined);

export const useWizardContext = () => {
  const context = useContext(WizardContext);

  if (!context) {
    throw new Error('Could not find WizardContext');
  }

  return context;
};

const WizardContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const wizardContextValues = useMemo(
    () => ({ currentStep, setCurrentStep }),
    [currentStep, setCurrentStep],
  );

  return (
    <WizardContext.Provider value={wizardContextValues}>
      {children}
    </WizardContext.Provider>
  );
};
export default WizardContextProvider;
