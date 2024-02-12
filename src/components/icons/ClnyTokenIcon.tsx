import { type Icon, IconBase, type IconWeight } from '@phosphor-icons/react';
import React, { forwardRef, type ReactElement } from 'react';

const SVG = (
  <>
    <circle fill="#0F294B" cx="128" cy="128" r="126" />
    <path
      fill="#FFFFFF"
      d="M127.9,87c11.5,0,20.8-9.4,20.8-20.9s-9.3-20.9-20.8-20.9c-11.5,0-20.8,9.4-20.8,20.9
      S116.5,87,127.9,87z"
    />
    <path
      fill="#FFFFFF"
      d="M127.9,210.8c11.5,0,20.8-9.4,20.8-20.9c0-11.6-9.3-20.9-20.8-20.9c-11.5,0-20.8,9.4-20.8,20.9
      C107.2,201.4,116.5,210.8,127.9,210.8z"
    />
    <path
      fill="#FFFFFF"
      d="M189.2,148.9c11.5,0,20.8-9.4,20.8-20.9c0-11.6-9.3-20.9-20.8-20.9c-11.5,0-20.8,9.4-20.8,20.9
      C168.4,139.6,177.7,148.9,189.2,148.9z"
    />
    <path
      fill="#FFFFFF"
      d="M66.5,148.9c11.5,0,20.8-9.4,20.8-20.9s-9.3-20.9-20.8-20.9s-20.8,9.4-20.8,20.9
      S55,148.9,66.5,148.9z"
    />
    <path fill="#FFFFFF" d="M128,94.4L94.6,128l33.4,33.6l33.4-33.6L128,94.4z" />
    <path fill="#FFFFFF" d="M165.4,90.3v-36l35.7,36H165.4z" />
    <path fill="#FFFFFF" d="M90.3,90.3H54.6l35.7-36V90.3z" />
    <path fill="#FFFFFF" d="M90.3,165.7v36l-35.7-36H90.3z" />
    <path fill="#FFFFFF" d="M165.4,165.7h35.7l-35.7,36V165.7z" />
  </>
);

const weights = new Map<IconWeight, ReactElement>([['regular', SVG]]);

const ClnyTokenIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} />
));

ClnyTokenIcon.displayName = 'ClnyTokenIcon';

export default ClnyTokenIcon;
