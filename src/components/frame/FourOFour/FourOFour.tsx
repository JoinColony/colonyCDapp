import React from 'react';
import { defineMessages } from 'react-intl';

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
import { FourOFourMessageLinkType } from '~v5/common/FourOFourMessage/types.ts';

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
      links={[
        {
          location: COLONY_DOCS,
          text: formatText(MSG.docsLink),
          type: FourOFourMessageLinkType.External,
        },
        {
          location: `${USER_HOME_ROUTE}/${USER_EDIT_PROFILE_ROUTE}`,
          text: formatText(MSG.userAccountLink),
          type: FourOFourMessageLinkType.Internal,
        },
        // @BETA disabled for now
        // {
        //   location: CREATE_COLONY_ROUTE_BASE,
        //   text: formatText(MSG.createColonyLink),
        //   type: FourOFourMessageLinkType.Internal,
        // },
      ]}
      primaryLinkButton={{
        text: formatText(MSG.goHomeBtn),
        location: LANDING_PAGE_ROUTE,
      }}
    />
  </MainLayout>
);

FourOFour.displayName = displayName;

export default FourOFour;
