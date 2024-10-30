import {
  getTokenClient,
  ClientType,
  type AnyOneTxPaymentClient,
  type ContractClient,
  type ColonyNetworkClient,
  Extension,
  type TokenClient,
  type TokenLockingClient,
  type ExtensionClient,
  type AnyColonyClient,
  type AnyMultisigPermissionsClient,
} from '@colony/colony-js';
import { type Abi, CustomContract, ContractConfig } from '@colony/sdk';
import { type Signer, type providers } from 'ethers';

import { DEFAULT_NETWORK } from '~constants/index.ts';
import { type Address } from '~types/index.ts';
import { ColonyJSNetworkMapping } from '~types/network.ts';
import { isAddress } from '~utils/web3/index.ts';

export default class ColonyManager {
  private metaColonyClient?: any;

  colonyClients: Map<Address, Promise<any>>;

  customContracts: Map<Address, CustomContract<any>>;

  extensionClients: Map<string, Promise<ExtensionClient>>;

  tokenClients: Map<Address, Promise<TokenClient>>;

  tokenLockingClients: Map<Address, Promise<TokenLockingClient>>;

  networkClient: ColonyNetworkClient;

  provider: providers.Provider;

  signer: Signer;

  constructor(networkClient: ColonyNetworkClient) {
    this.colonyClients = new Map();
    this.extensionClients = new Map();
    this.tokenClients = new Map();
    this.tokenLockingClients = new Map();
    this.customContracts = new Map();
    this.networkClient = networkClient;
    this.provider = networkClient.provider;
    this.signer = networkClient.signer;
  }

  private async getColonyPromise(address: Address): Promise<AnyColonyClient> {
    const client = await this.networkClient.getColonyClient(address);

    // Check if the colony exists by calling `version()` (in lieu of an
    // explicit means of checking whether a colony exists at an address).
    try {
      await client.version();
    } catch (caughtError) {
      throw new Error(`Colony with address ${address} not found`);
    }
    return client;
  }

  private async getColonyClient(identifier: Address): Promise<AnyColonyClient> {
    if (!isAddress(identifier)) {
      throw new Error('A colony address must be provided');
    }
    return (
      this.colonyClients.get(identifier) || this.setColonyClient(identifier)
    );
  }

  private async getColonyExtensionClient(
    identifier: Address,
    extensionId: Extension,
  ): Promise<ExtensionClient> {
    if (!isAddress(identifier)) {
      throw new Error('A colony address must be provided');
    }
    const key = `${identifier}-${extensionId}`;
    let client = this.extensionClients.get(key);
    if (!client) {
      const colonyClient = await this.getColonyClient(identifier);
      client = colonyClient.getExtensionClient(extensionId);
      this.extensionClients.set(key, client as Promise<ExtensionClient>);
    }
    return client as Promise<ExtensionClient>;
  }

  public async removeColonyExtensionClient(
    identifier: Address,
    extensionId: Extension,
  ): Promise<void> {
    if (!isAddress(identifier)) {
      throw new Error('A colony address must be provided');
    }
    const key = `${identifier}-${extensionId}`;
    this.extensionClients.delete(key);
  }

  async setColonyClient(address: Address): Promise<AnyColonyClient> {
    const clientPromise = this.getColonyPromise(address);
    this.colonyClients.set(address, clientPromise);
    clientPromise.catch(() => this.colonyClients.delete(address));
    return clientPromise;
  }

  async getMetaColonyClient(): Promise<AnyColonyClient> {
    if (this.metaColonyClient) return this.metaColonyClient;
    this.metaColonyClient = await this.networkClient.getMetaColonyClient();
    return this.metaColonyClient;
  }

  async getClient(type: ClientType.NetworkClient): Promise<ColonyNetworkClient>;

  async getClient(
    type: ClientType.ColonyClient,
    identifier?: Address,
  ): Promise<AnyColonyClient>;

  async getClient(
    type: ClientType.TokenClient,
    identifier?: Address,
  ): Promise<TokenClient>;

  async getClient(
    type: ClientType.TokenLockingClient,
    identifier?: Address,
  ): Promise<TokenLockingClient>;

  async getClient(
    type: ClientType.OneTxPaymentClient,
    identifier?: Address,
  ): Promise<AnyOneTxPaymentClient>;

  async getClient(
    type: ClientType.MultisigPermissionsClient,
    identifier?: Address,
  ): Promise<AnyMultisigPermissionsClient>;

  async getClient(
    type: ClientType,
    identifier?: Address,
  ): Promise<ContractClient>;

