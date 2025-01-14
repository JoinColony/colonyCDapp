import React from 'react';

import { Form } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';
import { noop } from '~utils/noop.ts';
import SettingsInputRow from '~v5/common/SettingsInputRow/index.ts';
import SettingsRow from '~v5/common/SettingsRow/index.ts';

import { useRpcForm } from './hooks.ts';

// @TODO this needs to be refactored and we need to build a custom toggle button that will show up the input
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
        <SettingsRow.Container>
          <SettingsRow.Content>
            <div className="flex items-center gap-1.5">
              <SettingsRow.Title>
                {formatText({ id: 'advancedSettings.rpc.title' })}
              </SettingsRow.Title>
              <SettingsRow.Tooltip>
                {formatText({ id: 'advancedSettings.rpc.tooltip' })}
              </SettingsRow.Tooltip>
            </div>
            <SettingsRow.Description>
              {formatText({ id: 'advancedSettings.rpc.description' })}
            </SettingsRow.Description>
          </SettingsRow.Content>
          <SettingsRow.Content>
            <SettingsRow.Subtitle>
              {formatText({ id: 'profilePage.customRpc' })}
            </SettingsRow.Subtitle>
          </SettingsRow.Content>
          <SettingsInputRow
            isOpen={isInputVisible}
            handleSubmit={handleSubmit}
          />
        </SettingsRow.Container>
      )}
    </Form>
  );
};

export default RpcForm;
