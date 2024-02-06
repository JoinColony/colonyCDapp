import { type Icon, IconBase, type IconWeight } from '@phosphor-icons/react';
import React, { forwardRef, type ReactElement } from 'react';

const SVG = (
  <>
    <defs>
      <g id="eu-d">
        <g id="eu-b">
          <path id="eu-a" d="m0-1-.3 1 .5.1z" />
          <use xlinkHref="#eu-a" transform="scale(-1 1)" />
        </g>
        <g id="eu-c">
          <use xlinkHref="#eu-b" transform="rotate(72)" />
          <use xlinkHref="#eu-b" transform="rotate(144)" />
        </g>
        <use xlinkHref="#eu-c" transform="scale(-1 1)" />
      </g>
      <clipPath id="circle-clip-eu">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
    </defs>
    <g clipPath="url(#circle-clip-eu)">
      <path fill="#039" d="M0 0h512v512H0z" />
      <g fill="#fc0" transform="translate(256 258.4)scale(25.28395)">
        <use xlinkHref="#eu-d" width="100%" height="100%" y="-6" />
        <use xlinkHref="#eu-d" width="100%" height="100%" y="6" />
        <g id="eu-e">
          <use xlinkHref="#eu-d" width="100%" height="100%" x="-6" />
          <use
            xlinkHref="#eu-d"
            width="100%"
            height="100%"
            transform="rotate(-144 -2.3 -2.1)"
          />
          <use
            xlinkHref="#eu-d"
            width="100%"
            height="100%"
            transform="rotate(144 -2.1 -2.3)"
          />
          <use
            xlinkHref="#eu-d"
            width="100%"
            height="100%"
            transform="rotate(72 -4.7 -2)"
          />
          <use
            xlinkHref="#eu-d"
            width="100%"
            height="100%"
            transform="rotate(72 -5 .5)"
          />
        </g>
        <use
          xlinkHref="#eu-e"
          width="100%"
          height="100%"
          transform="scale(-1 1)"
        />
      </g>
    </g>
  </>
);

const weights = new Map<IconWeight, ReactElement>([['regular', SVG]]);

const FlagEuIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} />
));

FlagEuIcon.displayName = 'FlagEuIcon';

export default FlagEuIcon;
