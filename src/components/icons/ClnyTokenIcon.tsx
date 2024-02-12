import { type Icon, IconBase, type IconWeight } from '@phosphor-icons/react';
import React, { forwardRef, type ReactElement } from 'react';

const SVG = (
  <g transform="translate(-90 -133.5)" fill="#00284b" strokeWidth="1.9219">
    <path d="m105 141.11c2.1011 0 3.8044-1.7033 3.8044-3.8044s-1.7033-3.8044-3.8044-3.8044c-2.1011 0-3.8044 1.7033-3.8044 3.8044s1.7033 3.8044 3.8044 3.8044z" />
    <path d="m105 163.5c2.1011 0 3.8044-1.7034 3.8044-3.8044 0-2.1012-1.7033-3.8044-3.8044-3.8044s-3.8044 1.7032-3.8044 3.8044c0 2.101 1.7033 3.8044 3.8044 3.8044z" />
    <path d="m116.2 152.3c2.101 0 3.8044-1.7033 3.8044-3.8044s-1.7034-3.8044-3.8044-3.8044c-2.101 0-3.8044 1.7033-3.8044 3.8044s1.7034 3.8044 3.8044 3.8044z" />
    <path d="m93.804 152.3c2.1011 0 3.8044-1.7033 3.8044-3.8044s-1.7033-3.8044-3.8044-3.8044-3.8044 1.7033-3.8044 3.8044 1.7033 3.8044 3.8044 3.8044z" />
    <path d="m104.99 142.45-6.0719 6.0719 6.0719 6.0719 6.0719-6.0719z" />
    <path d="m111.85 141.65v-6.4856l6.522 6.4856z" />
    <path d="m98.153 141.65h-6.4855l6.4855-6.4856z" />
    <path d="m98.153 155.35v6.5218l-6.4855-6.5218z" />
    <path d="m111.85 155.35h6.522l-6.522 6.5218z" />
  </g>
);

const weights = new Map<IconWeight, ReactElement>([['regular', SVG]]);

const ClnyTokenIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} />
));

ClnyTokenIcon.displayName = 'ClnyTokenIcon';

export default ClnyTokenIcon;
