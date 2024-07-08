import {
  ColonyNetwork,
  type Colony,
  PinataAdapter,
  type SignerOrProvider,
} from '@colony/sdk';

import { Network } from '~types/network.ts';

// FIXME: remove (use lambda)
const PINATA_JWT__TEMP = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlZWNiZWNhMi0wMmU3LTQ4OTYtYWMzMi03MDQyMjc3OGEyYjciLCJlbWFpbCI6ImNocmlzQGNvbG9ueS5pbyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIxYTFjZmNlOTI3MzYzODI1Mjg5OSIsInNjb3BlZEtleVNlY3JldCI6IjhjZTExNTNlNTY1NjJlZDUyODJmZGU3MWYzNmYyNjhmYjU5MjAxZGI5ZmY0OWNlMTZkNTRjZGIyMDJjMWIwNGQiLCJpYXQiOjE3MTE0Nzc4Mzh9.I-aALCEpRZksUxJFaHOlk9kW03mnyyh74hXaskIfA-U`;

class ColonyManager {
  private colonies: Map<string, Colony>;

  colonyNetwork?: ColonyNetwork;

  signerOrProvider: SignerOrProvider;

  constructor(signerOrProvider: SignerOrProvider) {
    this.signerOrProvider = signerOrProvider;
    this.colonies = new Map();
  }

  async getColonyNetwork() {
    if (this.colonyNetwork) {
      return this.colonyNetwork;
    }

    const reputationOracleUrl = import.meta.env.REPUTATION_ORACLE_ENDPOINT
      ? new URL(import.meta.env.REPUTATION_ORACLE_ENDPOINT)
      : new URL(`/reputation`, window.location.origin);

    if (import.meta.env.DEV && import.meta.env.NETWORK_ID === Network.Ganache) {
      const ganacheAccountsUrl = new URL(
        import.meta.env.VITE_NETWORK_FILES_ENDPOINT || 'http://localhost:3006',
      );
      const fetchRes = await fetch(
        `${ganacheAccountsUrl.href}etherrouter-address.json`,
      );
      const { etherRouterAddress: customNetworkAddress } =
        await fetchRes.json();

      this.colonyNetwork = new ColonyNetwork(this.signerOrProvider, {
        customNetworkAddress,
        reputationOracleEndpoint: reputationOracleUrl.href,
        // FIXME: Write an adapter for our purposes (use lambda)
        ipfsAdapter: new PinataAdapter(PINATA_JWT__TEMP),
      });

      return this.colonyNetwork;
    }

    this.colonyNetwork = new ColonyNetwork(this.signerOrProvider, {
      reputationOracleEndpoint: reputationOracleUrl.href,
      // FIXME: Write an adapter for our purposes (use lambda)
      ipfsAdapter: new PinataAdapter(PINATA_JWT__TEMP),
    });

    return this.colonyNetwork;
  }

  async getColony(colonyAddress: string) {
    if (this.colonies.has(colonyAddress)) {
      return this.colonies.get(colonyAddress);
    }

    const colonyNetwork = await this.getColonyNetwork();
    const colony = await colonyNetwork.getColony(colonyAddress);
    this.colonies.set(colonyAddress, colony);
    return colony;
  }
}

export default ColonyManager;
