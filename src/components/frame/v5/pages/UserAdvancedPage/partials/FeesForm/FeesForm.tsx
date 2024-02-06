import React from 'react';

import { Form } from '~shared/Fields/index.ts';
import noop from '~utils/noop.ts';
import SettingsRow from '~v5/common/SettingsRow/index.ts';

import { METATRANSACTIONS_VALIDATION_SCHEMA } from './consts.ts';
import { useFeesForm } from './hooks.tsx';

const FeesForm = () => {
  const { metatransactionsDefault, setFormRef, loading } = useFeesForm();

  return (
    <Form
      innerRef={setFormRef}
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
