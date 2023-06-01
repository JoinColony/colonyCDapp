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
  getColonyMotion: /* GraphQL */ `
    ${motionStakesFragment}
    ${motionMessageFragment}
    query GetColonyMotion($id: ID!) {
      getColonyMotion(id: $id) {
        id
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
        nativeMotionDomainId
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
        motionStateHistory {
          hasVoted
          hasPassed
          hasFailed
          hasFailedNotFinalizable
          inRevealPhase
        }
        messages {
          ...MotionMessage
        }
      }
    }
  `,
  updateColonyMotion: /* GraphQL */ `
    mutation UpdateColonyMotion($input: UpdateColonyMotionInput!) {
      updateColonyMotion(input: $input) {
        id
      }
    }
  `,
};
