import { Extension } from '@colony/colony-js';
import React from 'react';

import { useEnabledExtensions } from '~hooks';
import { Tab, TabList, Tabs, TabPanel } from '~shared/Tabs';

import { ExpenditureFormType } from '../types';

import AdvancedPaymentForm from './AdvancedPaymentForm';
import StagedPaymentForm from './StagedPaymentForm';
import StreamingPaymentForm from './StreamingPaymentForm';

interface TabOption {
  type: ExpenditureFormType;
  label: string;
  extensionId?: Extension;
}

const tabs: TabOption[] = [
  { type: ExpenditureFormType.Advanced, label: 'Advanced Payment' },
  {
    type: ExpenditureFormType.Staged,
    label: 'Staged Payment',
    extensionId: Extension.StagedExpenditure,
  },
  {
    type: ExpenditureFormType.Streaming,
    label: 'Streaming Payment',
    extensionId: Extension.StreamingPayments,
  },
];

const CreateExpenditure = () => {
  const enabledExtensionData = useEnabledExtensions();

  return (
    <Tabs>
      <TabList>
        {tabs.map(({ type, label, extensionId }) => (
          <Tab
            key={type}
            disabled={
              extensionId && !enabledExtensionData[`is${extensionId}Enabled`]
            }
          >
            {label}
          </Tab>
        ))}
      </TabList>
      <TabPanel>
        <AdvancedPaymentForm />
      </TabPanel>
      <TabPanel>
        <StagedPaymentForm />
      </TabPanel>
      <TabPanel>
        <StreamingPaymentForm />
      </TabPanel>
    </Tabs>
  );
};

export default CreateExpenditure;
