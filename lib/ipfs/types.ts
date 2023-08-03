export interface IPFSOptions {
  repo: string;
  config: {
    Bootstrap: string[];
    Addresses: {
      Swarm: string[];
    };
    Discovery?: {
      webRTCStar: {
        enabled: boolean;
      };
    };
  };
  EXPERIMENTAL: {
    pubsub: boolean;
  };
}
