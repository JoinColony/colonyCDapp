import getIPFSWithFallback from './getIpfsWithFallback.ts';
import IPFSNode from './ipfsnode/index.ts';

const ipfsWithFallback = getIPFSWithFallback(new IPFSNode());

export default ipfsWithFallback;
