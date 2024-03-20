import React from 'react';

import { Form } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';
import noop from '~utils/noop.ts';
import SettingsInputRow from '~v5/common/SettingsInputRow/index.ts';
import SettingsRow from '~v5/common/SettingsRow/index.ts';

import { useRpcForm } from './hooks.ts';

const RpcForm = () => {
  const {
    customRpc,
    decentralizedModeEnabled,
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
      onSubmit={noop}
    >
      {() => (
        <>
          <SettingsRow
            title={{ id: 'advancedSettings.rpc.title' }}
            description={{ id: 'advancedSettings.rpc.description' }}
            tooltipMessage={{ id: 'advancedSettings.rpc.tooltip' }}
            name="decentralizedModeEnabled"
            className="items-end pt-0"
            titleClassName="!font-semibold !text-lg"
            additionalContent={formatText({ id: 'profilePage.customRpc' })}
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
