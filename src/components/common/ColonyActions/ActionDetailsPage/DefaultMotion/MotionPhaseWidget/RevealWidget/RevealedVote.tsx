import React from 'react';

import { CustomRadio } from '~shared/Fields';
import { MotionVote } from '~utils/colonyMotions';

const displayName =
  'common.ColonyActions.DefaultMotion.RevealWidget.RevealedVote';

interface RevealedVoteProps {
  vote: MotionVote;
}
const RevealedVote = ({ vote }: RevealedVoteProps) => {
  if (vote === MotionVote.Yay) {
    /*
     * @NOTE The radio is just for display purposes, we don't actually
     * want to use it as radio button
     */
    return (
      <CustomRadio
        value=""
        name="voteYes"
        label={{ id: 'button.yes' }}
        appearance={{ theme: 'primary' }}
        icon="circle-thumbs-up"
        checked
      />
    );
  }

  return (
    <CustomRadio
      value=""
      name="voteNo"
      label={{ id: 'button.no' }}
      appearance={{ theme: 'danger' }}
      icon="circle-thumbs-down"
      checked
    />
  );
};

RevealedVote.displayName = displayName;

export default RevealedVote;
