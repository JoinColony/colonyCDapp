export enum ExtendedClientType {
  WrappedTokenClient = 'WrappedTokenClient',
  VestingSimpleClient = 'VestingSimpleClient',
  LightTokenClient = 'LightTokenClient',
}

export enum MetatransactionFlavour {
  Vanilla = 'vanillaMetatransactions',
  EIP2612 = 'eip2612Metatransactions',
}

export enum RpcMethods {
  SignTypedData = 'eth_signTypedData',
  SignTypedDataV4 = 'eth_signTypedData_v4', // Only available via Metamask
}

export enum ContractRevertErrors {
  TokenUnauthorized = 'colony-token-unauthorised',
  MetaTxInvalidSignature = 'colony-metatx-invalid-signature',
  TokenInvalidSignature = 'colony-token-invalid-signature',
}

export enum MetamaskRpcErrors {
  /*
   * @NOTE We have to use the truncated error message, since the original one
   * is dynamic and we can't account for the various chain id's
   */
  TypedDataSignDifferentChain = 'must match the active chainId',
}
