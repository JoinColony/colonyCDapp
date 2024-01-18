import { CopySimple, ShareNetwork } from 'phosphor-react';
import React from 'react';
import { useLocation } from 'react-router-dom';

import useColonyContext from '~hooks/useColonyContext';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import ExternalLink from '~shared/Extensions/ExternalLink';
import Tooltip from '~shared/Extensions/Tooltip';
import { formatText } from '~utils/intl';
import DropdownMenu from '~v5/common/DropdownMenu';
import { COLONY_LINK_CONFIG } from '~v5/shared/SocialLinks/colonyLinks';

import { sortExternalLinks } from './helpers';
import { useHeaderLinks } from './useHeaderLinks';

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

  const colonyUrl = `${window.location.host}${pathname}`;
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
          <li key={name} className="md:hover:text-blue-400">
            <ExternalLink href={link} className="text-gray-900">
              <LinkIcon size={16} />
            </ExternalLink>
          </li>
        );
      })}
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
      <li>
        <DropdownMenu {...dropdownMenuProps} />
      </li>
    </ul>
  );
};

ColonyLinks.displayName = displayName;

export default ColonyLinks;
