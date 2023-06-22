import React, { FC, useMemo, useState } from 'react';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import { UserBadgesProps } from './types';

const UserBadges: FC<UserBadgesProps> = ({ size, type, isStatus = false }) => {
  const [iconName, setIconName] = useState<string | undefined>(undefined);
  const [badgeColor, setBadgeColor] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('');

  useMemo(() => {
    switch (type) {
      case 'dedicated':
        setIconName('medal');
        setBadgeColor(isStatus ? 'bg-blue-100' : 'bg-blue-400');
        setTextColor(isStatus ? 'text-blue-400' : 'text-base-white');
        break;
      case 'active':
        setIconName('shooting-star');
        setBadgeColor(isStatus ? 'bg-orange-100' : 'bg-orange-400');
        setTextColor(isStatus ? 'text-orange-400' : 'text-base-white');
        break;
      case 'new':
        setIconName('hand-heart');
        setBadgeColor(isStatus ? 'bg-green-100' : 'bg-green-400');
        setTextColor(isStatus ? 'text-green-400' : 'text-base-white');
        break;
      case 'top':
        setIconName('crown-simple');
        setBadgeColor(isStatus ? 'bg-purple-100' : 'bg-purple-400');
        setTextColor(isStatus ? 'text-purple-400' : 'text-base-white');
        break;
      case 'banned':
        setIconName(undefined);
        setBadgeColor('bg-negative-100');
        setTextColor('text-negative-400');
        break;
      case 'team':
        setIconName(undefined);
        setBadgeColor('bg-purple-100');
        setTextColor('text-purple-400');
        break;
      default:
        setIconName(undefined);
        break;
    }
  }, [isStatus, type]);

  return (
    <div
      className={clsx(
        badgeColor,
        textColor,
        'inline-flex items-center justify-center rounded-3xl px-3 py-1',
      )}
    >
      {iconName && (
        <Icon
          name={iconName}
          appearance={{
            size: size === 'medium' ? 'tiny' : 'extraTiny',
          }}
        />
      )}
      <span
        className={clsx('font-medium capitalize', {
          'text-sm': size === 'medium',
          'text-xs': size === 'small',
          'ml-1': iconName,
        })}
      >
        {`${type}`}
      </span>
    </div>
  );
};

export default UserBadges;
