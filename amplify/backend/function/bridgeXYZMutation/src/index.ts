import 'source-map-support/register';

import { kycLinksHandler } from './handlers/kycLinks';
import { checkKYCHandler } from './handlers/checkKyc';
import { updateExternalAccountHandler } from './handlers/updateExternalAccount';
import { getDrainsHistoryHandler } from './handlers/getDrainsHistory';
import { getGatewayFeeHandler } from './handlers/getGatewayFee';
import { getUserLiquidationAddressHandler } from './handlers/getUserLiquidationAddress';
import { AppSyncResolverEvent, BridgeOperation } from './types';
import { createExternalAccountHandler } from './handlers/createExternalAccount';

const isDev = process.env.ENV === 'dev';

let graphqlURL: string = 'http://localhost:20002/graphql';
let appSyncApiKey: string = 'da2-fakeApiId123456';
let apiUrl: string | undefined = process.env.BRIDGE_API_URL;
let apiKey: string | undefined = process.env.BRIDGE_API_KEY;

type InputArguments = {
  input?: {
    path?: string;
  };
};

// @TODO: Lambda utils refactor candidate
const setEnvVariables = async (): Promise<void> => {
  if (!isDev) {
    const { getParams } = require('/opt/nodejs/getParams');
    [appSyncApiKey, apiKey, apiUrl, graphqlURL] = await getParams([
      'appsyncApiKey',
      'bridgeXYZApiKey',
      'bridgeXYZApiUrl',
      'graphqlUrl',
    ]);
  }
};

export const handler = async (event: AppSyncResolverEvent<InputArguments>) => {
  try {
    await setEnvVariables();

    if (!apiKey || !apiUrl) {
      throw new Error('Both the API Key & API URL should be present.');
    }
  } catch (e) {
    throw new Error(`Unable to set environment variables. Reason: ${e}`);
  }

  const { path } = event.arguments?.input || {};

  const handlers = {
    [BridgeOperation.CREATE_EXTERNAL_ACCOUNT]: createExternalAccountHandler,
    [BridgeOperation.UPDATE_EXTERNAL_ACCOUNT]: updateExternalAccountHandler,
    [BridgeOperation.GET_DRAINS_HISTORY]: getDrainsHistoryHandler,
    [BridgeOperation.CHECK_KYC]: checkKYCHandler,
    [BridgeOperation.GET_USER_LIQUIDATION_ADDRESS]:
      getUserLiquidationAddressHandler,
    [BridgeOperation.GET_GATEWAY_FEE]: getGatewayFeeHandler,
    [BridgeOperation.KYC_LINKS]: kycLinksHandler,
    default: async () => {
      console.log('Running default handler');
      return null;
    },
  };

  const handlerFunction =
    (path && handlers[path]) || handlers[event.fieldName] || handlers.default;

  try {
    return await handlerFunction(event, {
      appSyncApiKey,
      apiKey,
      apiUrl,
      graphqlURL,
    });
  } catch (error) {
    console.error(
      `bridgeXYZMutation handler ${event.fieldName ?? 'default'} failed with error: `,
      error,
    );
    return { success: false };
  }
};
