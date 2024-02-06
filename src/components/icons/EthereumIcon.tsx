import { type Icon, IconBase, type IconWeight } from '@phosphor-icons/react';
import React, { forwardRef, type ReactElement } from 'react';

const SVG = (
  <>
    <path
      fill="#A4BCFD"
      d="M13.1,25c6.9,0,12.5-5.6,12.5-12.5C25.6,5.6,20,0,13.1,0C6.2,0,0.6,5.6,0.6,12.5C0.6,19.4,6.2,25,13.1,25z"
    />
    <polygon
      fill="#FFFFFF"
      points="13.5,21.9 19.4,13.8 13.5,17.2 13.5,17.2 7.6,13.8 13.5,21.9 13.5,21.9 13.5,21.9 13.5,21.9 "
    />
    <polygon
      fill="#FFFFFF"
      points="13.5,3.1 13.5,3.1 13.5,3.1 13.5,3.1 13.5,3.1 7.6,12.7 13.5,16.1 13.5,16.1 13.5,16.1 13.5,16.1
	13.5,16.1 19.4,12.7 "
    />
  </>
);

const weights = new Map<IconWeight, ReactElement>([['regular', SVG]]);

const EthereumIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} />
));

EthereumIcon.displayName = 'EthereumIcon';

export default EthereumIcon;
