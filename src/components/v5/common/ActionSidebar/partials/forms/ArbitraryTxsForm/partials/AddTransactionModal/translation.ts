import { defineMessages } from 'react-intl';

export const displayName =
  'v5.common.ActionSidebar.partials.ArbitraryTxsForm.partials.AddTransactionModal';

export const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Contract interaction',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'Provide the contract address you want to interact with it. We will try to generate the ABI if found, otherwise, you can enter it in manually. Then select the action you want to take.',
  },
  link: {
    id: `${displayName}.link`,
    defaultMessage: 'Learn more about contract interactions',
  },
  contractAddressField: {
    id: `${displayName}.contractAddressField`,
    defaultMessage: 'Target contract address',
  },
  contractAddressPlaceholder: {
    id: `${displayName}.contractAddressPlaceholder`,
    defaultMessage: 'Enter contract address',
  },
  abiJsonField: {
    id: `${displayName}.abiJsonField`,
    defaultMessage: 'ABI/JSON',
  },
  methodField: {
    id: `${displayName}.methodField`,
    defaultMessage: 'Select a method to interact with',
  },
  methodPlaceholder: {
    id: `${displayName}.methodPlaceholder`,
    defaultMessage: 'Select method',
  },
  toField: {
    id: `${displayName}.toField`,
    defaultMessage: '_to (address)',
  },
  toPlaceholder: {
    id: `${displayName}.toPlaceholder`,
    defaultMessage: 'Enter value',
  },
  amountField: {
    id: `${displayName}.amountField`,
    defaultMessage: '_amount (uint256)',
  },
  amountPlaceholder: {
    id: `${displayName}.amountPlaceholder`,
    defaultMessage: 'Enter value',
  },
  submitButton: {
    id: `${displayName}.submitButton`,
    defaultMessage: 'Confirm',
  },
  contractAddressError: {
    id: `${displayName}.contractAddressError`,
    defaultMessage: 'Please enter a valid contract address.',
  },
});
