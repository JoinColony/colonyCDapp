import React from 'react';

import { Tab, TabList, Tabs, TabPanel } from '~shared/Tabs';

import { ExpenditureFormType } from '../types';
import AdvancedPaymentForm from './AdvancedPaymentForm';
import StreamingPaymentForm from './StreamingPaymentForm';
import StagedPaymentForm from './StagedPaymentForm';

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
        <StagedPaymentForm />
      </TabPanel>
      <TabPanel>
        <StreamingPaymentForm />
      </TabPanel>
    </Tabs>
  );
};

export default CreateExpenditure;
