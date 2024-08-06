import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import { type ContentTypeProps } from '../types.ts';

const displayName = 'Extensions.Accordion.partials.AccordionDetails';

const ContentTypeText: FC<ContentTypeProps> = ({ title, subTitle }) => {
  const { formatMessage } = useIntl();

  const titleText =
    typeof title === 'string' ? title : title && formatMessage(title);

  const subTitleText =
    typeof subTitle === 'string'
      ? subTitle
      : subTitle && formatMessage(subTitle);

  return (
    <div>
      {titleText && (
        <p
          className="max-w-[30rem] text-1"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: titleText }}
        />
      )}
      {subTitleText && (
        <p
          className="mt-0.5 max-w-[30rem] text-sm text-gray-600"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: subTitleText }}
        />
      )}
    </div>
  );
};

ContentTypeText.displayName = displayName;

export default ContentTypeText;
