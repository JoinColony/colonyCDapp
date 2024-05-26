import {
  type Chain,
  type WalletInit,
  type EIP1193Provider,
  type ProviderAccounts,
} from '@web3-onboard/common';

import type { EthereumProvider as LedgerEthereumProvider } from '@ledgerhq/connect-kit/dist/umd';
import type { JQueryStyleEventEmitter } from 'rxjs/internal/observable/fromEvent';

type LedgerOptionsWCv2 = {
  walletConnectVersion: 2;
  enableDebugLogs?: boolean;
  /**
   * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
   */
  projectId: string;
  /**
   * List of Optional Chain(s) ID for wallets to support in number format (integer or hex)
   * Defaults to the chains provided within the web3-onboard init chain property
   */
  requiredChains?: string[] | number[];
  requiredMethods?: string[];
  /**
   * Additional methods to be added to the default list of ['eth_sendTransaction',  'eth_signTransaction',  'personal_sign',  'eth_sign',  'eth_signTypedData',  'eth_signTypedData_v4']
   * Passed methods to be included along with the defaults methods - see https://docs.walletconnect.com/2.0/web/walletConnectModal/options
   */
  optionalMethods?: string[];
  requiredEvents?: string[];
  optionalEvents?: string[];
};

const isHexString = (value: string | number) => {
  if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }

  return true;
};

const icon = `<svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="160" height="160" rx="16" fill="#00000D"/><path d="M93.1482 119.207V125H135V98.8769H128.902V119.207H93.1482ZM93.1482 33V38.792H128.902V59.1231H135V33H93.1482ZM74.0104 59.1231H67.9125V98.8769H95.4153V93.6539H74.0104V59.1231ZM26 98.8769V125H67.8518V119.207H32.0979V98.8769H26ZM26 33V59.1231H32.0979V38.792H67.8518V33H26Z" fill="white"/></svg>`;

// methods that require user interaction
const defaultOptionalMethods = [
  'eth_sendTransaction',
  'eth_signTransaction',
  'personal_sign',
  'eth_sign',
  'eth_signTypedData',
  'eth_signTypedData_v4',
  'wallet_addEthereumChain',
  'wallet_switchEthereumChain',
];

