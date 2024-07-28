const fetch = require('cross-fetch');
const { v4: uuid } = require('uuid');
const { graphqlRequest } = require('../utils');
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
    let kycLinkId;
    let kycStatus;
    if (data.existing_kyc_link) {
      kycLinkId = data.existing_kyc_link.id;
      kycLink = data.existing_kyc_link.kyc_link;
      kycStatus = data.existing_kyc_link.kyc_status;
    } else {
      kycLinkId = data.id;
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

    const externalAccountRes = await fetch(
      `${apiUrl}/v0/customers/${bridgeCustomerId}/external_accounts`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': apiKey,
        },
      },
    );

    const response = await externalAccountRes.json();

    const externalAccounts = response.data;

    // TODO: Support multiple accounts
    const firstAccount = externalAccounts?.[0];

    const mappedAccount = firstAccount
      ? {
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
        }
      : null;

    const liquidationAddressesRes = await fetch(
      `${apiUrl}/v0/customers/${bridgeCustomerId}/liquidation_addresses`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': apiKey,
        },
      },
    );

    const liquidationAddressesJson = await liquidationAddressesRes.json();
    const hasLiquidationAddress = liquidationAddressesJson.count > 0;

    if (firstAccount && !hasLiquidationAddress) {
      // They have external accounts. Create a liquidation address
      console.log('Bank account exists, creating liquidation address');
      const liquidationAddressCreation = await fetch(
        `${apiUrl}/v0/customers/${bridgeCustomerId}/liquidation_addresses`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': firstAccount.id,
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
        const liquidationAddress = liquidationAddressCreationRes.address;
        await graphqlRequest(
          createLiquidationAddress,
          {
            input: {
              chainId: 42161,
              liquidationAddress,
              userAddress: checksummedWalletAddress,
            },
          },
          graphqlURL,
          appSyncApiKey,
        );
      } else {
        console.error(
          `Failed to create liquidation address: `,
          liquidationAddressCreationRes,
        );
      }
    }

    return {
      kycStatus,
      kyc_link: kycLink,
      bankAccount: mappedAccount,
    };
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

module.exports = {
  checkKYCHandler,
};
