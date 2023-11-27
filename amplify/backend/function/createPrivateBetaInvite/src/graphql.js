module.exports = {
  createPrivateBetaInviteCode: /* GraphQL */ `
    mutation CreatePrivateBetaInviteCode($shareableInvites: Int!) {
      createPrivateBetaInviteCode(
        input: { shareableInvites: $shareableInvites }
      ) {
        id
      }
    }
  `,
};
