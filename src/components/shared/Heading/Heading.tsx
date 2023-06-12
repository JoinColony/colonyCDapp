import React, { HTMLAttributes, ReactNode } from 'react';

import { Message, UniversalMessageValues } from '~types';
import { getMainClasses } from '~utils/css';
import { formatText } from '~utils/intl';

import styles from './Heading.css';

const displayName = 'Heading';

export type HeadingAppearance = {
  theme?: 'primary' | 'dark' | 'invert' | 'uppercase' | 'grey';
  margin?: 'none' | 'small' | 'double';
  size: 'tiny' | 'small' | 'normal' | 'medium' | 'large' | 'huge';
  weight?: 'thin' | 'medium' | 'bold';
};

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Appearance object */
  appearance?: HeadingAppearance;

  /** String that will hard set the heading element to render */
  tagName?: string;

  /** Used to extend the functionality of the component. This will not generate a title attribute on the element. */
  children?: ReactNode;

  /** A string or a `MessageDescriptor` that make up the headings's text */
  text?: Message;

  /** Values for text (react-intl interpolation) */
  textValues?: UniversalMessageValues;
}

const Heading = ({
  appearance = { size: 'huge' },
  children,
  tagName,
  text,
  textValues,
  ...props
}: HeadingProps) => {
  const { size } = appearance;
  const HeadingElement: any =
    tagName ||
    {
      huge: 'h1',
      large: 'h2',
      medium: 'h3',
      normal: 'h4',
      small: 'h5',
      tiny: 'h6',
    }[size || 'huge'];

  const value = formatText(text, textValues) || '';
  return (
    <HeadingElement // If `value` is of type `Node` (i.e. children prop), don't add broken title.
      title={typeof value === 'string' ? value : null}
      className={getMainClasses(appearance, styles)}
      {...props}
    >
      {children || value}
    </HeadingElement>
  );
};

Heading.displayName = displayName;

export default Heading;
