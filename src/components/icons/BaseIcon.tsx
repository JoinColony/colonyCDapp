import { type Icon, IconBase, type IconWeight } from '@phosphor-icons/react';
import React, { forwardRef, type ReactElement } from 'react';

const SVG = (
  <>
    <circle fill="#213147" cx="22" cy="22" r="22" />
    <path
      fill="#0052FF"
      d="M21.962 44C34.133 44 44 34.15 44 22S34.133 0 21.962 0A22.027 22.027 0 0 0 0 20.152h29.13v3.699H0C.94 35.134 10.414 44 21.962 44Z"
    />
  </>
);

const weights = new Map<IconWeight, ReactElement>([['regular', SVG]]);

const BaseIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} viewBox="0 0 44 44" weights={weights} />
));

BaseIcon.displayName = 'BaseIcon';

export default BaseIcon;
