import { Signer, providers } from 'ethers';
import {
  getTokenClient,
  ClientType,
  AnyOneTxPaymentClient,
  ContractClient,
  ColonyNetworkClient,
  Extension,
  TokenClient,
  TokenLockingClient,
  ExtensionClient,
  AnyColonyClient,
} from '@colony/colony-js';

import { isAddress } from '~utils/web3';
import { Address } from '~types';

export default class ColonyManager {
  private metaColonyClient?: any;

  colonyClients: Map<Address, Promise<any>>;

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
      case ClientType.CoinMachineClient: {
        if (!identifier)
          throw new Error('Need colony identifier to get CoinMachineClient');
        return this.getColonyExtensionClient(identifier, Extension.CoinMachine);
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
      case ClientType.WhitelistClient: {
        if (!identifier)
          throw new Error('Need colony identifier to get the WhitelistClient');
        return this.getColonyExtensionClient(identifier, Extension.Whitelist);
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
}
