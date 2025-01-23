import {
  Bug,
  DiscordLogo,
  Lifebuoy,
  Lightbulb,
  Star,
  XLogo,
} from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import {
  COLONY_DISCORD,
  COLONY_EDUCATION_PORTAL,
  COLONY_X,
} from '~constants/index.ts';
import { useMobile } from '~hooks/index.ts';
import {
  FeaturebaseBoards,
  useOpenChangelogWidget,
  useOpenFeedbackWidget,
} from '~hooks/useFeaturebase.ts';
import ExternalLink from '~shared/ExternalLink/index.ts';
import { formatText } from '~utils/intl.ts';

import { ICON_SIZE, ICON_SIZE_MOBILE } from '../consts.ts';
import MenuList from '../MenuList/index.ts';
import MenuListItem from '../MenuListItem/index.ts';
import { actionItemClass, actionItemLabelClass } from '../submenu.styles.ts';

const displayName =
  'common.Extensions.UserNavigation.partials.UserSubmenu.partials.Contact';

const MSG = defineMessages({
  educationPortal: {
    id: `${displayName}.educationPortal`,
    defaultMessage: 'Education portal',
  },
  whatsNew: {
    id: `${displayName}.whatsNew`,
    defaultMessage: "What's new",
  },
  featureRequest: {
    id: `${displayName}.featureRequest`,
    defaultMessage: 'Request a feature',
  },
  bugReport: {
    id: `${displayName}.bugReport`,
    defaultMessage: 'Report a bug',
  },
  discord: {
    id: `${displayName}.discord`,
    defaultMessage: 'Discord',
  },
  x: {
    id: `${displayName}.X`,
    defaultMessage: 'X',
  },
});

const Contact = () => {
  const isMobile = useMobile();
  const iconSize = isMobile ? ICON_SIZE_MOBILE : ICON_SIZE;

  const openChangelogWidget = useOpenChangelogWidget();
  const openFeatureRequestWidget = useOpenFeedbackWidget(
    FeaturebaseBoards.FeatureRequest,
  );
  const openBugReportWidget = useOpenFeedbackWidget(
    FeaturebaseBoards.BugReport,
  );

  return (
    <MenuList>
      <MenuListItem>
        <ExternalLink
          href={COLONY_EDUCATION_PORTAL}
          className={actionItemClass}
        >
          <Lifebuoy size={iconSize} />
          <p className={actionItemLabelClass}>
            {formatText(MSG.educationPortal)}
          </p>
        </ExternalLink>
      </MenuListItem>
      <MenuListItem>
        <button
          type="button"
          onClick={openChangelogWidget}
          className={actionItemClass}
        >
          <Star size={iconSize} />
          <p className={actionItemLabelClass}>{formatText(MSG.whatsNew)}</p>
        </button>
      </MenuListItem>
      <MenuListItem>
        <button
          type="button"
          onClick={openFeatureRequestWidget}
          className={actionItemClass}
        >
          <Lightbulb size={iconSize} />
          <p className={actionItemLabelClass}>
            {formatText(MSG.featureRequest)}
          </p>
        </button>
      </MenuListItem>
      <MenuListItem>
        <button
          type="button"
          onClick={openBugReportWidget}
          className={actionItemClass}
        >
          <Bug size={iconSize} />
          <p className={actionItemLabelClass}>{formatText(MSG.bugReport)}</p>
        </button>
      </MenuListItem>
      <MenuListItem>
        <ExternalLink href={COLONY_DISCORD} className={actionItemClass}>
          <DiscordLogo size={iconSize} />
          <p className={actionItemLabelClass}>{formatText(MSG.discord)}</p>
        </ExternalLink>
      </MenuListItem>
      <MenuListItem>
        <ExternalLink href={COLONY_X} className={actionItemClass}>
          <XLogo size={iconSize} />
          <p className={actionItemLabelClass}>{formatText(MSG.x)}</p>
        </ExternalLink>
      </MenuListItem>
    </MenuList>
  );
};

Contact.displayName = displayName;
export default Contact;
