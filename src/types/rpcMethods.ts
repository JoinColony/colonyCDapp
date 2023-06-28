export enum RpcMethods {
  BlockNumber = 'eth_blockNumber',
  GetBlockNumber = 'eth_getBlockByNumber',
  EstimateGas = 'eth_estimateGas',
  GasPrice = 'eth_gasPrice',
  Accounts = 'eth_accounts',
  SelectAccounts = 'eth_selectAccounts',
  RequestAccounts = 'eth_requestAccounts',
  ChainId = 'eth_chainId',
  GetBalance = 'eth_getBalance',
  SendTransaction = 'eth_sendTransaction',
  GetTransactionByHash = 'eth_getTransactionByHash',
  Sign = 'eth_sign',
  PersonalSign = 'personal_sign',
  SignTypedData = 'eth_signTypedData',
  SignTypedDataV4 = 'eth_signTypedData_v4', // Only available via Metamask
  WatchAsset = 'wallet_watchAsset', // Metamask method
}
