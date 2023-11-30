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
        <>
          <SettingsRow
            title={{ id: 'advancedSettings.rpc.title' }}
            description={{ id: 'advancedSettings.rpc.description' }}
            tooltipMessage={{ id: 'advancedSettings.rpc.tooltip' }}
            id="decentralizedModeEnabled"
            handleOnChange={handleDecentarlizedOnChange}
          />
          <SettingsInputRow
            isOpen={isInputVisible}
            handleSubmit={handleSubmit}
          />
        </>
      )}
    </Form>
  );
};

export default RpcForm;
