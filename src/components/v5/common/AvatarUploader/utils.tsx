import React, { ReactElement } from 'react';

import { SpinnerLoader } from '~shared/Preloaders';

export const getPlaceholder = (
  loading: boolean,
  avatar: ReactElement<unknown, string | React.JSXElementConstructor<unknown>>,
) => {
  if (loading) {
    return <SpinnerLoader appearance={{ size: 'medium' }} />;
  }

  return avatar;
};
