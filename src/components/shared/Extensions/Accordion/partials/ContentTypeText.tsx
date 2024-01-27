import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { ContentTypeProps } from '../types.ts';

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
        // eslint-disable-next-line react/no-danger
        <p className="text-1" dangerouslySetInnerHTML={{ __html: titleText }} />
      )}
      {subTitleText && (
        <p
          className="text-sm text-gray-600 mt-0.5"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: subTitleText }}
        />
      )}
    </div>
  );
};

ContentTypeText.displayName = displayName;

export default ContentTypeText;
