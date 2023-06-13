import React, { ReactElement } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import { useFormContext } from 'react-hook-form';

import { HookFormToggle as Toggle } from '~shared/Fields';
import QuestionMarkTooltip from '~shared/QuestionMarkTooltip';
import { UniversalMessageValues } from '~types';
import { SlotKey } from '~hooks';

import CustomEndpointInput from './CustomEndpointInput';

import styles from './AdvancedSettingsRow.css';

const displayName = 'common.UserProfileEdit.AdvancedSettingsRow';

const MSG = defineMessages({
  metaDescription: {
    id: `${displayName}.metaDescription`,
    defaultMessage: `To connect directly to Gnosis chain and pay for your own transactions, disable this option.`,
  },
  metaDescGlobalOff: {
    id: `${displayName}.metaDescGlobalOff`,
    defaultMessage: `Metatransactions are disabled globally.`,
  },
  labelMetaTx: {
    id: `${displayName}.labelMetaTx`,
    defaultMessage: `Metatransactions ({isOn, select,
      true {active}
      other {inactive}
    })`,
  },
  metaTooltip: {
    id: `${displayName}.metaTooltip`,
    defaultMessage: `Metatransactions are turned on by default.
    If you would rather connect directly to the chain,
    and pay for your own transactions, you can turn them off
    by switching the toggle at any time. {br}{br} Please note,
    this setting is stored locally in your browser,
    if you clear your cache you will need to turn Metatransactions off again.`,
  },
  customEndpoints: {
    id: `${displayName}.customEndpoints`,
    defaultMessage: `Enable custom endpoints ({isOn, select,
      true {active}
      other {inactive}
    })`,
  },
  endpointsDescription: {
    id: `${displayName}.metaDescription`,
    defaultMessage: `If you prefer maximum decentralisation, you may use your own custom endpoints for Colony.`,
  },
  labelRPC: {
    id: `${displayName}.labelRPC`,
    defaultMessage: 'Gnosis Chain RPC',
  },
  RPCTooltip: {
    id: `${displayName}.RPCTooltip`,
    defaultMessage: `You will be able to toggle the Gnosis Chain RPC on once you have successfully validated that the endpoint works.`,
  },
});

interface MetatransactionsDisabledProps {
  metatransactionsDisabled: boolean;
}

const MetatransactionsDisabled = ({
  metatransactionsDisabled,
}: MetatransactionsDisabledProps) =>
  metatransactionsDisabled ? (
    <div className={styles.metaDesc}>
      <FormattedMessage {...MSG.metaDescGlobalOff} />
    </div>
  ) : null;

export const getAdvancedSettingsRows = (
  metatransactionsAvailable: boolean,
): Omit<SettingsRowProps, 'toggleDisabled'>[] => [
  {
    name: SlotKey.Metatransactions,
    paragraphText: MSG.metaDescription,
    toggleLabel: MSG.labelMetaTx,
    tooltipText: MSG.metaTooltip,
    tooltipTextValues: { br: <br /> },
    extra: (
      <MetatransactionsDisabled
        metatransactionsDisabled={!metatransactionsAvailable}
      />
    ),
  },
  {
    name: SlotKey.DecentralizedMode,
    paragraphText: MSG.endpointsDescription,
    toggleLabel: MSG.customEndpoints,
    tooltipText: MSG.RPCTooltip,
    extra: (
      <CustomEndpointInput
        label={MSG.labelRPC}
        inputName={SlotKey.CustomRPC}
        toggleName={SlotKey.DecentralizedMode}
      />
    ),
  },
];

interface SettingsRowProps {
  extra: ReactElement;
  paragraphText: MessageDescriptor;
  name: string;
  toggleDisabled: boolean;
  toggleLabel: MessageDescriptor;
  tooltipText: MessageDescriptor;
  tooltipTextValues?: UniversalMessageValues;
}

const AdvancedSettingsRow = ({
  extra,
  name,
  paragraphText,
  toggleDisabled: disabled,
  toggleLabel,
  tooltipText,
  tooltipTextValues,
}: SettingsRowProps) => {
  const { trigger, watch } = useFormContext();
  const value: boolean = watch(name);
  return (
    <div className={styles.main}>
      <div className={styles.toggleContainer}>
        <Toggle
          label={toggleLabel}
          labelValues={{ isOn: value }}
          name={name}
          disabled={disabled}
          onChange={() => trigger()}
        />
        <QuestionMarkTooltip
          tooltipText={tooltipText}
          tooltipTextValues={tooltipTextValues}
          className={styles.tooltipContainer}
          tooltipClassName={styles.tooltipContent}
          tooltipPopperOptions={{
            placement: 'right',
          }}
        />
      </div>
      <p className={styles.descriptions}>
        <FormattedMessage {...paragraphText} />
      </p>
      <div className={styles.settingsRowExtra}>{extra}</div>
    </div>
  );
};

AdvancedSettingsRow.displayName = displayName;

export default AdvancedSettingsRow;
