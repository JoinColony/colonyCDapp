import { AppSyncResolverEvent as BaseAppSyncResolverEvent } from 'aws-lambda';

export enum BridgeOperation {
  GET_DRAINS_HISTORY = 'bridgeGetDrainsHistory',
  CHECK_KYC = 'bridgeCheckKYC',
  GET_USER_LIQUIDATION_ADDRESS = 'bridgeGetUserLiquidationAddress',
  CREATE_EXTERNAL_ACCOUNT = 'bridgeCreateBankAccount',
  UPDATE_EXTERNAL_ACCOUNT = 'bridgeUpdateBankAccount',
  GET_GATEWAY_FEE = 'bridgeGetGatewayFee',
  KYC_LINKS = 'v0/kyc_links',
}

export interface HandlerContext {
  appSyncApiKey: string;
  apiKey: string;
  apiUrl: string;
  graphqlURL: string;
}

export type AppSyncResolverEvent<T = any> = BaseAppSyncResolverEvent<T> & {
  fieldName: string;
};
