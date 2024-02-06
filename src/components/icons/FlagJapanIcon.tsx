import { type Icon, IconBase, type IconWeight } from '@phosphor-icons/react';
import React, { forwardRef, type ReactElement } from 'react';

const SVG = (
  <>
    <defs>
      <clipPath id="jp-a">
        <path fillOpacity=".7" d="M177.2 0h708.6v708.7H177.2z" />
      </clipPath>
      <clipPath id="circle-clip-japan">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
    </defs>
    <g clipPath="url(#circle-clip-japan)">
      <g
        fillRule="evenodd"
        strokeWidth="1pt"
        clipPath="url(#jp-a)"
        transform="translate(-128)scale(.72249)"
      >
        <path fill="#fff" d="M0 0h1063v708.7H0z" />
        <circle
          cx="523.1"
          cy="344.1"
          r="194.9"
          fill="#bc002d"
          transform="translate(-59.7 -34.5)scale(1.1302)"
        />
      </g>
    </g>
  </>
);

const weights = new Map<IconWeight, ReactElement>([['regular', SVG]]);

const FlagJapanIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} />
));

FlagJapanIcon.displayName = 'FlagJapanIcon';

export default FlagJapanIcon;
