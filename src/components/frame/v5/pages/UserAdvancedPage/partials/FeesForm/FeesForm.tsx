import React from 'react';

import { Form } from '~shared/Fields';
import SettingsRow from '~v5/common/SettingsRow';
import { useFeesForm } from './hooks';

const FeesForm = () => {
  const {
    handleFeesOnChange,
    handleSubmit,
    metatransactionsValidationSchema,
    metatransasctionsDefault,
  } = useFeesForm();

  return (
    <Form
      validationSchema={metatransactionsValidationSchema}
      defaultValues={{
        metatransactionsEnabled: !!metatransasctionsDefault,
      }}
      onSubmit={handleSubmit}
    >
      {({ register }) => (
        <SettingsRow
          title={{ id: 'advancedSettings.fees.title' }}
          description={{ id: 'advancedSettings.fees.description' }}
          tooltipMessage={{ id: 'advancedSettings.fees.tooltip' }}
          id="metatransactionsEnabled"
          onChange={handleFeesOnChange}
          register={register}
        />
      )}
    </Form>
  );
};

export default FeesForm;
