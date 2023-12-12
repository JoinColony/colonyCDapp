import IPFSNode from './ipfsnode';

import pinataClient from './pinataClient';
import getIPFSWithFallback from './getIpfsWithFallback';

const getIPFSContext = () => {
  if (
    process.env.NETWORK === 'ganache' ||
    !(process.env.PINATA_API_KEY && process.env.PINATA_API_SECRET)
  ) {
    const ipfsNode = new IPFSNode();
    return getIPFSWithFallback(ipfsNode);
  }
  return getIPFSWithFallback(undefined, pinataClient);
};

const ipfsWithFallback = getIPFSContext();

export default ipfsWithFallback;
