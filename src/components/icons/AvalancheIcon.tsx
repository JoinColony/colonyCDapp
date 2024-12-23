import { type Icon, IconBase, type IconWeight } from '@phosphor-icons/react';
import React, { forwardRef, type ReactElement } from 'react';

const SVG = (
  <>
    <circle fill="#213147" cx="22" cy="22" r="22" />
    <path
      fill="#E84142"
      d="M22 44c12.15 0 22-9.85 22-22S34.15 0 22 0 0 9.85 0 22s9.85 22 22 22Z"
    />
    <path
      fill="#fff"
      d="M15.095 31.339h-4.32c-.91 0-1.36 0-1.631-.169a1.07 1.07 0 0 1-.499-.851c-.017-.32.208-.707.658-1.487l10.673-18.546c.457-.787.69-1.181.98-1.325a1.088 1.088 0 0 1 .996 0c.289.144.514.538.964 1.325l2.203 3.777.007.016c.362.535.649 1.116.851 1.727a3.099 3.099 0 0 1 0 1.495 7.122 7.122 0 0 1-.85 1.743l-5.609 9.773-.017.032a6.987 6.987 0 0 1-1.093 1.607 3.374 3.374 0 0 1-1.326.763c-.457.12-.963.12-1.985.12m10.922 0h6.187c.925 0 1.382 0 1.656-.176a1.07 1.07 0 0 0 .497-.852c.017-.313-.2-.682-.634-1.415l-.049-.08-3.101-5.223-.032-.064c-.435-.723-.66-1.093-.941-1.237a1.068 1.068 0 0 0-.988 0c-.289.144-.514.53-.964 1.301l-3.103 5.231v.017c-.458.769-.683 1.157-.666 1.47a1.088 1.088 0 0 0 .497.859c.266.169.724.169 1.64.169Z"
    />
  </>
);

const weights = new Map<IconWeight, ReactElement>([['regular', SVG]]);

const AvalancheIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} viewBox="0 0 44 44" weights={weights} />
));

AvalancheIcon.displayName = 'AvalancheIcon';

export default AvalancheIcon;
