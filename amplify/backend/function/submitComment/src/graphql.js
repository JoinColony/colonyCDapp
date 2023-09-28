module.exports = {
  getDiscussion: /* GraphQL */ `
    query GetDiscussion($id: ID!) {
      getDiscussion(id: $id) {
        id
      }
    }
  `,
  createDiscussion: /* GraphQL */ `
    mutation CreateDiscussion(
      $input: CreateDiscussionInput!
      $condition: ModelDiscussionConditionInput
    ) {
      createDiscussion(input: $input, condition: $condition) {
        id
      }
    }
  `,
  createComment: /* GraphQL */ `
    mutation CreateComment(
      $input: CreateCommentInput!
      $condition: ModelCommentConditionInput
    ) {
      createComment(input: $input, condition: $condition) {
        id
        commentCommentsId
        content
        createdAt
        updatedAt
        flag
        author {
          id
          name
          profile {
            displayName
          }
        }
        __typename
      }
    }
  `,
  updateComment: /* GraphQL */ `
    mutation UpdateComment(
      $input: UpdateCommentInput!
      $condition: ModelCommentConditionInput
    ) {
      updateComment(input: $input, condition: $condition) {
        id
        commentCommentsId
        content
        flag
        __typename
      }
    }
  `,
};
