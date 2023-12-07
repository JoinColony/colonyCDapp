module.exports = {
  getColony: /* GraphQL */ `
    query GetColony($id: ID!) {
      getColonyByAddress(id: $id) {
        items {
          id
          name
        }
      }
      getColonyByType(type: METACOLONY) {
        items {
          id
          name
        }
      }
    }
  `,
  createColony: /* GraphQL */ `
    mutation CreateColony(
      $input: CreateColonyInput!
      $condition: ModelColonyConditionInput
    ) {
      createColony(input: $input, condition: $condition) {
        id
      }
    }
  `,
  createColonyTokens: /* GraphQL */ `
    mutation CreateColonyTokens($input: CreateColonyTokensInput!) {
      createColonyTokens(input: $input) {
        id
      }
    }
  `,
  createDomain: /* GraphQL */ `
    mutation CreateDomain($input: CreateDomainInput!) {
      createDomain(input: $input) {
        id
      }
    }
  `,
  createDomainMetadata: /* GraphQL */ `
    mutation CreateDomainMetadata($input: CreateDomainMetadataInput!) {
      createDomainMetadata(input: $input) {
        id
      }
    }
  `,
  getColonyMetadata: /* GraphQL */ `
    query GetColonyMetadata($id: ID!) {
      getColonyMetadata(id: $id) {
        id
        etherealData {
          colonyAvatar
          colonyDisplayName
          colonyName
          colonyThumbnail
          initiatorAddress
          tokenAvatar
          tokenThumbnail
        }
      }
    }
  `,
  createColonyMetadata: /* GraphQL */ `
    mutation CreateColonyMetadata($input: CreateColonyMetadataInput!) {
      createColonyMetadata(input: $input) {
        id
      }
    }
  `,
  deleteColonyMetadata: /* GraphQL */ `
    mutation DeleteColonyMetadata($input: DeleteColonyMetadataInput!) {
      deleteColonyMetadata(input: $input) {
        id
      }
    }
  `,
  getTokenFromEverywhere: /* GraphQL */ `
    query GetTokenFromEverywhere($input: TokenFromEverywhereArguments!) {
      getTokenFromEverywhere(input: $input) {
        items {
          id
        }
      }
    }
  `,
  createColonyMemberInvite: /* GraphQL */ `
    mutation CreateColonyMemberInvite(
      $input: CreateColonyMemberInviteInput!
      $condition: ModelColonyMemberInviteConditionInput
    ) {
      createColonyMemberInvite(input: $input, condition: $condition) {
        id
      }
    }
  `,
};
