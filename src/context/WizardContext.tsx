import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { CREATE_PROFILE_ROUTE } from '~routes/routeConstants';

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
  const [currentStep, setCurrentStep] = useState(
    // @NOTE: With the create user step not being directly integrated into the colony creation flow,
    // I had to add this hack to make sure the wizard sidebar starts at the correct step
    window.location.pathname === CREATE_PROFILE_ROUTE ? -1 : 0,
  );
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
