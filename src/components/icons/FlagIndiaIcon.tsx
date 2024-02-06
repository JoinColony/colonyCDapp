import { type Icon, IconBase, type IconWeight } from '@phosphor-icons/react';
import React, { forwardRef, type ReactElement } from 'react';

const SVG = (
  <>
    <defs>
      <clipPath id="circle-clip-india">
        <circle cx="256" cy="256" r="256" />
      </clipPath>
    </defs>
    <g clipPath="url(#circle-clip-india)">
      <path fill="#f93" d="M0 0h512v170.7H0z" />
      <path fill="#fff" d="M0 170.7h512v170.6H0z" />
      <path fill="#128807" d="M0 341.3h512V512H0z" />
      <g transform="translate(256 256)scale(3.41333)">
        <circle r="20" fill="#008" />
        <circle r="17.5" fill="#fff" />
        <circle r="3.5" fill="#008" />
        <g id="in-d">
          <g id="in-c">
            <g id="in-b">
              <g id="in-a" fill="#008">
                <circle r=".9" transform="rotate(7.5 -8.8 133.5)" />
                <path d="M0 17.5.6 7 0 2l-.6 5z" />
              </g>
              <use
                xlinkHref="#in-a"
                width="100%"
                height="100%"
                transform="rotate(15)"
              />
            </g>
            <use
              xlinkHref="#in-b"
              width="100%"
              height="100%"
              transform="rotate(30)"
            />
          </g>
          <use
            xlinkHref="#in-c"
            width="100%"
            height="100%"
            transform="rotate(60)"
          />
        </g>
        <use
          xlinkHref="#in-d"
          width="100%"
          height="100%"
          transform="rotate(120)"
        />
        <use
          xlinkHref="#in-d"
          width="100%"
          height="100%"
          transform="rotate(-120)"
        />
      </g>
    </g>
  </>
);

const weights = new Map<IconWeight, ReactElement>([['regular', SVG]]);

const FlagIndiaIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} />
));

FlagIndiaIcon.displayName = 'FlagIndiaIcon';

export default FlagIndiaIcon;
