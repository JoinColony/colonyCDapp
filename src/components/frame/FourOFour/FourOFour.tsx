import React from 'react';
import { defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';

import { COLONY_DOCS } from '~constants/index.ts';
import { MainLayout } from '~frame/Extensions/layouts/index.ts';
import {
  // CREATE_COLONY_ROUTE_BASE,
  LANDING_PAGE_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  USER_HOME_ROUTE,
} from '~routes/index.ts';
import { formatText } from '~utils/intl.ts';
import FourOFourMessage from '~v5/common/FourOFourMessage/index.ts';
import ButtonLink from '~v5/shared/Button/ButtonLink.tsx';

const displayName = 'frame.FourOFour';

const MSG = defineMessages({
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'Looks like the page you’re looking for isn’t here. The link to this page may be broken or you may have bookmarked a page that’s been removed. ',
  },
  goHomeBtn: {
    id: `${displayName}.goHome`,
    defaultMessage: 'Go to app home',
  },
  docsLink: {
    id: `${displayName}.docsLink`,
    defaultMessage: 'Colony Docs',
  },
  userAccountLink: {
    id: `${displayName}.userAccountLink`,
    defaultMessage: 'User account',
  },
  createColonyLink: {
    id: `${displayName}.createColony`,
    defaultMessage: 'Create a colony',
  },
});

const FourOFour = () => (
  <MainLayout>
    <FourOFourMessage
      description={formatText(MSG.description)}
      links={
        <>
          <a
            href={COLONY_DOCS}
            target="_blank"
            rel="noreferrer noopener"
            className="mb-2 text-sm text-blue-400 underline"
          >
            {formatText(MSG.docsLink)}
          </a>
          <Link
            to={`${USER_HOME_ROUTE}/${USER_EDIT_PROFILE_ROUTE}`}
            className="mb-2 text-sm text-blue-400 underline"
          >
            {formatText(MSG.userAccountLink)}
          </Link>
          {/*
          @BETA disabled for now
          <Link
            to={CREATE_COLONY_ROUTE_BASE}
            className="mb-2 text-sm text-blue-400 underline"
          >
            {formatText(MSG.createColonyLink)}
          </Link>
          */}
        </>
      }
      primaryLinkButton={
        <ButtonLink
          mode="primarySolid"
          to={LANDING_PAGE_ROUTE}
          className="flex-1"
        >
          {formatText(MSG.goHomeBtn)}
        </ButtonLink>
      }
    />
  </MainLayout>
);

FourOFour.displayName = displayName;

export default FourOFour;
