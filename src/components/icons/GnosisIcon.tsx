import { type Icon, IconBase, type IconWeight } from '@phosphor-icons/react';
import React, { forwardRef, type ReactElement } from 'react';

const SVG = (
  <>
    <path
      fill="#039855"
      d="M128,1.8c36.2,0,68.2,15.2,90.9,38.8c3.4,3.4,5.9,6.7,8.4,10.1l-99.3,101L27.9,51.4C51.4,20.3,88.5,1.8,128,1.8
	L128,1.8z M205.4,50.6c-20.2-21-47.9-32-77.4-32s-57.2,10.9-77.4,32L128,128L205.4,50.6z"
    />
    <path
      fill="#039855"
      d="M235.7,62.3l-20.2,20.2c6.7,8.4,10.9,18.5,10.9,29.5c0,25.2-21,46.3-46.3,46.3c-10.9,0-21.9-4.2-29.5-10.9
	L128,170.9L106.1,149c-8.4,6.7-18.5,10.9-29.5,10.9c-25.2,0-46.3-21-46.3-46.3c0-10.9,4.2-21.9,10.9-29.5l-21-21.9
	C7.7,82.5,1.8,105.3,1.8,128c0,69.8,56.4,126.2,126.2,126.2S254.2,197.8,254.2,128C254.2,104.4,247.5,81.7,235.7,62.3L235.7,62.3z"
    />
    <path
      fill="#039855"
      d="M206.3,92.7c4.2,5.9,6.7,12.6,6.7,20.2c0,17.7-14.3,32.8-32.8,32.8l0,0c-7.6,0-14.3-2.6-20.2-6.7L206.3,92.7
	L206.3,92.7z M96,138.9c-14.3,10.9-35.3,8.4-46.3-5.9c-4.2-5.9-6.7-12.6-6.7-20.2c0-7.6,2.6-14.3,6.7-20.2L96,138.9L96,138.9z"
    />
  </>
);

const weights = new Map<IconWeight, ReactElement>([['regular', SVG]]);

const GnosisIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} />
));

GnosisIcon.displayName = 'GnosisIcon';

export default GnosisIcon;
