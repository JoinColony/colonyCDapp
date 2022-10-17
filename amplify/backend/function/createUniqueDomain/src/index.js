/* eslint-disable @typescript-eslint/no-var-requires */

const { graphqlRequest } = require('./utils');

/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const { listDomains, createDomain } = require('./graphql');

/*
 * @TODO These values need to be imported properly, and differentiate based on environment
 */
const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI = 'http://localhost:20002/graphql';

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
  // console.log(name, description, color, parentId, colonyAddress);
  const existingDomainsQuery = await graphqlRequest(
    listDomains,
    {},
    GRAPHQL_URI,
    API_KEY,
  );
  const { items: existingDomains = [] } =
    existingDomainsQuery?.data?.listDomains || {};

  /*
   * Set up the new domain
   */
  const computedParentId = !existingDomains?.length ? null : parentId;
  // eslint-disable-next-line no-unsafe-optional-chaining
  const nextNativeDomainId = existingDomains?.length + 1;
  const nextDomainId = `${colonyAddress}_${nextNativeDomainId}`;
  const nextDomainName = nextNativeDomainId === 1 ? 'Root' : name;

  /*
   * Create the domain
   */
  const mutation = await graphqlRequest(
    createDomain,
    {
      input: {
        id: nextDomainId,
        nativeId: nextNativeDomainId,
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
