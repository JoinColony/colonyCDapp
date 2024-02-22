import clsx from 'clsx';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';

import DraftCard from '../DraftCard/index.ts';

import { type DraftSectionProps } from './types.ts';

const DraftSection: FC<DraftSectionProps> = ({ className }) => {
  return (
    <div className={clsx(className, 'w-full')}>
      <h4 className="heading-4 mb-6 text-gray-900">
        {formatText({ id: 'agreementsPage.drafts' })}
      </h4>
      <DraftCard />
    </div>
  );
};

export default DraftSection;
