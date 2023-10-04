import { MotionVote } from '~utils/colonyMotions';
import { formatText } from '~utils/intl';
import { ButtonRadioButtonItem } from '~v5/common/Fields/RadioButtons/ButtonRadioButtons/types';

export const STAKING_RADIO_BUTTONS: ButtonRadioButtonItem<MotionVote>[] = [
  {
    key: '1',
    value: MotionVote.Nay,
    label: formatText({ id: 'button.stake.oppose' }),
    colorClassName: 'text-negative-300',
    iconName: 'thumbs-down',
    id: 'oppose',
  },
  {
    key: '2',
    value: MotionVote.Yay,
    label: formatText({ id: 'button.stake.support' }),
    colorClassName: 'text-purple-400',
    iconName: 'thumbs-up',
    id: 'support',
  },
];
