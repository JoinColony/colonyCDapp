import { type Icon, IconBase, type IconWeight } from '@phosphor-icons/react';
import React, { forwardRef, type ReactElement } from 'react';

const SVG = (
  <>
    <circle fill="#FFFFFF" cx="128" cy="128" r="126" />
    <circle fill="#012169" cx="128" cy="128" r="125" />
    <path
      fill="#FFFFFF"
      d="M200.3,88l32.5-32.9c-9.2-13.3-20.8-24.7-34.2-33.7l-30.7,31.2V6.4C155.3,2.2,141.9,0,128,0s-27.3,2.2-39.8,6.4
	v49.4L54.9,23.1c-13.2,9.3-24.6,21-33.5,34.6L52.1,88H6.9c-4.1,12.6-6.4,26-6.4,40s2.2,27.4,6.4,40H54l-31.5,31.8
	c9,13.3,20.5,24.9,33.8,34l31.9-32.4v48.2c12.5,4.1,25.9,6.4,39.8,6.4s27.3-2.2,39.8-6.4v-47.3l31.9,31.5
	c13.3-9.1,24.8-20.7,33.8-34L201.4,168h47.8c4.1-12.6,6.4-26,6.4-40s-2.2-27.4-6.4-40H200.3z"
    />
    <path
      fill="#C8102E"
      d="M188.9,168h-21.1v1.7l49.9,49.2c3.8-3.8,7.3-7.8,10.6-12L188.9,168z"
    />
    <path
      fill="#C8102E"
      d="M37,217.6c3.7,3.8,7.7,7.4,11.8,10.7l39.3-39.8V168h-2L37,217.6z"
    />
    <path
      fill="#C8102E"
      d="M26.6,50.5L64.2,88h23.9v-1.3L38,37.4C33.9,41.5,30.1,45.8,26.6,50.5z"
    />
    <path
      fill="#C8102E"
      d="M206.2,26.9l-38.3,39V88h1.8l48.9-50.1C214.7,34,210.5,30.3,206.2,26.9z"
    />
    <path
      fill="#C8102E"
      d="M151.9,104V2.3C144.2,0.8,136.2,0,128,0s-16.2,0.8-23.9,2.3V104H2.7c-1.5,7.8-2.2,15.8-2.2,24s0.8,16.2,2.2,24
	h101.3v101.7c7.7,1.5,15.7,2.3,23.9,2.3s16.2-0.8,23.9-2.3V152h101.3c1.5-7.8,2.2-15.8,2.2-24s-0.8-16.2-2.2-24H151.9z"
    />
  </>
);

const weights = new Map<IconWeight, ReactElement>([['regular', SVG]]);

const FlagUkIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} />
));

FlagUkIcon.displayName = 'FlagUkIcon';

export default FlagUkIcon;
