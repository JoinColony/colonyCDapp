import getIPFSWithFallback from './getIpfsWithFallback.ts';
import IPFSNode from './ipfsnode/index.ts';
import pinataClient from './pinataClient.ts';

const getIPFSContext = () => {
  if (
    import.meta.env.VITE_NETWORK === 'ganache' ||
    !(
      import.meta.env.VITE_PINATA_API_KEY &&
      import.meta.env.VITE_PINATA_API_SECRET
    )
  ) {
    const ipfsNode = new IPFSNode();
    return getIPFSWithFallback(ipfsNode);
  }
  return getIPFSWithFallback(undefined, pinataClient);
};

const ipfsWithFallback = getIPFSContext();

export default ipfsWithFallback;
