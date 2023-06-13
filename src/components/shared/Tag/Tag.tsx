import React, { HTMLAttributes, ReactNode } from 'react';

import Icon from '~shared/Icon';
import { useMainClasses } from '~hooks';
import { formatText } from '~utils/intl';

import styles from './Tag.css';
import { Message, UniversalMessageValues } from '~types';

export enum TagTheme {
  Primary = 'primary',
  Light = 'light',
  Golden = 'golden',
  Danger = 'danger',
  Pink = 'pink',
  Blue = 'blue',
  DangerGhost = 'dangerGhost',
  Banned = 'banned',
}

export enum TagColorSchema {
  FullColor = 'fullColor',
  Inverted = 'inverted',
  Plain = 'plain',
}

export interface TagAppearance {
  theme: `${TagTheme}`;
  fontSize?: 'tiny' | 'small';
  colorSchema?: `${TagColorSchema}`;
  margin?: 'none';
}

interface Props extends HTMLAttributes<HTMLSpanElement> {
  /** Appearance object */
  appearance?: TagAppearance;
  /** Child to render instead of passing text as prop */
  children?: ReactNode;
  /** Text to display in the tag */
  text?: Message;
  /** Text values for intl interpolation */
  textValues?: UniversalMessageValues;
}

const displayName = 'Tag';

const Tag = ({
  appearance,
  children,
  className,
  text,
  textValues,
  ...rest
}: Props) => {
  const classNames = useMainClasses(appearance, styles, className);
  return (
    <span className={classNames} {...rest}>
      {appearance?.theme === 'banned' && (
        <Icon
          title={text}
          name="emoji-goblin"
          appearance={{ size: 'normal' }}
          className={styles.icon}
        />
      )}
      {text ? formatText(text, textValues) : children}
    </span>
  );
};

Tag.displayName = displayName;

export default Tag;
