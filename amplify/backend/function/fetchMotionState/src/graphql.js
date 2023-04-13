const motionStakesFragment = /* GraphQL */ `
  fragment MotionStakeValues on MotionStakeValues {
    yay
    nay
  }
`;

module.exports = {
  getColonyAction: /* GraphQL */ `
    ${motionStakesFragment}
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
