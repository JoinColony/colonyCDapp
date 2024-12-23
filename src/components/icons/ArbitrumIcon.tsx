import { type Icon, IconBase, type IconWeight } from '@phosphor-icons/react';
import React, { forwardRef, type ReactElement } from 'react';

const SVG = (
  <>
    <circle fill="#213147" cx="22" cy="22" r="22" />
    <path
      fill="#12AAFF"
      d="M27,17.3c0.1-0.3,0.5-0.3,0.5,0L33,32.6l-3.2,1.9l-4.5-12.3c-0.1-0.1-0.1-0.3,0-0.4L27,17.3z"
    />
    <path
      fill="#12AAFF"
      d="M22.7,29.1l1.6-4.4c0.1-0.3,0.5-0.3,0.5,0l3.8,10.4L25.5,37l-2.8-7.5C22.7,29.4,22.7,29.2,22.7,29.1z"
    />
    <path
      fill="#9DCCED"
      d="M35.2,13l-12.1-7c-0.4-0.2-0.8-0.3-1.3-0.3h-0.1c-0.5,0-0.9,0.1-1.3,0.3L8.4,13c-0.8,0.5-1.3,1.3-1.3,2.2v14
	c0,0.9,0.5,1.7,1.3,2.2l2.2,1.3l0.7-2l-1.8-1.1c-0.1-0.1-0.2-0.2-0.2-0.4v-14c0-0.1,0.1-0.3,0.2-0.4l12.1-7c0.1,0,0.1-0.1,0.2-0.1
	s0.1,0,0.2,0.1l12.1,7c0.1,0.1,0.2,0.2,0.2,0.4v14c0,0.1-0.1,0.3-0.2,0.4l-12.1,7c-0.1,0.1-0.1,0.1-0.2,0.1s-0.1,0-0.2-0.1L18.9,35
	l-0.7,2l2.4,1.4c0.4,0.2,0.8,0.3,1.3,0.3s0.9-0.1,1.3-0.3l12.1-7c0.8-0.5,1.3-1.3,1.3-2.2v-14C36.5,14.4,36,13.5,35.2,13z"
    />
    <path
      fill="#FFFFFF"
      d="M23.1,14.2h3c0.2,0,0.3,0.1,0.3,0.3L18.2,37L15,35.2l7.5-20.6C22.6,14.4,22.9,14.2,23.1,14.2z"
    />
    <path
      fill="#FFFFFF"
      d="M17.7,14.2h3c0.2,0,0.3,0.2,0.3,0.4l-7.3,19.9l-3.2-1.8l6.6-18.1C17.3,14.4,17.5,14.2,17.7,14.2z"
    />
  </>
);

const weights = new Map<IconWeight, ReactElement>([['regular', SVG]]);

const ArbitrumIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} viewBox="0 0 44 44" weights={weights} />
));

ArbitrumIcon.displayName = 'ArbitrumIcon';

export default ArbitrumIcon;
