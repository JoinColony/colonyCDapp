import React, { HTMLAttributes } from 'react';
import { MessageDescriptor } from 'react-intl';

import Icon from '~shared/Icon';
import { useMainClasses } from '~hooks';
import { formatText } from '~utils/intl';

import styles from './Tag.css';

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

export interface Appearance {
  /* "light" is default */
  theme: `${TagTheme}`;
  fontSize?: 'tiny' | 'small';
  /* "fullColor" is default */
  colorSchema?: `${TagColorSchema}`;
  margin?: 'none';
}

interface Props extends HTMLAttributes<HTMLSpanElement> {
  /** Appearance object */
  appearance?: Appearance;
  /** Text to display in the tag */
  text: MessageDescriptor | string;
  /** Text values for intl interpolation */
  textValues?: { [key: string]: string };
}

const displayName = 'Tag';

const Tag = ({ appearance, className, text, textValues, ...rest }: Props) => {
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
      {formatText(text, textValues)}
    </span>
  );
};

Tag.displayName = displayName;

export default Tag;
