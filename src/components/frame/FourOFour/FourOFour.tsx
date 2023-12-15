import { SmileySad } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';

import { COLONY_DOCS } from '~constants';
import { MainLayout } from '~frame/Extensions/layouts';
import { openFeaturesBugs } from '~hooks/useBeamer';
import {
  // CREATE_COLONY_ROUTE_BASE,
  LANDING_PAGE_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  USER_HOME_ROUTE,
} from '~routes';
import { formatText } from '~utils/intl';
import Button from '~v5/shared/Button';
import ButtonLink from '~v5/shared/Button/ButtonLink';

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
    <div className="flex flex-col items-start sm:p-0 sm:max-w-lg mx-auto w-full md:w-auto">
      <SmileySad size={32} />
      <h3 className="heading-3 my-2">{formatText(MSG.title)}</h3>
      <p className="text-sm text-gray-600">{formatText(MSG.description)}</p>
      <p className="text-4 text-gray-600 mt-2 mb-4">
        {formatText(MSG.errorCode)}
      </p>
      <hr className="h-px w-full" />
      <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-6 mt-8 mb-6">
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
      <h5 className="text-md font-semibold mb-3">
        {formatText(MSG.linksTitle)}
      </h5>
      <a
        href={COLONY_DOCS}
        target="_blank"
        rel="noreferrer noopener"
        className="text-sm text-blue-400 mb-2 underline"
      >
        {formatText(MSG.docsLink)}
      </a>
      <Link
        to={`${USER_HOME_ROUTE}/${USER_EDIT_PROFILE_ROUTE}`}
        className="text-sm mb-2 text-blue-400 underline"
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
