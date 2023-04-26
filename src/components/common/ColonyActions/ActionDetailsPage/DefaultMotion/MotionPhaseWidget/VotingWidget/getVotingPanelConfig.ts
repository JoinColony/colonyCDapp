import { CustomRadioProps } from '~shared/Fields';
import { MotionVote } from '~utils/colonyMotions';

const getIcon = (
  inputDisabled: boolean,
  vote: MotionVote,
  checkedValue?: MotionVote,
) => {
  const direction = vote === MotionVote.Nay ? 'down' : 'up';
  const icon = `circle-thumbs-${direction}`;
  if (inputDisabled) {
    return `${icon}-grey`;
  }

  if (checkedValue === vote) {
    return icon;
  }

  return `${icon}-outlined`;
};

export const getVotingPanelConfig = (
  checkedValue: MotionVote,
  inputDisabled: boolean,
): Omit<CustomRadioProps, 'checked' | 'name'>[] => [
  {
    value: MotionVote.Yay,
    label: { id: 'button.yes' },
    appearance: {
      theme: 'primary',
    },
    icon: getIcon(inputDisabled, MotionVote.Yay, checkedValue),
    dataTest: 'yesVoteButton',
  },
  {
    value: MotionVote.Nay,
    label: { id: 'button.no' },
    appearance: {
      theme: 'danger',
    },
    icon: getIcon(inputDisabled, MotionVote.Nay, checkedValue),
  },
];
