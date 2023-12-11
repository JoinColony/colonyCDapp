import React from 'react';

import { Form } from '~shared/Fields';
import { formatText } from '~utils/intl';
import noop from '~utils/noop';
import SettingsInputRow from '~v5/common/SettingsInputRow';
import SettingsRow from '~v5/common/SettingsRow';

import { useRpcForm } from './hooks';

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
            className="pt-0 items-end"
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
