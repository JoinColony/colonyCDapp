import { Question } from '@phosphor-icons/react';
import React, { type PropsWithChildren, type FC } from 'react';
import { FormattedMessage } from 'react-intl';

import ExternalLink from '~shared/ExternalLink/index.ts';

import { type LearnMoreProps } from './types.ts';

const displayName = 'Extensions.LearnMore';

const LearnMore: FC<PropsWithChildren<LearnMoreProps>> = ({
  message,
  href,
}) => {
  const { id, defaultMessage } = message;

  return (
    <div className="flex items-center justify-center text-sm font-normal">
      <Question size={14} />
      <span className="ml-2 block">
        <FormattedMessage
          id={id}
          defaultMessage={defaultMessage}
          values={{
            // eslint-disable-next-line react/no-unstable-nested-components
            a: (chunks) => (
              <ExternalLink className="font-semibold underline" href={href}>
                {chunks}
              </ExternalLink>
            ),
          }}
        />
      </span>
    </div>
  );
};

LearnMore.displayName = displayName;

export default LearnMore;
