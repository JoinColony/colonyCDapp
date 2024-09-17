import React from 'react';
import { defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';

import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import useExtensionData from '~hooks/useExtensionData.ts';
import { NotFoundRoute } from '~routes';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { formatText } from '~utils/intl.ts';

import ExtensionDetailsPageContent from './ExtensionDetailsPageContent.ts';

const displayName = 'frame.Extensions.pages.Extensions.ExtensionDetailsPage';

const MSG = defineMessages({
  title: {
    id: `${displayName}.buttonYourDashboard`,
    defaultMessage: 'Extensions',
  },
});

const ExtensionDetailsPage = () => {
  useSetPageHeadingTitle(formatText(MSG.title));

  const { extensionId } = useParams();
  const { extensionData, loading, refetchExtensionData } = useExtensionData(
    extensionId ?? '',
  );

  if (loading) {
    return <SpinnerLoader />;
  }

  if (!extensionData) {
    return <NotFoundRoute />;
  }

  return (
    <ExtensionDetailsPageContent
      extensionData={extensionData}
      refetchExtensionData={refetchExtensionData}
    />
  );
};

export default ExtensionDetailsPage;
