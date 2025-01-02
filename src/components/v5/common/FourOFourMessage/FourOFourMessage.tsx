import { SmileySad } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { openFeaturesBugs } from '~hooks/useBeamer.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/index.ts';

import { type FourOFourMessageProps } from './types.ts';

const displayName = 'v5.common.FourOFourMessage';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Oops!',
  },
  errorCode: {
    id: `${displayName}.errorCode`,
    defaultMessage: 'Error code: 404',
  },
  reportBugBtn: {
    id: `${displayName}.reportBug`,
    defaultMessage: 'Report a bug',
  },
  linksTitle: {
    id: `${displayName}.linksTitle`,
    defaultMessage: 'Helpful links',
  },
});

const FourOFourMessage: FC<FourOFourMessageProps> = ({
  description,
  links,
  primaryLinkButton,
  className,
}) => {
  return (
    <div
      className={clsx(
        className,
        'mx-auto flex w-full flex-col items-start sm:max-w-lg sm:p-0 md:w-auto',
      )}
    >
      <SmileySad size={32} />
      <h3 className="my-2 heading-3">{formatText(MSG.title)}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      <p className="mb-4 mt-2 text-gray-600 text-4">
        {formatText(MSG.errorCode)}
      </p>
      <hr className="h-px w-full" />
      <div className="mb-6 mt-8 flex w-full flex-col gap-2 sm:flex-row sm:gap-6">
        <Button mode="quinary" className="flex-1" onClick={openFeaturesBugs}>
          {formatText(MSG.reportBugBtn)}
        </Button>
        {primaryLinkButton}
      </div>
      {links && (
        <>
          <h5 className="mb-3 text-md font-semibold">
            {formatText(MSG.linksTitle)}
          </h5>
          {links}
        </>
      )}
    </div>
  );
};

FourOFourMessage.displayName = displayName;

export default FourOFourMessage;
