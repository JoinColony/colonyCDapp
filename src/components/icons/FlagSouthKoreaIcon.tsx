import { type Icon, IconBase, type IconWeight } from '@phosphor-icons/react';
import React, { forwardRef, type ReactElement } from 'react';

const SVG = (
  <>
    <circle fill="#FBFBFB" cx="128" cy="128" r="128" />
    <rect
      x="2.4"
      y="58.3"
      transform="matrix(0.5548 -0.832 0.832 0.5548 -38.8186 53.4022)"
      fill="#000001"
      width="56.3"
      height="9.4"
    />
    <rect
      x="14.1"
      y="66.1"
      transform="matrix(0.5548 -0.832 0.832 0.5548 -40.1019 66.6089)"
      fill="#000001"
      width="56.3"
      height="9.4"
    />
    <rect
      x="25.8"
      y="73.9"
      transform="matrix(0.5548 -0.832 0.832 0.5548 -41.3852 79.8155)"
      fill="#000001"
      width="56.3"
      height="9.4"
    />
    <rect
      x="222.9"
      y="174.7"
      transform="matrix(0.5548 -0.832 0.832 0.5548 -44.7994 275.0099)"
      fill="#000001"
      width="23.4"
      height="9.4"
    />
    <rect
      x="204.7"
      y="202"
      transform="matrix(0.5548 -0.832 0.832 0.5548 -75.6143 272.0162)"
      fill="#000001"
      width="23.4"
      height="9.4"
    />
    <rect
      x="211.2"
      y="166.9"
      transform="matrix(0.5548 -0.832 0.832 0.5548 -43.5159 261.8038)"
      fill="#000001"
      width="23.4"
      height="9.4"
    />
    <rect
      x="193"
      y="194.2"
      transform="matrix(0.5548 -0.832 0.832 0.5548 -74.331 258.8093)"
      fill="#000001"
      width="23.4"
      height="9.4"
    />
    <rect
      x="181.3"
      y="186.4"
      transform="matrix(0.5548 -0.832 0.832 0.5548 -73.0476 245.6031)"
      fill="#000001"
      width="23.4"
      height="9.4"
    />
    <rect
      x="199.5"
      y="159.1"
      transform="matrix(0.5548 -0.832 0.832 0.5548 -42.2325 248.5973)"
      fill="#000001"
      width="23.4"
      height="9.4"
    />
    <path
      fill="#0047A0"
      d="M167,120.2c-12.9-8.6-30.4-5.1-39,7.8L81.2,96.8c-17.2,25.8-10.3,60.8,15.6,78c25.8,17.2,60.8,10.3,78-15.6
	C183.4,146.3,179.9,128.8,167,120.2z"
    />
    <path
      fill="#CD2E3A"
      d="M159.2,81.2c-25.8-17.2-60.8-10.3-78,15.6c-8.6,12.9-5.1,30.4,7.8,39c12.9,8.6,30.4,5.1,39-7.8
	c8.6-12.9,26.1-16.4,39-7.8c12.9,8.6,16.4,26.1,7.8,39C192,133.4,185,98.4,159.2,81.2z"
    />
    <rect
      x="25.8"
      y="164.9"
      transform="matrix(0.832 -0.5548 0.5548 0.832 -101.9659 49.3685)"
      fill="#000001"
      width="9.4"
      height="56.2"
    />
    <rect
      x="49.2"
      y="149.3"
      transform="matrix(0.832 -0.5548 0.5548 0.832 -89.3755 59.7288)"
      fill="#000001"
      width="9.4"
      height="56.2"
    />
    <rect
      x="209.1"
      y="42.7"
      transform="matrix(0.832 -0.5548 0.5548 0.832 -3.3411 130.5241)"
      fill="#000001"
      width="9.4"
      height="56.2"
    />
    <rect
      x="46.6"
      y="187.1"
      transform="matrix(0.832 -0.5548 0.5548 0.832 -101.7061 61.884)"
      fill="#000001"
      width="9.4"
      height="23.4"
    />
    <rect
      x="28.4"
      y="159.8"
      transform="matrix(0.832 -0.5548 0.5548 0.832 -89.6272 47.2043)"
      fill="#000001"
      width="9.4"
      height="23.4"
    />
    <rect
      x="206.5"
      y="80.5"
      transform="matrix(0.832 -0.5548 0.5548 0.832 -15.6796 132.6896)"
      fill="#000001"
      width="9.4"
      height="23.4"
    />
    <rect
      x="188.3"
      y="53.2"
      transform="matrix(0.832 -0.5548 0.5548 0.832 -3.5928 117.9996)"
      fill="#000001"
      width="9.4"
      height="23.4"
    />
    <rect
      x="211.7"
      y="37.6"
      transform="matrix(0.832 -0.5548 0.5548 0.832 8.9975 128.3598)"
      fill="#000001"
      width="9.4"
      height="23.4"
    />
    <rect
      x="229.9"
      y="64.9"
      transform="matrix(0.832 -0.5548 0.5548 0.832 -3.09 143.0466)"
      fill="#000001"
      width="9.4"
      height="23.4"
    />
  </>
);

const weights = new Map<IconWeight, ReactElement>([['regular', SVG]]);

const FlagSouthKoreaIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} />
));

FlagSouthKoreaIcon.displayName = 'FlagSouthKoreaIcon';

export default FlagSouthKoreaIcon;
