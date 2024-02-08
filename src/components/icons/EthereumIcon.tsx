import { type Icon, IconBase, type IconWeight } from '@phosphor-icons/react';
import React, { forwardRef, type ReactElement } from 'react';

const SVG = (
  <>
    <circle fill="#627EEA" cx="128" cy="128" r="126" />
    <path fill="#FFFFFF" fillOpacity="0.602" d="M132,32v71l60,26.8L132,32z" />
    <path fill="#FFFFFF" d="M132,32l-60,97.8l60-26.8L132,32z" />
    <path
      fill="#FFFFFF"
      fillOpacity="0.602"
      d="M132,175.7V224l60-83L132,175.7z"
    />
    <path fill="#FFFFFF" d="M132,224v-48.2l-60-34.8L132,224z" />
    <path
      fill="#FFFFFF"
      fillOpacity="0.2"
      d="M132,164.6l60-34.8L132,103V164.6z"
    />
    <path
      fill="#FFFFFF"
      fillOpacity="0.602"
      d="M72,129.8l60,34.8V103L72,129.8z"
    />
  </>
);

const weights = new Map<IconWeight, ReactElement>([['regular', SVG]]);

const EthereumIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} />
));

EthereumIcon.displayName = 'EthereumIcon';

export default EthereumIcon;
