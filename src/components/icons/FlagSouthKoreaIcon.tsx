import { type Icon, IconBase, type IconWeight } from '@phosphor-icons/react';
import React, { forwardRef, type ReactElement } from 'react';

const SVG = (
  <>
    <clipPath id="circle-clip-kr">
      <circle cx="256" cy="256" r="256" />
    </clipPath>
    <g clipPath="url(#circle-clip-kr)">
      <path fill="#fff" fillRule="evenodd" d="M0 0h512v512H0Z" />
      <g fillRule="evenodd" transform="rotate(-56.3 367.2 -111.2)scale(9.375)">
        <g id="kr-b">
          <path
            id="kr-a"
            fill="#000001"
            d="M-6-26H6v2H-6Zm0 3H6v2H-6Zm0 3H6v2H-6Z"
          />
          <use xlinkHref="#kr-a" width="100%" height="100%" y="44" />
        </g>
        <path stroke="#fff" d="M0 17v10" />
        <path fill="#cd2e3a" d="M0-12a12 12 0 0 1 0 24Z" />
        <path fill="#0047a0" d="M0-12a12 12 0 0 0 0 24A6 6 0 0 0 0 0Z" />
        <circle cy="-6" r="6" fill="#cd2e3a" />
      </g>
      <g fillRule="evenodd" transform="rotate(-123.7 196.5 59.5)scale(9.375)">
        <use xlinkHref="#kr-b" width="100%" height="100%" />
        <path stroke="#fff" d="M0-23.5v3M0 17v3.5m0 3v3" />
      </g>
    </g>
  </>
);

const weights = new Map<IconWeight, ReactElement>([['regular', SVG]]);

const FlagSouthKoreaIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} />
));

FlagSouthKoreaIcon.displayName = 'FlagSouthKoreaIcon';

export default FlagSouthKoreaIcon;
