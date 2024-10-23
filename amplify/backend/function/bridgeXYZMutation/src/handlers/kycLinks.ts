import fetch from 'cross-fetch';
import { v4 as uuid } from 'uuid';
import { AppSyncResolverEvent } from 'aws-lambda';
/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
import { updateUser, getUserByBridgeCustomerId } from '../graphql';
import { HandlerContext } from '../types';
import { graphqlRequest } from '../utils';

/**
 * Extracts customer_id from TOS links of the following format:
 * https://dashboard.bridge.xyz/accept-terms-of-service?customer_id=xxx
 * @param tosLink {string}
 */
const extractCustomerId = (tosLink: string): string | null => {
  try {
    const url = new URL(tosLink);
    return url.searchParams.get('customer_id') ?? null;
  } catch {
    return null;
  }
};

interface InputArguments {
  input?: {
    body?: Record<string, any>;
    path?: string;
  };
}

export const kycLinksHandler = async (
  event: AppSyncResolverEvent<InputArguments>,
  { appSyncApiKey, apiKey, apiUrl, graphqlURL }: HandlerContext,
) => {
  const checksummedWalletAddress = event.request.headers['x-wallet-address'];
  const { body, path } = event.arguments?.input || {};

  const res = await fetch(`${apiUrl}/${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': uuid(),
      'Api-Key': apiKey,
    },
    body: JSON.stringify({
      ...body,
      type: 'individual',
    }),
    method: 'POST',
  });

  const data = await res.json();

  /**
   * customer_id in the kyc link object will be null until both TOS/KYC approved
   * We can however extract the customer ID from the TOS link
   */
  const tosLink = data?.tos_link ?? data?.existing_kyc_link?.tos_link;
  if (!tosLink) {
    throw new Error(
      `TOS link missing from Bridge XYZ response: ${JSON.stringify(data)}`,
    );
  }

  const customerId = extractCustomerId(tosLink);
  if (!customerId) {
    throw new Error(`Could not extract customer ID from TOS link: ${tosLink}`);
  }

  const userByCustomerIdQuery = await graphqlRequest(
    getUserByBridgeCustomerId,
    {
      bridgeCustomerId: customerId,
    },
    graphqlURL,
    appSyncApiKey,
  );

  const userByCustomerIdData =
    userByCustomerIdQuery?.data?.getUserByBridgeCustomerId;

  if (
    userByCustomerIdData?.items?.length > 0 &&
    userByCustomerIdData?.items?.[0]?.id !== checksummedWalletAddress
  ) {
    throw new Error(
      'A different user is already associated with this email address',
    );
  }

  // If no user is found, update the user with customer ID
  if (userByCustomerIdData?.items?.length === 0) {
    const mutation = await graphqlRequest(
      updateUser,
      {
        input: {
          id: checksummedWalletAddress,
          bridgeCustomerId: customerId,
        },
      },
      graphqlURL,
      appSyncApiKey,
    );

    if (!mutation) {
      throw new Error(
        `An error ocurred while updating the user with customer ID: ${customerId}`,
      );
    }

    if (mutation.errors || !mutation.data) {
      throw new Error(
        mutation?.errors?.[0]?.message ||
          `Could not update user with wallet address "${checksummedWalletAddress}"`,
      );
    }
  }

  // Return the TOS and KYC links
  return {
    tos_link: data?.tos_link || data?.existing_kyc_link?.tos_link,
    kyc_link: data?.kyc_link || data?.existing_kyc_link?.kyc_link,
    success: true,
  };
};
