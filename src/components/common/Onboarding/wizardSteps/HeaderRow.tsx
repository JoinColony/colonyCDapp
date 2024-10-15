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
    <div className="border-gray300 mb-8 border-b pb-4">
      <h3 className="pb-2 heading-3" data-testid="onboarding-heading">
        {headingText}
      </h3>
      <p className="text-sm text-gray-600" data-testid="onboarding-subheading">
        {subHeadingText}
      </p>
    </div>
  );
};

HeaderRow.displayName = displayName;

export default HeaderRow;
