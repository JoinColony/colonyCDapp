import { MotionVote } from '~utils/colonyMotions';
import { formatText } from '~utils/intl';
import { ButtonRadioButtonItem } from '~v5/common/Fields/RadioButtons/ButtonRadioButtons/types';

// @TODO: Fix radio buttons colors

export const supportOption = {
  label: formatText({ id: 'motion.support' }),
  id: 'support',
  value: MotionVote.Yay,
  colorClassName: 'text-purple-200',
  iconClassName: 'text-purple-400',
  hoverColorClassName: 'md:hover:text-purple-400',
  iconName: 'thumbs-up',
};

export const opposeOption = {
  label: formatText({ id: 'motion.oppose' }),
  id: 'oppose',
  value: MotionVote.Nay,
  colorClassName: 'text-negative-300',
  iconClassName: 'text-negative-400',
  hoverColorClassName: 'md:hover:text-negative-400',
  iconName: 'thumbs-down',
};

export const STAKING_RADIO_BUTTONS: ButtonRadioButtonItem<MotionVote>[] = [
  supportOption,
  opposeOption,
];
