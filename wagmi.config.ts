import { defineConfig } from '@wagmi/cli';
import { fetch } from '@wagmi/cli/plugins';
import { type Address } from 'viem';

interface Contract {
  name: string;
  address: Address;
  path: string;
}

const contracts: Contract[] = [
  {
    name: 'ColonyNetwork',
    // This is a little weird as the fetch plugin really requires an address, which is a bit too limiting
    // Just change this to something unique for every contract ABI we need (made up or actual address)
    address: '0x777760996135F0791E2e1a74aFAa060711197777',
    path: 'colonyNetwork/ColonyNetwork.sol/ColonyNetwork.json',
  },
  {
    name: 'Colony',
    // I just incremented the EtherRouter address by one. This is fake. Do not refer to it
    address: '0x777760996135F0791E2e1a74aFAa060711197778',
    path: 'colony/Colony.sol/Colony.json',
  },
];

export default defineConfig({
  out: 'src/constants/abis.ts',
  contracts: [],
  plugins: [
    fetch({
      contracts,
      async parse({ response }) {
        const { abi } = await response.json();
        return abi;
      },
      request(contract) {
        if (!contract.address) {
          throw new Error('Contract address is required');
        }
        const contractDefinition = contracts.find(
          ({ address }) => address === contract.address,
        );
        if (!contractDefinition) {
          throw new Error(
            `Could not find contract with address ${contract.address}`,
          );
        }
        return {
          // Anyone remember trufflepig?
          url: `http://localhost:3006/artifacts/contracts/${contractDefinition.path}`,
        };
      },
    }),
  ],
});
