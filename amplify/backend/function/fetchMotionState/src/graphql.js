const motionStakesFragment = /* GraphQL */ `
  fragment MotionStakeValues on MotionStakeValues {
    yay
    nay
  }
`;

const motionMessageFragment = /* GraphQL */ `
  fragment MotionMessage on MotionMessage {
    name
    messageKey
    initiatorAddress
    vote
    amount
  }
`;

module.exports = {
  getColonyAction: /* GraphQL */ `
    ${motionStakesFragment}
    ${motionMessageFragment}
    query GetColonyAction($id: ID!) {
      getColonyAction(id: $id) {
        motionData {
          motionId
          nativeMotionId
          motionStakes {
            raw {
              ...MotionStakeValues
            }
            percentage {
              ...MotionStakeValues
            }
          }
          usersStakes {
            address
            stakes {
              raw {
                ...MotionStakeValues
              }
              percentage {
                ...MotionStakeValues
              }
            }
          }
          remainingStakes
          userMinStake
          requiredStake
          rootHash
          motionDomainId
          stakerRewards {
            address
            rewards {
              yay
              nay
            }
            isClaimed
          }
          isFinalized
          voterRecord {
            address
            voteCount
            vote
          }
          revealedVotes {
            raw {
              yay
              nay
            }
            percentage {
              yay
              nay
            }
          }
          skillRep
          repSubmitted
          createdBy
          hasObjection
          messages {
            ...MotionMessage
          }
        }
      }
    }
  `,
  updateColonyAction: /* GraphQL */ `
    mutation UpdateColonyAction($id: ID!, $motionData: MotionDataInput!) {
      updateColonyAction(input: { id: $id, motionData: $motionData }) {
        id
      }
    }
  `,
};
