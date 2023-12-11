import React from 'react';

import { Form } from '~shared/Fields';
import noop from '~utils/noop';
import SettingsRow from '~v5/common/SettingsRow';
import { METATRANSACTIONS_VALIDATION_SCHEMA } from './consts';
import { useFeesForm } from './hooks';

const FeesForm = () => {
  const { metatransactionsDefault, setFormRef, loading } = useFeesForm();

  return (
    <Form
      ref={setFormRef}
      options={{
        readonly: loading,
      }}
      validationSchema={METATRANSACTIONS_VALIDATION_SCHEMA}
      defaultValues={{
        metatransactionsEnabled: !!metatransactionsDefault,
      }}
      onSubmit={noop}
    >
      <SettingsRow
        title={{ id: 'advancedSettings.fees.title' }}
        description={{ id: 'advancedSettings.fees.description' }}
        tooltipMessage={{ id: 'advancedSettings.fees.tooltip' }}
        name="metatransactionsEnabled"
        className="pt-0"
      />
    </Form>
  );
};

export default FeesForm;
