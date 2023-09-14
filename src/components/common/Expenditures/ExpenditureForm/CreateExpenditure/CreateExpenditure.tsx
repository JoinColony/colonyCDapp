import React from 'react';

import { Tab, TabList, Tabs, TabPanel } from '~shared/Tabs';

import { ExpenditureFormType } from '../types';
import AdvancedPaymentForm from './AdvancedPaymentForm';
import StreamingPaymentForm from './StreamingPaymentForm';

const tabs = [
  { type: ExpenditureFormType.Advanced, label: 'Advanced Payment' },
  { type: ExpenditureFormType.Staged, label: 'Staged Payment' },
  { type: ExpenditureFormType.Streaming, label: 'Streaming Payment' },
];

const CreateExpenditure = () => {
  return (
    <Tabs>
      <TabList>
        {tabs.map(({ type, label }) => (
          <Tab key={type}>{label}</Tab>
        ))}
      </TabList>
      <TabPanel>
        <AdvancedPaymentForm />
      </TabPanel>
      <TabPanel>
        <AdvancedPaymentForm />
      </TabPanel>
      <TabPanel>
        <StreamingPaymentForm />
      </TabPanel>
    </Tabs>
  );
};

export default CreateExpenditure;
