import { SmileySad } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';

import { openFeaturesBugs } from '~hooks/useBeamer.ts';
import { formatText } from '~utils/intl.ts';
import ButtonLink from '~v5/shared/Button/ButtonLink.tsx';
import Button from '~v5/shared/Button/index.ts';

import {
  FourOFourMessageLinkType,
  type FourOFourMessageProps,
} from './types.ts';

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
}) => {
  return (
    <div className="mx-auto flex w-full flex-col items-start sm:max-w-lg sm:p-0 md:w-auto">
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
        {primaryLinkButton.location ? (
          <ButtonLink
            mode="primarySolid"
            to={primaryLinkButton.location}
            className="flex-1"
            onClick={() => primaryLinkButton.onClick?.()}
          >
            {primaryLinkButton.text}
          </ButtonLink>
        ) : (
          <Button
            mode="primarySolid"
            className="flex-1"
            onClick={() => primaryLinkButton.onClick?.()}
          >
            {primaryLinkButton.text}
          </Button>
        )}
      </div>
      <h5 className="mb-3 text-md font-semibold">
        {formatText(MSG.linksTitle)}
      </h5>
      {links.map((link) =>
        link.type === FourOFourMessageLinkType.External ? (
          <a
            href={link.location}
            target="_blank"
            rel="noreferrer noopener"
            className="mb-2 text-sm text-blue-400 underline"
            key={`${link.location}_${link.text}_${link.type}`}
          >
            {link.text}
          </a>
        ) : (
          <Link
            to={link.location}
            className="mb-2 text-sm text-blue-400 underline"
            key={`${link.location}_${link.text}_${link.type}`}
          >
            {link.text}
          </Link>
        ),
      )}
    </div>
  );
};

FourOFourMessage.displayName = displayName;

export default FourOFourMessage;
