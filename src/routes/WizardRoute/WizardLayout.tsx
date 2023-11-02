import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { defineMessages } from 'react-intl';

import Wallet from '~frame/RouteLayouts/UserNavigation/Wallet';
import { Header } from '~frame/Extensions/layouts';
import { CREATE_USER_ROUTE } from '~routes/routeConstants';

import WizardSidebar from './WizardSidebar';

const displayName = 'routes.WizardRoute.WizardLayout';

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

const MSG = defineMessages({
  sidebarTitle: {
    id: `${displayName}.sidebarTitle`,
    defaultMessage: 'Create your new Colony',
  },
  account: {
    id: `${displayName}.account`,
    defaultMessage: 'Account',
  },
  profile: {
    id: `${displayName}.profile`,
    defaultMessage: 'Profile',
  },
  create: {
    id: `${displayName}.create`,
    defaultMessage: 'Create',
  },
  details: {
    id: `${displayName}.details`,
    defaultMessage: 'Details',
  },
  nativeToken: {
    id: `${displayName}.nativeToken`,
    defaultMessage: 'Native Token',
  },
  confirmation: {
    id: `${displayName}.confirmation`,
    defaultMessage: 'Confirmation',
  },
  complete: {
    id: `${displayName}.complete`,
    defaultMessage: 'Complete',
  },
});

const wizardSteps = [
  {
    itemStep: -1,
    itemText: MSG.account,
    subItems: [
      {
        itemStep: -1,
        itemText: MSG.profile,
      },
    ],
  },
  {
    itemStep: 0,
    itemText: MSG.create,
    subItems: [
      {
        itemStep: 0,
        itemText: MSG.details,
      },
      {
        itemStep: 1,
        itemText: MSG.nativeToken,
      },
      {
        itemStep: 2,
      },
      {
        itemStep: 3,
        itemText: MSG.confirmation,
      },
    ],
  },
  {
    itemStep: 4,
    itemText: MSG.complete,
  },
];

const WizardLayout: FC<PropsWithChildren> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(
    window.location.pathname === CREATE_USER_ROUTE ? -1 : 0,
  );
  const wizardContextValues = useMemo(
    () => ({ currentStep, setCurrentStep }),
    [currentStep, setCurrentStep],
  );

  return (
    <WizardContext.Provider value={wizardContextValues}>
      <div className="grid grid-cols-[280px,auto] gap-4 p-4">
        <aside className="sticky top-4 h-[calc(100vh-2rem)]">
          <WizardSidebar
            wizardSteps={wizardSteps}
            sidebarTitle={MSG.sidebarTitle}
          />
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
    </WizardContext.Provider>
  );
};

export default WizardLayout;
