/**
 * @NOTE The function return type is defined in the schema as returning
 * Domain and Token object types, so we have to maintain those
 * fragments to include all the possible fields of those types
 * They still omit some fields (e.g. Token's colonies) and if
 * an attempt is made on the frontend to query those, the lambda function
 * will fail
 */
const tokenFragment = /* GraphQL */ `
  fragment Token on Token {
    chainMetadata {
      chainId
      network
    }
    createdAt
    decimals
    id
    name
    symbol
    type
    updatedAt
    thumbnail
  }
`;

const domainFragment = /* GraphQL */ `
  fragment Domain on Domain {
    id
    colonyId
    nativeId
    nativeFundingPotId
    nativeSkillId
    isRoot
    metadata {
      id
      name
      description
      color
      changelog {
        transactionHash
        oldName
        newName
        oldColor
        newColor
        oldDescription
        newDescription
      }
    }
  }
`;

module.exports = {
  getColony: /* GraphQL */ `
    ${tokenFragment}
    ${domainFragment}
    query GetColony($address: ID!) {
      getColony(id: $address) {
        chainMetadata {
          chainId
          network
        }
        domains {
          items {
            ...Domain
          }
        }
        tokens {
          items {
            token {
              ...Token
            }
          }
        }
      }
    }
  `,
};
