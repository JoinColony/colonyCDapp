import { raceAgainstTimeout } from './utils.ts';

import type IPFSNode from './ipfsnode/index.ts';
import type Pinata from './pinata/index.ts';

const DEFAULT_TIMEOUT_POST = 30000;

export interface IPFSWithTimeout {
  addString: (data: string) => Promise<string>;
}

const getIPFSWithFallback = (
  ipfsNode?: IPFSNode,
  pinataClient?: Pinata,
): IPFSWithTimeout | null => {
  let ipfsWithTimeout: IPFSWithTimeout | undefined;
  if (ipfsNode) {
    ipfsWithTimeout = {
      addString: async (data) =>
        raceAgainstTimeout({
          promise: ipfsNode.addString(data),
          ms: DEFAULT_TIMEOUT_POST,
          err: new Error('Timeout reached trying to upload data to IPFS'),
        }),
    };
  }
  let pinataWithTimeout: IPFSWithTimeout | undefined;

  if (pinataClient) {
    pinataWithTimeout = {
      addString: async (data) =>
        raceAgainstTimeout({
          promise: pinataClient.addJSON(data),
          ms: DEFAULT_TIMEOUT_POST,
          err: new Error(
            'Timeout reached trying to upload data to IPFS via Pinata',
          ),
        }),
    };
  }
  if (ipfsWithTimeout) {
    return ipfsWithTimeout;
  }
  if (pinataWithTimeout) {
    return pinataWithTimeout;
  }
  return null;
};

export default getIPFSWithFallback;
