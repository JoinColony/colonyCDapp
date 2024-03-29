import { type Icon, IconBase, type IconWeight } from '@phosphor-icons/react';
import React, { forwardRef, type ReactElement } from 'react';

const SVG = (
  <>
    <circle fill="#003399" cx="128" cy="128" r="126" />
    <polygon
      fill="#FFCC00"
      points="128,40.7 125.3,49.7 116,49.4 123.7,54.8 120.6,63.6 128,57.9 135.4,63.6 132.3,54.8 140,49.4 
      130.7,49.7 "
    />
    <polygon
      fill="#FFCC00"
      points="130.7,201.4 128,192.4 125.3,201.4 116,201.1 123.7,206.5 120.6,215.3 128,209.6 135.4,215.3 
      132.3,206.5 140,201.1 "
    />
    <polygon
      fill="#FFCC00"
      points="52.1,133.8 59.6,139.4 56.5,130.6 64.2,125.3 54.8,125.5 52.1,116.6 49.5,125.5 40.1,125.3 47.8,130.6 
      44.7,139.4 "
    />
    <polygon
      fill="#FFCC00"
      points="91,51.4 88.3,60.4 79,60.2 86.7,65.5 83.6,74.3 91,68.6 98.4,74.3 95.3,65.5 103,60.2 93.7,60.4 "
    />
    <polygon
      fill="#FFCC00"
      points="58.5,93.6 55.5,102.4 62.9,96.8 70.3,102.4 67.2,93.6 74.9,88.3 65.6,88.5 62.9,79.6 60.2,88.5 
      50.9,88.3 "
    />
    <polygon
      fill="#FFCC00"
      points="65.6,164.5 62.9,155.6 60.2,164.5 50.9,164.3 58.6,169.6 55.5,178.5 62.9,172.8 70.3,178.5 67.2,169.6 
      74.9,164.3 "
    />
    <polygon
      fill="#FFCC00"
      points="93,190 90.3,181 87.7,190 78.3,189.8 86,195.1 82.9,203.9 90.3,198.3 97.8,203.9 94.7,195.1 
      102.4,189.8 "
    />
    <polygon
      fill="#FFCC00"
      points="215.9,125.3 206.5,125.5 203.9,116.6 201.2,125.5 191.8,125.3 199.5,130.6 196.4,139.4 203.9,133.8 
      211.3,139.4 208.2,130.6 "
    />
    <polygon
      fill="#FFCC00"
      points="160.7,65.5 157.6,74.3 165,68.6 172.4,74.3 169.3,65.5 177,60.2 167.7,60.4 165,51.4 162.3,60.4 
      153,60.2 "
    />
    <polygon
      fill="#FFCC00"
      points="188.8,93.6 185.7,102.4 193.1,96.8 200.5,102.4 197.5,93.6 205.1,88.3 195.8,88.5 193.1,79.6 
      190.4,88.5 181.1,88.3 "
    />
    <polygon
      fill="#FFCC00"
      points="195.8,164.5 193.1,155.6 190.4,164.5 181.1,164.3 188.8,169.6 185.7,178.5 193.1,172.8 200.5,178.5 
      197.4,169.6 205.1,164.3 "
    />
    <polygon
      fill="#FFCC00"
      points="168.3,190 165.7,181 163,190 153.6,189.8 161.3,195.1 158.2,203.9 165.7,198.3 173.1,203.9 170,195.1 
      177.7,189.8 "
    />
  </>
);

const weights = new Map<IconWeight, ReactElement>([['regular', SVG]]);

const FlagEuIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} />
));

FlagEuIcon.displayName = 'FlagEuIcon';

export default FlagEuIcon;
