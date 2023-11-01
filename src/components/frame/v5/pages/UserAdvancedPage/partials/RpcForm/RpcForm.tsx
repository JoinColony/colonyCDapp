import React from 'react';

import { Form } from '~shared/Fields';
import SettingsInputRow from '~v5/common/SettingsInputRow';
import SettingsRow from '~v5/common/SettingsRow';
import { useRpcForm } from './hooks';

const RpcForm = () => {
  const {
    customRpc,
    decentralizedModeEnabled,
    handleDecentarlizedOnChange,
    handleSubmit,
    isInputVisible,
    rpcValidationSchema,
  } = useRpcForm();

  return (
    <Form
      validationSchema={rpcValidationSchema}
      defaultValues={{
        decentralizedModeEnabled,
        customRpc,
      }}
      onSubmit={() => {}}
    >
      {() => (
        <div className="border-b border-gray-200">
          <SettingsRow
            title={{ id: 'advancedSettings.rpc.title' }}
            description={{ id: 'advancedSettings.rpc.description' }}
            tooltipMessage={{ id: 'advancedSettings.rpc.tooltip' }}
            id="decentralizedModeEnabled"
            onChange={handleDecentarlizedOnChange}
          />
          <SettingsInputRow
            isOpen={isInputVisible}
            handleSubmit={handleSubmit}
          />
        </div>
      )}
    </Form>
  );
};

export default RpcForm;
