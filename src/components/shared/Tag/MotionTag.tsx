import React from 'react';

import { MotionStyles } from '~types';

import Tag from './Tag';

const displayName = 'Tag';

interface MotionTagProps {
  motionStyles: MotionStyles;
}

const MotionTag = ({ motionStyles }: MotionTagProps) => (
  <Tag
    text={motionStyles.name}
    appearance={{
      theme: motionStyles.theme,
      colorSchema: motionStyles.colorSchema,
    }}
  />
);

MotionTag.displayName = displayName;

export default MotionTag;
