const CHAIN_ID = 42161;
const CHAIN_SHORT_NAME = 'arbitrum';
const USDC_TOKEN_NAME = 'usdc';

const bridgeApiConfig = {
  constants: {
    paymentRail: {
      SEPA: 'sepa',
      ACH: 'ach',
    },
    accountOwnerType: 'individual',
    accountType: {
      US: 'us',
      IBAN: 'iban',
    },
  },
  endpoints: {
    routes: {
      customers: 'v0/customers',
      developer: 'v0/developer',
      kycLinks: 'v0/kyc_links',
    },
    resources: {
      fees: 'fees',
      liquidationAddresses: 'liquidation_addresses',
      drains: 'drains',
      externalAccounts: 'external_accounts',
    },
  },
};

module.exports = {
  CHAIN_ID,
  CHAIN_SHORT_NAME,
  USDC_TOKEN_NAME,
  bridgeApiConfig,
};
