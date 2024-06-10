import React, { type FC } from 'react';
import { useParams } from 'react-router-dom';

import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import useExtensionData from '~hooks/useExtensionData.ts';
import NotFoundRoute from '~routes/NotFoundRoute.tsx';
import { formatText } from '~utils/intl.ts';

import { ExtensionPageContextProvider } from './context/ExtensionPageContextProvider.tsx';
import ExtensionPageForm from './partials/ExtensionPageForm/ExtensionPageForm.tsx';

const displayName = 'frame.Extensions.pages.ExtensionPage';

const ExtensionPage: FC = () => {
  const { extensionId } = useParams();

  const { extensionData, loading, refetchExtensionData } = useExtensionData(
    extensionId ?? '',
  );

  useSetPageHeadingTitle(formatText({ id: 'extensionsPage.title' }));

  if (loading) {
    return null;
  }

  if (!extensionData) {
    return <NotFoundRoute />;
  }

  return (
    <ExtensionPageContextProvider>
      <ExtensionPageForm
        extensionData={extensionData}
        refetchExtensionData={refetchExtensionData}
      />
    </ExtensionPageContextProvider>
  );
};

ExtensionPage.displayName = displayName;

export default ExtensionPage;
