module.exports = {
  createColonyMetadata: /* GraphQL */ `
    mutation CreateColonyMetadata($input: CreateColonyMetadataInput!) {
      createColonyMetadata(input: $input) {
        id
      }
    }
  `,
  getInviteCodeValidity: /* GraphQL */ `
    query GetInviteCodeValidity($id: ID!) {
      getPrivateBetaInviteCode(id: $id) {
        shareableInvites
        userId
      }
    }
  `,
  updateInviteCodeValidity: /* GraphQL */ `
    mutation UpdateInviteCodeValidity(
      $input: UpdatePrivateBetaInviteCodeInput!
      $condition: ModelPrivateBetaInviteCodeConditionInput
    ) {
      updatePrivateBetaInviteCode(input: $input, condition: $condition) {
        id
      }
    }
  `,
  updateUser: /* GraphQL */ `
    mutation UpdateUser($input: UpdateUserInput!) {
      updateUser(input: $input) {
        id
      }
    }
  `,
};
