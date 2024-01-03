import IPFSNode from './ipfsnode';
import Pinata from './pinata';
import { raceAgainstTimeout } from './utils';

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
        raceAgainstTimeout(
          ipfsNode.addString(data),
          DEFAULT_TIMEOUT_POST,
          new Error('Timeout reached trying to upload data to IPFS'),
        ),
    };
  }
  let pinataWithTimeout: IPFSWithTimeout | undefined;

  if (pinataClient) {
    pinataWithTimeout = {
      addString: async (data) =>
        raceAgainstTimeout(
          pinataClient.addJSON(data),
          DEFAULT_TIMEOUT_POST,
          new Error('Timeout reached trying to upload data to IPFS via Pinata'),
        ),
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
