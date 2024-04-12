import { MotionState } from '~utils/colonyMotions.ts';

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
      ${MotionState.Uninstalled} {Uninstalled}
      ${MotionState.ExtensionDeprecated} {Deprecated}
      ${MotionState.Escalated} {Escalated}
      ${MotionState.Forced} {Forced}
      ${MotionState.Draft} {Draft}
      ${MotionState.Unknown} {Unknown}
      other {Generic action we don't have information about}
    }`,
};

export default motionStatesMessageDescriptors;
