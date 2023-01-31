const {
  providers,
  utils: { Logger },
} = require('ethers');
const { getColonyNetworkClient, Network } = require('@colony/colony-js');

const { graphqlRequest } = require('./utils');

const {
  etherRouterAddress: networkAddress,
} = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');

/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const { listDomains, createDomain } = require('./graphql');

Logger.setLogLevel(Logger.levels.ERROR);

/*
 * @TODO These values need to be imported properly, and differentiate based on environment
 */
const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI = 'http://localhost:20002/graphql';
const RPC_URL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks

const provider = new providers.JsonRpcProvider(RPC_URL);

exports.handler = async (event) => {
  const {
    name,
    description,
    /*
     * @TODO This needs to keep up, and/or track the DomainColor type
     */
    color = 'LIGHTPINK',
    parentId = 1,
    colonyAddress,
  } = event.arguments?.input || {};

  const networkClient = await getColonyNetworkClient(Network.Custom, provider, {
    networkAddress,
  });

  const colonyClient = await networkClient.getColonyClient(colonyAddress);

  const existingDomainsQuery = await graphqlRequest(
    listDomains,
    { colonyAddress },
    GRAPHQL_URI,
    API_KEY,
  );
  const { items: existingDomains = [] } =
    existingDomainsQuery?.data?.listDomains || {};

  /*
   * Set up the new domain
   */
  const computedParentId = `${colonyAddress}_${
    !existingDomains?.length ? null : parentId
  }`;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const nextNativeDomainId = existingDomains?.length + 1;
  const nextDomainId = `${colonyAddress}_${nextNativeDomainId}`;
  const nextDomainName = nextNativeDomainId === 1 ? 'Root' : name;

  const { skillId, fundingPotId } = await colonyClient.getDomain(
    nextNativeDomainId,
  );

  /*
   * @TODO Confirm the domain actually exists on chain before creating it,
   * maybe even use the id returned by getDomain as a sanity check for `nextNativeDomainId`
   *
   * Yes, this will increase node requests expenses, but will ensure better
   * data synchronicity across the chain and database
   */

  /*
   * Create the domain
   */
  const mutation = await graphqlRequest(
    createDomain,
    {
      input: {
        id: nextDomainId,
        nativeId: nextNativeDomainId,
        nativeFundingPotId: fundingPotId.toNumber(),
        nativeSkillId: skillId.toNumber(),
        name: nextDomainName,
        description,
        color,
        colonyDomainsId: colonyAddress,
        domainParentId: computedParentId,
      },
    },
    GRAPHQL_URI,
    API_KEY,
  );

  return mutation?.data?.createDomain;
};
