import { type Icon, IconBase, type IconWeight } from '@phosphor-icons/react';
import React, { forwardRef, type ReactElement } from 'react';

const SVG = (
  <>
    <path
      fill="currentColor"
      d="M128,64.7c17.7,0,32.1-14.5,32.1-32.3S145.7,0,128,0c-17.7,0-32.1,14.5-32.1,32.3
		S110.3,64.7,128,64.7z"
    />
    <path
      fill="currentColor"
      d="M128,256c17.7,0,32.1-14.5,32.1-32.3c0-17.9-14.4-32.3-32.1-32.3c-17.7,0-32.1,14.5-32.1,32.3
		C95.9,241.5,110.3,256,128,256z"
    />
    <path
      fill="currentColor"
      d="M222.7,160.3c17.7,0,32.1-14.5,32.1-32.3c0-17.9-14.4-32.3-32.1-32.3
		c-17.7,0-32.1,14.5-32.1,32.3C190.6,145.9,204.9,160.3,222.7,160.3z"
    />
    <path
      fill="currentColor"
      d="M33,160.3c17.7,0,32.1-14.5,32.1-32.3S50.8,95.7,33,95.7S0.9,110.1,0.9,128S15.3,160.3,33,160.3
		z"
    />
    <path
      fill="currentColor"
      d="M128.1,76L76.5,128l51.6,51.9l51.6-51.9L128.1,76z"
    />
    <path fill="currentColor" d="M185.9,69.7V14.1l55.2,55.6H185.9z" />
    <path fill="currentColor" d="M69.8,69.7H14.6l55.2-55.6V69.7z" />
    <path fill="currentColor" d="M69.8,186.3v55.6l-55.2-55.6H69.8z" />
    <path fill="currentColor" d="M185.9,186.3h55.2l-55.2,55.6V186.3z" />
  </>
);

const ColonyIcon: Icon = forwardRef((props, ref) => {
  const weights = new Map<IconWeight, ReactElement>([['regular', SVG]]);

  return <IconBase ref={ref} weights={weights} {...props} />;
});

ColonyIcon.displayName = 'ColonyIcon';

export default ColonyIcon;
