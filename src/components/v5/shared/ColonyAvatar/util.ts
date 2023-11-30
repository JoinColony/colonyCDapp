import { ColonyAvatarProps } from './types';

export const getBlockieSize = (size: ColonyAvatarProps['size']) => {
  switch (size) {
    case 'medium':
      return 'smx';
    case 'mediumSmallMediumLargeSmallTinyBigMediumLargeSmall':
      return 'xxsm';
    case 'small':
      return 'xss';
    case 'extraBig':
    default:
      return 's';
  }
};
