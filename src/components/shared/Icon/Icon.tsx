import React, { HTMLAttributes } from 'react';
import { MessageDescriptor } from 'react-intl';

import { SimpleMessageValues } from '~types';
import { getMainClasses } from '~utils/css';
import { formatText } from '~utils/intl';

import {
  icons as iconNames,
  multiColorIcons as multiColorIconNames,
} from '~images/icons.json';

import styles from './Icon.module.css';

const displayName = 'Icon';

type Appearance = {
  theme?: 'primary' | 'invert';
  size?:
    | 'extraExtraTiny'
    | 'extraTiny'
    | 'tiny'
    | 'extraSmall'
    | 'small'
    | 'normal'
    | 'medium'
    | 'big'
    | 'extraBig'
    | 'large'
    | 'huge';
};

export interface IconProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Appearance object */
  appearance?: Appearance;

  /** Disallow children */
  children?: never;

  /** className for icon. Will override anything in appearance */
  className?: string;

  /** Name of icon sprite */
  name: string;

  /** Html title for the icon element */
  title?: string | MessageDescriptor;

  /** Values for html title (react-intl interpolation) */
  titleValues?: SimpleMessageValues;

  /** SVG viewbox string */
  viewBox?: string;
}

const getIcons = (map: string[]) =>
  map.reduce((prev, current) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require, no-param-reassign
    prev[current] = require(`~images/icons/${current}.svg`);
    return prev;
  }, {});

const icons = getIcons(iconNames);
const multiColorIcons = getIcons(multiColorIconNames);

const Icon = ({
  appearance = { size: 'normal', theme: 'primary' },
  className,
  viewBox: viewBoxOverride = '0 0 30 30',
  name,
  title,
  titleValues,
  ...props
}: IconProps) => {
  // Remove the theme if it's a multiColor icon
  const multiColorAppearance = multiColorIcons[name]
    ? { size: appearance.size || 'normal' }
    : null;
  const icon = icons[name] || multiColorIcons[name];
  const iconHref = typeof icon === 'object' ? `#${icon.default.id}` : icon;
  const iconTitle = formatText(title, titleValues);
  return (
    <i
      title={title ? iconTitle : undefined}
      className={`${getMainClasses(
        multiColorAppearance || appearance,
        styles,
      )} ${className || ''}`}
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
