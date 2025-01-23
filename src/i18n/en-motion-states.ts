import { MotionState } from '~utils/colonyMotions.ts';

const motionStatesMessageDescriptors = {
  'motion.state': `{state, select,
      ${MotionState.Supported} {Supported}
      ${MotionState.Staking} {Staking}
      ${MotionState.Voting} {Voting}
      ${MotionState.Reveal} {Reveal}
      ${MotionState.Opposed} {Opposed}
      ${MotionState.Motion} {Motion}
      ${MotionState.Failed} {Failed}
      ${MotionState.Finalizable} {Finalizable}
      ${MotionState.Passed} {Passed}
      ${MotionState.FailedNotFinalizable} {Failed}
      ${MotionState.Invalid} {Invalid}
      ${MotionState.Escalated} {Escalated}
      ${MotionState.Forced} {Forced}
      ${MotionState.Draft} {Draft}
      ${MotionState.Open} {Open}
      ${MotionState.Rejected} {Rejected}
      ${MotionState.Unknown} {Unknown}
      ${MotionState.Uninstalled} {Uninstalled}
      other {Generic action we don't have information about}
    }`,
};

export default motionStatesMessageDescriptors;
