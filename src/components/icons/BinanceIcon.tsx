import { type Icon, IconBase, type IconWeight } from '@phosphor-icons/react';
import React, { forwardRef, type ReactElement } from 'react';

const SVG = (
  <>
    <circle fill="#213147" cx="22" cy="22" r="22" />
    <path
      fill="#F0B90B"
      d="M22 44c12.15 0 22-9.85 22-22S34.15 0 22 0 0 9.85 0 22s9.85 22 22 22Z"
    />
    <path
      fill="#fff"
      d="M13.935 11.74 22 7.215l8.067 4.525-2.957 1.675L22 10.558l-5.098 2.855-2.967-1.673Zm16.132 5.717-2.957-1.675L22 18.64l-5.098-2.858-2.965 1.675V20.8l5.092 2.86v5.708l2.973 1.675 2.965-1.675V23.66l5.102-2.86-.002-3.343Zm0 9.06V23.17l-2.957 1.675v3.343l2.957-1.67Zm2.11 1.183-5.1 2.85v3.353l8.066-4.535v-9.053l-2.965 1.668V27.7Zm-2.965-13.098 2.958 1.675v3.342l2.973-1.667v-3.35l-2.965-1.677-2.966 1.684v-.007ZM19.027 31.769v3.343L22 36.787l2.965-1.675v-3.337L22 33.443l-2.965-1.676-.008.002Zm-5.092-5.257 2.957 1.675v-3.343l-2.957-1.677v3.354-.01Zm5.092-11.91L22 16.275l2.965-1.675L22 12.923l-2.965 1.684-.008-.005Zm-7.205 1.675 2.966-1.675-2.958-1.677-2.97 1.684v3.347l2.963 1.667v-3.346Zm0 5.708-2.965-1.668v9.053l8.068 4.534v-3.36l-5.095-2.852v-5.717l-.008.01Z"
    />
  </>
);

const weights = new Map<IconWeight, ReactElement>([['regular', SVG]]);

const BinanceIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} viewBox="0 0 44 44" weights={weights} />
));

BinanceIcon.displayName = 'BinanceIcon';

export default BinanceIcon;
