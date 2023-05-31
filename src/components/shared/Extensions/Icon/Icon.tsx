import React, { FC } from 'react';

import { getMainClasses } from '~utils/css';
import { formatText } from '~utils/intl';
import { icons as iconNames, multiColorIcons as multiColorIconNames } from '~images/icons.json';
import styles from './Icon.module.css';
import { IconProps } from './types';

const displayName = 'Extensions.Icon';

const getIcons = (map: string[]) =>
  map.reduce((prev, current) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require, no-param-reassign
    prev[current] = require(`~images/icons/${current}.svg`);
    return prev;
  }, {});

const icons = getIcons(iconNames);
const multiColorIcons = getIcons(multiColorIconNames);

const Icon: FC<IconProps> = ({
  appearance = { size: 'normal', theme: 'primary' },
  className,
  viewBox: viewBoxOverride = '0 0 30 30',
  name,
  title,
  titleValues,
  ...props
}) => {
  const multiColorAppearance = multiColorIcons[name] ? { size: appearance.size || 'normal' } : null;
  const icon = icons[name] || multiColorIcons[name];
  const iconHref = typeof icon === 'object' ? `#${icon.default.id}` : icon;
  const iconTitle = formatText(title, titleValues);

  return (
    <i
      title={title ? iconTitle : undefined}
      className={className || getMainClasses(multiColorAppearance || appearance, styles)}
      {...props}
    >
      <svg viewBox={viewBoxOverride}>
        <use xlinkHref={iconHref} />
      </svg>
    </i>
  );
};

Icon.displayName = displayName;

export default Icon;
