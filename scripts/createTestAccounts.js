const ethers = require('ethers');
const { getColonyNetworkClient } = require('@colony/colony-js');

const { etherRouterAddress: networkAddress } = require('../src/lib/colonyNetwork/etherrouter-address.json');
const { private_keys } = require('../src/lib/colonyNetwork/ganache-accounts.json');

(async () => {
  const provider = new ethers.providers.JsonRpcProvider();

  console.log('\n', 'Creating Test User Accounts...', '\n');

  for (let index = 1; index < 6; index += 1) {
    const signer = provider.getSigner(Object.keys(private_keys)[index]);

    const networkClient = getColonyNetworkClient(
      'local',
      signer,
      { networkAddress },
    )

    await networkClient.registerUserLabel(`user${index + 1}`, '');
  }
})()
