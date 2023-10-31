import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

import Wallet from '~frame/RouteLayouts/UserNavigation/Wallet';
import { Header } from '~frame/Extensions/layouts';

import WizardSidebar from './WizardSidebar';

interface ColonyCreationFlowContextValues {
  currentStep: number;
  setCurrentStep: (currentStep: number) => void;
}

const ColonyCreationFlowContext = createContext<
  ColonyCreationFlowContextValues | undefined
>(undefined);

export const useColonyCreationFlowContext = () => {
  const context = useContext(ColonyCreationFlowContext);

  if (!context) {
    throw new Error('Could not find ColonyCreationFlowContext');
  }

  return context;
};

const WizardLayout: FC<PropsWithChildren> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const colonyCreationFlowContextValues = useMemo(
    () => ({ currentStep, setCurrentStep }),
    [currentStep, setCurrentStep],
  );

  return (
    <ColonyCreationFlowContext.Provider value={colonyCreationFlowContextValues}>
      <div className="grid grid-cols-[280px,auto] gap-4 p-4">
        <aside className="sticky top-4 h-[calc(100vh-2rem)]">
          <WizardSidebar />
        </aside>
        <div className="">
          <Header />
          <div className="hidden">
            <Wallet />
          </div>
          <main className="mt-9 flex flex-col items-center pb-24">
            {children}
          </main>
        </div>
      </div>
    </ColonyCreationFlowContext.Provider>
  );
};

export default WizardLayout;
