import { MotionState } from '~utils/colonyMotions';

const motionStatesMessageDescriptors = {
  'motion.state': `{state, select,
      ${MotionState.Supported} {Staked}
      ${MotionState.Staking} {Staking}
      ${MotionState.Voting} {Voting}
      ${MotionState.Reveal} {Reveal}
      ${MotionState.Opposed} {Objected}
      ${MotionState.Motion} {Motion}
      ${MotionState.Failed} {Failed}
      ${MotionState.Finalizable} {Finalizable}
      ${MotionState.Passed} {Passed}
      ${MotionState.FailedNotFinalizable} {Failed}
      ${MotionState.Invalid} {Invalid}
      ${MotionState.Escalated} {Escalated}
      ${MotionState.Forced} {Forced}
      ${MotionState.Draft} {Draft}
      other {Unknown State}
    }`,
};

export default motionStatesMessageDescriptors;