function ledgerLiveModule(options?: LedgerOptionsWCv2): WalletInit {
  if (!options?.projectId) {
    throw new Error(
      'WalletConnect requires a projectId. Please visit https://cloud.walletconnect.com to get one.',
    );
  }

  return () => {
    return {
      label: 'Ledger',
      getIcon: async () => icon,
      getInterface: async ({
        chains,
        EventEmitter,
      }: {
        chains: Chain[];
        EventEmitter: any;
      }) => {
        const connectKit = await import('@ledgerhq/connect-kit/dist/umd');

        if (options?.enableDebugLogs) {
          connectKit.enableDebugLogs();
        }

        // accept both hex and decimal chain ids
        const requiredChains = options?.requiredChains?.map((id) =>
          typeof id === 'string' && isHexString(id)
            ? parseInt(id, 16)
            : (id as number),
        );

        const optionalMethods =
          options.optionalMethods && Array.isArray(options.optionalMethods)
            ? [...options.optionalMethods, ...defaultOptionalMethods]
            : defaultOptionalMethods;

        const checkSupportResult = connectKit.checkSupport({
          providerType: connectKit.SupportedProviders.Ethereum,
          walletConnectVersion: 2,
          projectId: options?.projectId,
          chains: requiredChains,
          optionalChains: chains.map(({ id }) => parseInt(id, 16)),
          methods: options?.requiredMethods,
          optionalMethods,
          events: options?.requiredEvents,
          optionalEvents: options?.optionalEvents,
          rpcMap: chains
            .map(({ id, rpcUrl }) => ({ id, rpcUrl }))
            .reduce((rpcMap: Record<number, string>, { id, rpcUrl }) => {
              // eslint-disable-next-line no-param-reassign
              rpcMap[parseInt(id, 16)] = rpcUrl || '';
              return rpcMap;
            }, {}),
        });

        // get the provider instance, it can be either the Ledger Extension
        // or WalletConnect
        const instance =
          (await connectKit.getProvider()) as LedgerEthereumProvider;

        // return the Ledger Extension provider
        if (
          checkSupportResult.providerImplementation ===
          connectKit.SupportedProviderImplementations.LedgerConnect
        ) {
          return {
            provider: instance,
          };
        }

        const { ProviderRpcError, ProviderRpcErrorCode } = await import(
          '@web3-onboard/common'
        );
        const { default: EthereumProvider } = await import(
          '@walletconnect/ethereum-provider'
        );
        const { Subject, fromEvent } = await import('rxjs');
        const { takeUntil, take } = await import('rxjs/operators');

        const connector = instance as unknown as InstanceType<
          typeof EthereumProvider
        >;
        const emitter = new EventEmitter();

        class EthProvider {
          public request: EIP1193Provider['request'];

          public connector: InstanceType<typeof EthereumProvider>;

          public chains: Chain[];

          public disconnect: EIP1193Provider['disconnect'];

          public emit: (typeof EventEmitter)['emit'];

          public on: (typeof EventEmitter)['on'];

          public removeListener: (typeof EventEmitter)['removeListener'];

          private disconnected$: InstanceType<typeof Subject>;

          constructor({
            ethconnector,
            chainsList,
          }: {
            ethconnector: InstanceType<typeof EthereumProvider>;
            chainsList: Chain[];
          }) {
            this.emit = emitter.emit.bind(emitter);
            this.on = emitter.on.bind(emitter);
            this.removeListener = emitter.removeListener.bind(emitter);

            this.connector = ethconnector;
            this.chains = chainsList;
            this.disconnected$ = new Subject();

            // listen for accountsChanged
            fromEvent(this.connector, 'accountsChanged', (payload) => payload)
              .pipe(takeUntil(this.disconnected$))
              .subscribe({
                next: (accounts) => {
                  this.emit('accountsChanged', accounts);
                },
                error: console.warn,
              });

            // listen for chainChanged
            fromEvent(
              this.connector as JQueryStyleEventEmitter<any, number>,
              'chainChanged',
              (payload: number) => payload,
            )
              .pipe(takeUntil(this.disconnected$))
              .subscribe({
                next: (chainId) => {
                  const hexChainId = isHexString(chainId)
                    ? chainId
                    : `0x${chainId.toString(16)}`;
                  this.emit('chainChanged', hexChainId);
                },
                error: console.warn,
              });

            // listen for disconnect event
            fromEvent(
              this.connector as JQueryStyleEventEmitter<any, string>,
              'session_delete',
              (payload: string) => payload,
            )
              .pipe(takeUntil(this.disconnected$))
              .subscribe({
                next: () => {
                  this.emit('accountsChanged', []);
                  this.disconnected$.next(true);
                  if (typeof localStorage !== 'undefined') {
                    localStorage.removeItem('walletconnect');
                  }
                },
                error: console.warn,
              });

            this.disconnect = () => {
              if (this.connector.session) this.connector.disconnect();
            };

            const checkForSession = () => {
              const { session } = this.connector;
              if (session) {
                this.emit('accountsChanged', this.connector.accounts);
                this.emit('chainChanged', this.connector.chainId);
              }
            };
            checkForSession();

            this.request = async ({ method, params }) => {
              if (method === 'eth_chainId') {
                return isHexString(this.connector.chainId)
                  ? this.connector.chainId
                  : `0x${this.connector.chainId.toString(16)}`;
              }

              if (method === 'eth_requestAccounts') {
                return new Promise<ProviderAccounts>((resolve, reject) => {
                  // Subscribe to connection events
                  fromEvent(
                    this.connector as JQueryStyleEventEmitter<
                      any,
                      { chainId: number }
                    >,
                    'connect',
                    (payload: { chainId: number | string }) => payload,
                  )
                    .pipe(take(1))
                    .subscribe({
                      next: ({ chainId }) => {
                        this.emit('accountsChanged', this.connector.accounts);
                        const hexChainId = isHexString(chainId)
                          ? chainId
                          : `0x${chainId.toString(16)}`;
                        this.emit('chainChanged', hexChainId);
                        resolve(this.connector.accounts);
                      },
                      error: reject,
                    });

                  // Check if connection is already established
                  if (!this.connector.session) {
                    instance.request({ method }).catch((err: Error) => {
                      console.error('err creating new session: ', err);
                      reject(
                        new ProviderRpcError({
                          code: 4001,
                          message: 'User rejected the request.',
                        }),
                      );
                    });
                  } else {
                    // update ethereum provider to load accounts & chainId
                    const { accounts } = this.connector;
                    const { chainId } = this.connector;
                    const hexChainId = `0x${chainId.toString(16)}`;
                    this.emit('chainChanged', hexChainId);
                    resolve(accounts);
                  }
                });
              }

              if (method === 'eth_selectAccounts') {
                throw new ProviderRpcError({
                  code: ProviderRpcErrorCode.UNSUPPORTED_METHOD,
                  message: `The Provider does not support the requested method: ${method}`,
                });
              }

              if (method === 'wallet_switchEthereumChain') {
                if (!params) {
                  throw new ProviderRpcError({
                    code: ProviderRpcErrorCode.INVALID_PARAMS,
                    message: `The Provider requires a chainId to be passed in as an argument`,
                  });
                }
                const chainIdObj = params[0] as { chainId?: number };
                if (
                  !Object.prototype.hasOwnProperty.call(
                    chainIdObj,
                    'chainId',
                  ) ||
                  typeof chainIdObj.chainId === 'undefined'
                ) {
                  throw new ProviderRpcError({
                    code: ProviderRpcErrorCode.INVALID_PARAMS,
                    message: `The Provider requires a chainId to be passed in as an argument`,
                  });
                }
                return this.connector.request({
                  method: 'wallet_switchEthereumChain',
                  params: [
                    {
                      chainId: chainIdObj.chainId,
                    },
                  ],
                });
              }

              return this.connector.request<Promise<any>>({
                method,
                params,
              });
            };
          }
        }

        return {
          provider: new EthProvider({
            chainsList: chains,
            ethconnector: connector,
          }),
        };
      },
    };
  };
}

export default ledgerLiveModule;
