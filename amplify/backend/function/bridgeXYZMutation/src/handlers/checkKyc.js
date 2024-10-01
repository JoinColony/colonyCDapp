const fetch = require('cross-fetch');
const { utils } = require('ethers');
const { v4: uuid } = require('uuid');
const { graphqlRequest } = require('../utils');
const { getLiquidationAddresses, getExternalAccounts } = require('./utils');
/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const { getUser, createLiquidationAddress } = require('../graphql');

const KYC_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  INCOMPLETE: 'INCOMPLETE',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

const checkKYCHandler = async (
  event,
  { appSyncApiKey, apiKey, apiUrl, graphqlURL },
) => {
  const checksummedWalletAddress = event.request.headers['x-wallet-address'];

  try {
    const { data: graphQlData } = await graphqlRequest(
      getUser,
      {
        id: checksummedWalletAddress,
      },
      graphqlURL,
      appSyncApiKey,
    );
    const colonyUser = graphQlData?.getUser;

    const bridgeCustomerId = colonyUser?.bridgeCustomerId;
    if (!bridgeCustomerId) {
      return { kycStatus: KYC_STATUS.NOT_STARTED };
    }

    // Get customer from Bridge
    const customerRes = await fetch(
      `${apiUrl}/v0/customers/${bridgeCustomerId}`,
      {
        headers: {
          'Api-Key': apiKey,
        },
      },
    );
    const bridgeCustomer = await customerRes.json();

    if (!bridgeCustomer) {
      return {
        kycStatus: KYC_STATUS.NOT_STARTED,
      };
    }

    // "Generate" KYC links
    const kycLinksRes = await fetch(`${apiUrl}/v0/kyc_links`, {
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': uuid(),
        'Api-Key': apiKey,
      },
      body: JSON.stringify({
        full_name: bridgeCustomer.first_name + bridgeCustomer.last_name,
        email: bridgeCustomer.email,
        type: 'individual',
      }),
      method: 'POST',
    });

    const data = await kycLinksRes.json();

    // Is it an existing KYC link or a new one?
    let kycLink;
    let kycStatus;
    if (data.existing_kyc_link) {
      kycLink = data.existing_kyc_link.kyc_link;
      kycStatus = data.existing_kyc_link.kyc_status;
    } else {
      kycLink = data.kyc_link;
      kycStatus = data.kyc_status;
    }

    kycStatus = kycStatus?.toUpperCase();

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

    if (kycStatus !== KYC_STATUS.APPROVED) {
      return { kycStatus };
    }

    const externalAccounts = await getExternalAccounts(apiUrl, apiKey, bridgeCustomerId);

    const firstAccount = externalAccounts?.[0];

    if (!firstAccount) {
      return {
        kycStatus,
        kycLink,
        bankAccount: null,
      };
    }

    const mappedAccount = {
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

    const liquidationAddresses = await getLiquidationAddresses(
      apiUrl,
      apiKey,
      bridgeCustomerId,
    );

    let externalAccountLiquidationAddress = liquidationAddresses.find(
      (address) => address.external_account_id === firstAccount.id,
    )?.address;

    if (!externalAccountLiquidationAddress) {
      console.log('No liquidation address found for account, creating one');
      const liquidationAddressCreation = await fetch(
        `${apiUrl}/v0/customers/${bridgeCustomerId}/liquidation_addresses`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': uuid(),
            'Api-Key': apiKey,
          },
          method: 'POST',
          body: JSON.stringify({
            chain: 'arbitrum',
            currency: 'usdc',
            external_account_id: firstAccount.id,
            destination_payment_rail:
              firstAccount.currency === 'usd' ? 'ach' : 'sepa',
            destination_currency: firstAccount.currency,
          }),
        },
      );

      const liquidationAddressCreationRes =
        await liquidationAddressCreation.json();

      if (liquidationAddressCreation.status === 201) {
        externalAccountLiquidationAddress =
          liquidationAddressCreationRes.address;

        const checksummedLiquidationAddress = utils.getAddress(
          externalAccountLiquidationAddress,
        );

        // create liquidation address entry in the database
        await graphqlRequest(
          createLiquidationAddress,
          {
            input: {
              chainId: 42161,
              liquidationAddress: checksummedLiquidationAddress,
              userAddress: checksummedWalletAddress,
            },
          },
          graphqlURL,
          appSyncApiKey,
        );
      } else {
        console.error(
          'Failed to create liquidation address: ',
          liquidationAddressCreationRes,
        );
      }
    }

    return {
      kycStatus,
      kycLink,
      bankAccount: mappedAccount,
      liquidationAddress: externalAccountLiquidationAddress,
    };
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

module.exports = {
  checkKYCHandler,
};
