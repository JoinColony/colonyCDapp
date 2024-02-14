import React, { type FC } from 'react';
import { type MessageDescriptor } from 'react-intl';

import {
  type AnyMessageValues,
  type SimpleMessageValues,
} from '~types/index.ts';
import { formatText } from '~utils/intl.ts';

interface HeaderRowProps {
  heading: MessageDescriptor | string;
  headingValues?: SimpleMessageValues;
  description: MessageDescriptor | string;
  descriptionValues?: AnyMessageValues;
}

const displayName = 'common.Onboarding.HeaderRow';

const HeaderRow: FC<HeaderRowProps> = ({
  heading,
  headingValues,
  description,
  descriptionValues,
}) => {
  const headingText =
    typeof heading === 'string'
      ? heading
      : heading && formatText(heading, headingValues);
  const subHeadingText =
    typeof description === 'string'
      ? description
      : description && formatText(description, descriptionValues);

  return (
    <div className="pb-4 border-b border-gray300 mb-8">
      <h3 className="heading-3 pb-2">{headingText}</h3>
      <p className="text-sm text-gray-600">{subHeadingText}</p>
    </div>
  );
};

HeaderRow.displayName = displayName;

export default HeaderRow;
