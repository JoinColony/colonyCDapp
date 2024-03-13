import { SmileySad } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';

import { COLONY_DOCS } from '~constants/index.ts';
import { MainLayout } from '~frame/Extensions/layouts/index.ts';
import { openFeaturesBugs } from '~hooks/useBeamer.ts';
import {
  // CREATE_COLONY_ROUTE_BASE,
  LANDING_PAGE_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  USER_HOME_ROUTE,
} from '~routes/index.ts';
import { formatText } from '~utils/intl.ts';
import ButtonLink from '~v5/shared/Button/ButtonLink.tsx';
import Button from '~v5/shared/Button/index.ts';

const displayName = 'frame.FourOFour';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Oops!',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'Looks like the page you’re looking for isn’t here. The link to this page may be broken or you may have bookmarked a page that’s been removed. ',
  },
  errorCode: {
    id: `${displayName}.errorCode`,
    defaultMessage: 'Error code: 404',
  },
  reportBugBtn: {
    id: `${displayName}.reportBug`,
    defaultMessage: 'Report a bug',
  },
  goHomeBtn: {
    id: `${displayName}.goHome`,
    defaultMessage: 'Go to app home',
  },
  linksTitle: {
    id: `${displayName}.linksTitle`,
    defaultMessage: 'Helpful links',
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
    <div className="mx-auto flex w-full flex-col items-start sm:max-w-lg sm:p-0 md:w-auto">
      <SmileySad size={32} />
      <h3 className="my-2 heading-3">{formatText(MSG.title)}</h3>
      <p className="text-sm text-gray-600">{formatText(MSG.description)}</p>
      <p className="mb-4 mt-2 text-gray-600 text-4">
        {formatText(MSG.errorCode)}
      </p>
      <hr className="h-px w-full" />
      <div className="mb-6 mt-8 flex w-full flex-col gap-2 sm:flex-row sm:gap-6">
        <Button mode="quinary" className="flex-1" onClick={openFeaturesBugs}>
          {formatText(MSG.reportBugBtn)}
        </Button>
        <ButtonLink
          mode="primarySolid"
          to={LANDING_PAGE_ROUTE}
          className="flex-1"
        >
          {formatText(MSG.goHomeBtn)}
        </ButtonLink>
      </div>
      <h5 className="mb-3 text-md font-semibold">
        {formatText(MSG.linksTitle)}
      </h5>
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
      {/* @BETA disabled for now
      <Link
        to={CREATE_COLONY_ROUTE_BASE}
        className="text-sm text-blue-400 underline"
      >
        {formatText(MSG.createColonyLink)}
      </Link>
      */}
    </div>
  </MainLayout>
);

FourOFour.displayName = displayName;

export default FourOFour;
