import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { isInstalledExtensionData } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';

import {
  type ExtensionSetupComponentScheme,
  extensionSetupComponentScheme,
} from './consts.ts';
import { type ExtensionSetupPageBaseProps } from './types.ts';

const displayName = 'frame.Extensions.pages.ExtensionSetupPage';

const ExtensionSetupPage: React.FC<ExtensionSetupPageBaseProps> = ({
  extensionData,
}) => {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  useEffect(() => {
    if (
      !isInstalledExtensionData(extensionData) ||
      extensionData.isInitialized
    ) {
      navigate(pathname.split('/').slice(0, -1).join('/'));
    }
  }, [extensionData, pathname, navigate]);

  if (!extensionData) {
    return <p>{formatText({ id: 'extensionPage.unsupportedExtension' })}</p>;
  }

  const SetupComponent =
    extensionSetupComponentScheme[
      extensionData.extensionId as keyof ExtensionSetupComponentScheme
    ];

  return <SetupComponent extensionData={extensionData} />;
};

ExtensionSetupPage.displayName = displayName;

export default ExtensionSetupPage;