  async getClient(
    type: ClientType,
    identifier?: Address,
  ): Promise<ContractClient> {
    switch (type) {
      case ClientType.NetworkClient: {
        return this.networkClient;
      }
      case ClientType.ColonyClient: {
        if (!identifier)
          throw new Error('Need colony identifier to get ColonyClient');
        return this.getColonyClient(identifier);
      }
      case ClientType.TokenClient: {
        if (!identifier)
          throw new Error('Need colony identifier to get TokenClient');
        const colonyClient = await this.getColonyClient(identifier);
        return colonyClient.tokenClient;
      }
      case ClientType.TokenLockingClient: {
        if (!identifier)
          throw new Error('Need colony identifier to get TokenLockingClient');
        const colonyClient = await this.getColonyClient(identifier);
        const tokenLockingClient = this.networkClient.getTokenLockingClient();
        /*
         * @TODO This needs a proper fix in colonyJS
         */
        // @ts-ignore
        colonyClient.tokenLockingClient = tokenLockingClient;
        return tokenLockingClient;
      }
      case ClientType.OneTxPaymentClient: {
        if (!identifier)
          throw new Error('Need colony identifier to get OneTxPaymentClient');
        return this.getColonyExtensionClient(
          identifier,
          Extension.OneTxPayment,
        );
      }
      case ClientType.VotingReputationClient: {
        if (!identifier)
          throw new Error(
            'Need colony identifier to get the VotingReputationClient',
          );
        return this.getColonyExtensionClient(
          identifier,
          Extension.VotingReputation,
        );
      }
      case ClientType.MultisigPermissionsClient: {
        if (!identifier)
          throw new Error(
            'Need colony identifier to get the MultisigPermissionsClient',
          );
        return this.getColonyExtensionClient(
          identifier,
          Extension.MultisigPermissions,
        );
      }
      case ClientType.StakedExpenditureClient: {
        if (!identifier)
          throw new Error(
            'Need colony identifier to get the StakedExpenditureClient',
          );
        return this.getColonyExtensionClient(
          identifier,
          Extension.StakedExpenditure,
        );
      }
      case ClientType.StagedExpenditureClient: {
        if (!identifier)
          throw new Error(
            'Need colony identifier to get the StagedExpenditureClient',
          );
        return this.getColonyExtensionClient(
          identifier,
          Extension.StagedExpenditure,
        );
      }
      case ClientType.StreamingPaymentsClient: {
        if (!identifier)
          throw new Error(
            'Need colony identifier to get the StreamingPaymentsClient',
          );
        return this.getColonyExtensionClient(
          identifier,
          Extension.StreamingPayments,
        );
      }
      default: {
        throw new Error('A valid contract client type has to be specified');
      }
    }
  }

  async getTokenClient(address: Address): Promise<TokenClient> {
    if (!address)
      throw new Error('Need colony identifier to get the TokenClient');
    let clientPromise = this.tokenClients.get(address);
    if (!clientPromise) {
      clientPromise = getTokenClient(address, this.signer);
      this.tokenClients.set(address, clientPromise);
    }
    return clientPromise;
  }

  async getTokenLockingClient(address: Address): Promise<TokenLockingClient> {
    let clientPromise = this.tokenLockingClients.get(address);
    if (!clientPromise) {
      clientPromise = this.networkClient.getTokenLockingClient();
      this.tokenLockingClients.set(address, clientPromise);
    }
    return clientPromise;
  }

  /*
   * Get a custom colony contract by address and ABI (using Colony SDK)
   *
   * @example
   * ```ts
   * import { abi as colonyNetworkAbi } from '../../network-files/contracts/colonyNetwork/ColonyNetwork.sol/ColonyNetwork.json';
   * const networkAddress = import.meta.env.NETWORK_CONTRACT_ADDRESS || ColonyNetworkAddress[DEFAULT_NETWORK];
   * const customColonyNetwork = colonyManager.getCustomContract(networkAddress, colonyNetworkAbi);
   * ```
   */
  getCustomContract<A extends Abi>(address: string, abi: A): CustomContract<A> {
    const reputationOracleEndpoint = import.meta.env.REPUTATION_ORACLE_ENDPOINT
      ? new URL(import.meta.env.REPUTATION_ORACLE_ENDPOINT)
      : new URL(`/reputation`, window.location.origin);

    const metaTxBroadcasterEndpoint = `${import.meta.env.METATX_BROADCASTER_ENDPOINT}/broadcast`;

    const config = new ContractConfig(this.signer || this.provider, {
      metaTxBroadcasterEndpoint,
      network: ColonyJSNetworkMapping[DEFAULT_NETWORK],
      reputationOracleEndpoint: reputationOracleEndpoint.toString(),
    });

    if (this.customContracts.has(address)) {
      return this.customContracts.get(address) as CustomContract<A>;
    }

    return new CustomContract(address as `0x${string}`, abi, config);
  }
}
