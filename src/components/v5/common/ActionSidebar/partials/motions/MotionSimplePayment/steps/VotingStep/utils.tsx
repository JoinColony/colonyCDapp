import { MotionVote } from '~utils/colonyMotions';
import { formatText } from '~utils/intl';

export const renderVoteRadioButtons = (
  hasUserVoted: boolean,
  userVote: number,
) => {
  const supportOption = {
    label: formatText({ id: 'motion.support' }),
    id: 'support',
    value: MotionVote.Yay,
    colorClassName: 'text-purple-200',
    iconName: 'thumbs-up',
  };
  const opposeOption = {
    label: formatText({ id: 'motion.oppose' }),
    id: 'oppose',
    value: MotionVote.Nay,
    colorClassName: 'text-negative-300',
    iconName: 'thumbs-down',
  };

  if (!hasUserVoted) {
    return [opposeOption, supportOption];
  }

  if (userVote === MotionVote.Nay) {
    return [supportOption];
  }

  return [opposeOption];
};
