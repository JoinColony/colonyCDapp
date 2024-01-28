import { MotionVote } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import { type ButtonRadioButtonItem } from '~v5/common/Fields/RadioButtons/ButtonRadioButtons/types.ts';

export const supportOption = {
  label: formatText({ id: 'motion.support' }),
  id: 'support',
  value: MotionVote.Yay,
  colorClassName: 'text-purple-200',
  checkedColorClassName: 'bg-purple-400 border-purple-400',
  iconClassName: 'text-purple-400',
  hoverColorClassName: 'md:hover:text-purple-400 md:hover:border-purple-400',
  iconName: 'thumbs-up',
};

export const opposeOption = {
  label: formatText({ id: 'motion.oppose' }),
  id: 'oppose',
  value: MotionVote.Nay,
  colorClassName: 'text-negative-300',
  checkedColorClassName: 'bg-negative-400 border-negative-400',
  iconClassName: 'text-negative-400',
  hoverColorClassName:
    'md:hover:text-negative-400 md:hover:border-negative-400',
  iconName: 'thumbs-down',
};

export const STAKING_RADIO_BUTTONS: ButtonRadioButtonItem<MotionVote>[] = [
  opposeOption,
  supportOption,
];
