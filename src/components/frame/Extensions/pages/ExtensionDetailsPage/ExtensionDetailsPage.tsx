import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';

import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import useExtensionData from '~hooks/useExtensionData.ts';
import { NotFoundRoute } from '~routes';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { formatText } from '~utils/intl.ts';

import { ExtensionDetailsPageContextProvider } from './context/ExtensionDetailsPageContextProvider.tsx';
import ExtensionDetailsPageContent from './partials/ExtensionDetailsPageContent.tsx';

const displayName = 'frame.Extensions.pages.Extensions.ExtensionDetailsPage';

const MSG = defineMessages({
  title: {
    id: `${displayName}.buttonYourDashboard`,
    defaultMessage: 'Extensions',
  },
});

const ExtensionDetailsPage: FC = () => {
  useSetPageHeadingTitle(formatText(MSG.title));

  const { extensionId } = useParams();
  const { extensionData, loading, refetchExtensionData } = useExtensionData(
    extensionId ?? '',
  );

  if (!extensionData && !loading) {
    return <NotFoundRoute />;
  }

  if (loading) {
    return <SpinnerLoader />;
  }

  if (!extensionData) {
    return (
      <p>{formatText({ id: 'extensionDetailsPage.unsupportedExtension' })}</p>
    );
  }

  return (
    <ExtensionDetailsPageContextProvider>
      <ExtensionDetailsPageContent
        extensionData={extensionData}
        refetchExtensionData={refetchExtensionData}
      />
    </ExtensionDetailsPageContextProvider>
  );
};

ExtensionDetailsPage.displayName = displayName;

export default ExtensionDetailsPage;
