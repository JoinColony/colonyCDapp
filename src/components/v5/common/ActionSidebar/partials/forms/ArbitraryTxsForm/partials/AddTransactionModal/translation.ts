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
  contractAddressError: {
    id: `${displayName}.contractAddressError`,
    defaultMessage: 'Please enter a valid contract address.',
  },
  jsonAbiField: {
    id: `${displayName}.jsonAbiField`,
    defaultMessage: 'ABI/JSON',
  },
  jsonAbiEditInfo: {
    id: `${displayName}.jsonAbiEditInfo`,
    defaultMessage: 'Edit generated ABI',
  },
  jsonParseError: {
    id: `${displayName}.jsonParseError`,
    defaultMessage: 'Please ensure value is valid JSON.',
  },
  invalidAbiError: {
    id: `${displayName}.invalidAbiError`,
    defaultMessage: 'Please ensure value is valid ABI.',
  },
  emptyMethodsAbiError: {
    id: `${displayName}.emptyMethodsAbiError`,
    defaultMessage: "Contract ABI doesn't have any available methods.",
  },
  jsonAbiFormatLink: {
    id: `${displayName}.jsonAbiFormatLink`,
    defaultMessage: 'Format JSON',
  },
  submitButton: {
    id: `${displayName}.submitButton`,
    defaultMessage: 'Confirm',
  },
});
