const fetch = require('cross-fetch');
const { utils } = require('ethers');
const { graphqlRequest } = require('../api/graphql/utils');
const {
  getBridgeCustomer,
  getLiquidationAddresses,
  getExternalAccounts,
  createKYCLinks,
  createLiquidationAddress,
} = require('../api/rest/bridge');
/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const {
  getUser,
  createLiquidationAddress: createLiquidationAddressMutation,
} = require('../api/graphql/schemas');

const { CHAIN_ID } = require('../consts.js');

const KYC_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  INCOMPLETE: 'INCOMPLETE',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

const checkKYCHandler = async (event) => {
  const checksummedWalletAddress = event.request.headers['x-wallet-address'];

  try {
    const { data: graphQlData } = await graphqlRequest(getUser, {
      id: checksummedWalletAddress,
    });
    const colonyUser = graphQlData?.getUser;

    const bridgeCustomerId = colonyUser?.bridgeCustomerId;
    if (!bridgeCustomerId) {
      return { kycStatus: KYC_STATUS.NOT_STARTED };
    }

    // Get customer from Bridge
    const bridgeCustomer = await getBridgeCustomer(bridgeCustomerId);
    if (!bridgeCustomer) {
      return { kycStatus: KYC_STATUS.NOT_STARTED };
    }

    // "Generate" KYC links
    ({ kycStatus, kycLink } = await generateKYCLinks(
      bridgeCustomer,
      colonyUser,
    ));

    if (kycStatus !== KYC_STATUS.APPROVED) {
      return { kycStatus };
    }

    const bankAccount = await getBankAccountDetails(bridgeCustomerId);

    if (!bankAccount) {
      return {
        kycStatus,
        kycLink,
        bankAccount: null,
      };
    }

    const liquidationAddress = await getLiquidationAddress(
      checksummedWalletAddress,
      bridgeCustomerId,
      bankAccount.id,
      bankAccount.currency,
    );

    return {
      kycStatus,
      kycLink,
      bankAccount,
      liquidationAddress,
    };
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

const generateKYCLinks = async (bridgeCustomer, colonyUser) => {
  const fullName = `${bridgeCustomer.first_name}${bridgeCustomer.last_name}`;
  const email = bridgeCustomer.email;

  const data = await createKYCLinks(fullName, email);
  const { existing_kyc_link, kyc_link, kyc_status } = data;

  let kycStatus = (existing_kyc_link?.kyc_status || kyc_status)?.toUpperCase();
  let kycLink = existing_kyc_link?.kyc_link || kyc_link;

  /**
   * Status returned from Bridge does not allow to determine between incomplete and awaiting response after completing the KYC flow
   * Hence the need for additional pending status
   */
  if (
    kycStatus === KYC_STATUS.INCOMPLETE &&
    colonyUser.profile.hasCompletedKYCFlow
  ) {
    kycStatus = KYC_STATUS.PENDING;
  }

  return { kycStatus, kycLink };
};

const getBankAccountDetails = async (bridgeCustomerId) => {
  const externalAccounts = await getExternalAccounts(bridgeCustomerId);
  const firstAccount = externalAccounts?.[0];

  if (!firstAccount) {
    return null;
  }

  return {
    id: firstAccount.id,
    currency: firstAccount.currency,
    bankName: firstAccount.bank_name,
    accountOwner: firstAccount.account_owner_name,
    iban: firstAccount.iban
      ? {
          last4: firstAccount.iban.last_4,
          bic: firstAccount.iban.bic,
          country: firstAccount.iban.country,
        }
      : null,
    usAccount: firstAccount.account
      ? {
          last4: firstAccount.account.last_4,
          routingNumber: firstAccount.account.routing_number,
        }
      : null,
  };
};

const getLiquidationAddress = async (
  userAddress,
  bridgeCustomerId,
  externalAccountId,
  externalAccountCurrency,
) => {
  const liquidationAddresses = await getLiquidationAddresses(
    bridgeCustomerId,
    externalAccountId,
  );

  let externalAccountLiquidationAddress = liquidationAddresses.find(
    (address) => address.external_account_id === externalAccountId,
  )?.address;

  if (externalAccountLiquidationAddress) {
    return externalAccountLiquidationAddress;
  }

  console.log('No liquidation address found for account, creating one');
  const liquidationAddressCreationRes = await createLiquidationAddress(
    bridgeCustomerId,
    externalAccountId,
    externalAccountCurrency,
  );

  if (liquidationAddressCreationRes) {
    externalAccountLiquidationAddress = liquidationAddressCreationRes.address;

    if (utils.isAddress(externalAccountLiquidationAddress)) {
      const checksummedLiquidationAddress = utils.getAddress(
        externalAccountLiquidationAddress,
      );

      // create liquidation address entry in the database
      await graphqlRequest(createLiquidationAddressMutation, {
        input: {
          // @TODO here use dynamic chainId
          chainId: CHAIN_ID,
          liquidationAddress: checksummedLiquidationAddress,
          userAddress,
        },
      });

      return externalAccountLiquidationAddress;
    } else {
      console.error(
        `Newly created liquidation address ${externalAccountLiquidationAddress} is not valid`,
      );
    }
  }

  return null;
};

module.exports = {
  checkKYCHandler,
};
