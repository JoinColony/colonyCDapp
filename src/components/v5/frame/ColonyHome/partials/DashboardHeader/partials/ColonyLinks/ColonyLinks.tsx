import { CopySimple, ShareNetwork } from '@phosphor-icons/react';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { APP_URL } from '~constants/index.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import ExternalLink from '~shared/Extensions/ExternalLink/index.ts';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { formatText } from '~utils/intl.ts';
import DropdownMenu from '~v5/common/DropdownMenu/index.ts';
import { COLONY_LINK_CONFIG } from '~v5/shared/SocialLinks/colonyLinks.ts';

import { sortExternalLinks } from './helpers.ts';
import { useHeaderLinks } from './useHeaderLinks.ts';

const displayName = 'v5.common.ColonyDashboardHeader.partials.ColonyLinks';

const ColonyLinks = () => {
  const { colony } = useColonyContext();
  const { colonyAddress, metadata } = colony || {};
  const { dropdownMenuProps } = useHeaderLinks();
  const { pathname } = useLocation();
  const {
    handleClipboardCopy: handleShareUrlCopy,
    isCopied: isShareUrlCopied,
  } = useCopyToClipboard(5000);
  const {
    handleClipboardCopy: handleColonyAddressCopy,
    isCopied: isColonyAddressCopied,
  } = useCopyToClipboard(5000);

  const colonyUrl = `${APP_URL.host}${pathname}`;
  const topLinks = metadata?.externalLinks
    ? sortExternalLinks(metadata.externalLinks).slice(0, 3)
    : [];

  return (
    <ul className="flex items-center gap-4">
      {topLinks.map(({ link, name }) => {
        const { label, LinkIcon } = COLONY_LINK_CONFIG[name];

        if (!label || !LinkIcon) {
          return null;
        }

        return (
          <li key={name}>
            <ExternalLink
              href={link}
              className="text-gray-900 md:hover:text-blue-400"
            >
              <LinkIcon size={16} />
            </ExternalLink>
          </li>
        );
      })}
      <li>
        <Tooltip
          isOpen={isColonyAddressCopied}
          isSuccess
          placement="right"
          tooltipContent={formatText({
            id: 'colony.tooltip.url.copied',
          })}
        >
          <button
            type="button"
            className="md:hover:text-blue-400"
            onClick={() => handleColonyAddressCopy(colonyAddress ?? '')}
          >
            <CopySimple size={16} />
          </button>
        </Tooltip>
      </li>
      <li>
        <Tooltip
          isOpen={isShareUrlCopied}
          isSuccess
          placement="right"
          tooltipContent={formatText({
            id: 'colony.tooltip.url.copied',
          })}
        >
          <button
            type="button"
            className="md:hover:text-blue-400"
            onClick={() => handleShareUrlCopy(colonyUrl)}
          >
            <ShareNetwork size={16} />
          </button>
        </Tooltip>
      </li>
      <li>
        <DropdownMenu {...dropdownMenuProps} />
      </li>
    </ul>
  );
};

ColonyLinks.displayName = displayName;

export default ColonyLinks;
