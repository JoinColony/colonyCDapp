import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import { type ContentTypeProps } from '../types.ts';

const displayName = 'Extensions.Accordion.partials.AccordionDetails';

const ContentTypeText: FC<ContentTypeProps> = ({ title, subtitle }) => {
  const { formatMessage } = useIntl();

  const titleText =
    typeof title === 'string' ? title : title && formatMessage(title);

  const subtitleText =
    typeof subtitle === 'string'
      ? subtitle
      : subtitle && formatMessage(subtitle);

  return (
    <div>
      {titleText && (
        // eslint-disable-next-line react/no-danger
        <p className="text-1" dangerouslySetInnerHTML={{ __html: titleText }} />
      )}
      {subtitleText && (
        <p
          className="mt-0.5 text-sm text-gray-600"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: subtitleText }}
        />
      )}
    </div>
  );
};

ContentTypeText.displayName = displayName;

export default ContentTypeText;
