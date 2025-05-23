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
  learnMoreLink: {
    id: `${displayName}.learnMoreLink`,
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
  contractAddressServerError: {
    id: `${displayName}.contractAddressServerError`,
    defaultMessage:
      'We were unable to verify this contract. Please proceed only if you fully understand its functionality and trust its source.',
  },
  contractAddressServerErrorNote: {
    id: `${displayName}.contractAddressServerErrorNote`,
    defaultMessage: 'Note:',
  },
  jsonAbiField: {
    id: `${displayName}.jsonAbiField`,
    defaultMessage: 'ABI/JSON',
  },
  jsonAbiFieldPlaceholder: {
    id: `${displayName}.jsonAbiFieldPlaceholder`,
    defaultMessage: 'Enter contract ABI/JSON',
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
  jsonAbiUnformatLink: {
    id: `${displayName}.jsonAbiUnformatLink`,
    defaultMessage: 'Unformat JSON',
  },
  methodsField: {
    id: `${displayName}.methodField`,
    defaultMessage: 'Select a method to interact with',
  },
  methodsPlaceholder: {
    id: `${displayName}.methodPlaceholder`,
    defaultMessage: 'Select method',
  },
  dynamicFieldPlaceholder: {
    id: `${displayName}.dynamicFieldPlaceholder`,
    defaultMessage: 'Enter value',
  },
  submitButton: {
    id: `${displayName}.submitButton`,
    defaultMessage: 'Confirm',
  },
  validationAddressError: {
    id: `${displayName}.validationAddressError`,
    defaultMessage: 'Please enter a valid address.',
  },
  validationIntError: {
    id: `${displayName}.validationIntError`,
    defaultMessage: 'Please enter a valid number for this field',
  },
  validationBooleanError: {
    id: `${displayName}.validationBooleanError`,
    defaultMessage: 'Please enter either "true" or "false"',
  },
  validationByteError: {
    id: `${displayName}.validationByteError`,
    defaultMessage: 'Please enter a valid byte string',
  },
  validationArrayError: {
    id: `${displayName}.validationArrayError`,
    defaultMessage: 'Please enter a valid array format',
  },
  validationInputError: {
    id: `${displayName}.validationInputError`,
    defaultMessage: 'Please enter a valid input for this field',
  },
  validationByIndexError: {
    id: `${displayName}.validationByIndexError`,
    defaultMessage: 'Error in array item {index}: Invalid value',
  },
  contractModalCancelTitle: {
    id: `${displayName}.contractModalCancelTitle`,
    defaultMessage: 'Do you wish to cancel the arbitrary transaction creation?',
  },

  contractModalCancelSubtitle: {
    id: `${displayName}.contractModalCancelSubtitle`,
    defaultMessage: 'All entered data will be lost.',
  },

  contractModalCancelButtonCancel: {
    id: `${displayName}.contractModalCancelButtonCancel`,
    defaultMessage: 'Yes, cancel the form creation',
  },

  contractModalCancelButtonContinue: {
    id: `${displayName}.contractModalCancelButtonContinue`,
    defaultMessage: 'No, go back to editing',
  },
});
