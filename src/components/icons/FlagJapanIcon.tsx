import { type Icon, IconBase, type IconWeight } from '@phosphor-icons/react';
import React, { forwardRef, type ReactElement } from 'react';

const SVG = (
  <>
    <circle fill="#FBFBFB" cx="128" cy="128" r="126" />
    <circle
      fill="#BC002D"
      fillRule="evenodd"
      clipRule="evenodd"
      cx="128"
      cy="128"
      r="70"
    />
  </>
);

const weights = new Map<IconWeight, ReactElement>([['regular', SVG]]);

const FlagJapanIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} />
));

FlagJapanIcon.displayName = 'FlagJapanIcon';

export default FlagJapanIcon;
