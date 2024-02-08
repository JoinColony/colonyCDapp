import { type Icon, IconBase, type IconWeight } from '@phosphor-icons/react';
import React, { forwardRef, type ReactElement } from 'react';

const SVG = (
  <>
    <circle fill="#FFFFFF" cx="128" cy="128" r="126" />
    <path
      fill="#D52B1E"
      d="M40.5,34.5C15.6,57.9,0,91.1,0,128s15.6,70.1,40.5,93.5V34.5z"
    />
    <path
      fill="#D52B1E"
      d="M221.7,215.2C243,192.3,256,161.7,256,128s-13-64.3-34.3-87.2V215.2z"
    />
    <path
      fill="#D52B1E"
      d="M67.7,123.7l-7,2.4l32.7,28.8c2.5,7.4-0.8,9.6-3,13.4l35.5-4.5l-0.9,35.8l7.4-0.2l-1.6-35.4l35.6,4.2
      c-2.2-4.6-4.1-7.1-2.1-14.5l32.7-27.2l-5.7-2.1c-4.7-3.7,2-17.4,3-26.1c0,0-19.1,6.6-20.3,3.1l-4.9-9.2l-17.3,19
      c-1.9,0.5-2.7-0.3-3.1-1.9l8-39.8l-12.7,7.2c-1.1,0.4-2.1,0-2.8-1.2l-12.2-24.5l-12.6,25.5c-0.9,0.9-1.9,1-2.7,0.4l-12.1-6.8
      l7.2,39.6c-0.6,1.5-1.9,2-3.6,1.2L88.4,91.6c-2.2,3.5-3.7,9.2-6.5,10.5c-2.8,1.2-12.5-2.4-19-3.8C65.1,106.2,72,119.4,67.7,123.7
      L67.7,123.7z"
    />
  </>
);

const weights = new Map<IconWeight, ReactElement>([['regular', SVG]]);

const FlagCanadaIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} />
));

FlagCanadaIcon.displayName = 'FlagCanadaIcon';

export default FlagCanadaIcon;
