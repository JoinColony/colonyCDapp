import React from 'react';
import { SlotKey } from '~hooks';

import { HookForm } from '~shared/Fields';
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
    <HookForm
      validationSchema={rpcValidationSchema}
      defaultValues={{
        [SlotKey.DecentralizedMode]: decentralizedModeEnabled,
        [SlotKey.CustomRPC]: customRpc,
      }}
    >
      {({ register }) => (
        <div className="border-b border-gray-200">
          <SettingsRow
            title={{ id: 'advancedSettings.rpc.title' }}
            description={{ id: 'advancedSettings.rpc.description' }}
            tooltipMessage={{ id: 'advancedSettings.rpc.tooltip' }}
            id={SlotKey.DecentralizedMode}
            onChange={handleDecentarlizedOnChange}
            register={register[SlotKey.DecentralizedMode]}
          />
          <SettingsInputRow
            isOpen={isInputVisible}
            handleSubmit={handleSubmit}
          />
        </div>
      )}
    </HookForm>
  );
};

export default RpcForm;
