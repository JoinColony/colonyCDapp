/* eslint-disable max-len */

import { SystemMessages } from '~types';

const systemMessagesMessageDescriptors = {
  'systemMessage.title': `{eventName, select,
      ${SystemMessages.EnoughExitRecoveryApprovals} {Enough permission holders have now signed to exit recovery mode. As long as no further storage slots are updated, a recovery permission holder may now sign a transaction to reactivate the colony.}
      ${SystemMessages.MotionHasPassed} {{motionTag} has {passedTag} and may be finalized.}
      ${SystemMessages.MotionRevealPhase} {It's time to {revealTag} votes to the world!}
      ${SystemMessages.MotionHasFailedNotFinalizable} {{motionTag} has failed.}
      ${SystemMessages.MotionHasFailedFinalizable} {{motionTag} has {failedTag} and may be finalized.}
      ${SystemMessages.MotionVotingPhase} {{votingTag} has started! Voting is secret 🤫, and weighted by Reputation.}
      ${SystemMessages.MotionFullyStaked} {{motionTag} is fully staked; Staking period has reset. As long as there is no {objectionTag} , the motion will pass.}
      ${SystemMessages.MotionFullyStakedAfterObjection} {{motionTag} is fully staked.}
      ${SystemMessages.ObjectionFullyStaked} {{objectionTag} is fully staked; Staking period has reset. If the {motionTag} gets fully staked, a vote will start immediately; if not, the {motionTag} will fail.}
      ${SystemMessages.MotionRevealResultObjectionWon} {{motionTag} failed. {voteResultsWidget} The motion will fail at the end of the escalation period unless the dispute is escalated to a higher team.}
      ${SystemMessages.MotionRevealResultMotionWon} {{motionTag} passed! {voteResultsWidget} The motion will pass at the end of the escalation period unless the dispute is escalated to a higher team.}
      ${SystemMessages.MotionCanBeEscalated} {{escalateTag} period started. {spaceBreak}{spaceBreak} If you believe this result was unfair, and would be different if more people were involved, you may escalate it to a higher team.}
      other {Generic system message}
    }`,
};

export default systemMessagesMessageDescriptors;
