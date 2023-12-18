import IPFS from 'ipfs';

class IPFSNode {
  static getIpfsConfig = () => ({
    repo: 'colonyCDappLocalDevelopmentIPFS',
    // config gets merged with the IPFS default config
    config: {
      Bootstrap: [],
    },
    preload: { enabled: false, addresses: [] },
  });

  _ipfs: IPFS;

  ready: Promise<boolean>;

  constructor() {
    const promise = IPFS.create(IPFSNode.getIpfsConfig()).then((ipfs) => {
      this._ipfs = ipfs;
    });
    this.ready = promise.then(() => true);
  }

  /** Get the IPFS instance */
  getIPFS() {
    return this._ipfs;
  }

  /** Upload a string */
  async addString(data: string): Promise<string> {
    await this.ready;
    const resultIterator = await this._ipfs.add(data);
    const {
      value: { path },
    } = await resultIterator.next();
    return path;
  }

  /** Start the connection to IPFS (if not connected already) */
  start(): Promise<void> {
    return this._ipfs.start();
  }

  /** Stop the connection to IPFS */
  async stop(): Promise<void> {
    return this._ipfs.stop();
  }
}

export default IPFSNode;
