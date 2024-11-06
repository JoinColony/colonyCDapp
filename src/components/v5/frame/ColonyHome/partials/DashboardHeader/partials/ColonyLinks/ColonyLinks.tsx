import { CopySimple, ShareNetwork } from '@phosphor-icons/react';
import React, {
  useCallback,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';
import { useLocation } from 'react-router-dom';

import { APP_URL } from '~constants/index.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import { useOnElementScroll } from '~hooks/useOnElementScroll.tsx';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { type TooltipProps } from '~shared/Extensions/Tooltip/types.ts';
import ExternalLink from '~shared/ExternalLink/index.ts';
import { formatText } from '~utils/intl.ts';
import DropdownMenu from '~v5/common/DropdownMenu/index.ts';
import { COLONY_LINK_CONFIG } from '~v5/shared/SocialLinks/colonyLinks.ts';

import { getCopyVariant, sortExternalLinks } from './helpers.ts';
import { useHeaderLinks } from './useHeaderLinks.ts';

const displayName = 'v5.common.ColonyDashboardHeader.partials.ColonyLinks';

interface ColonyLinkWrapperProps
  extends Pick<TooltipProps, 'tooltipContent' | 'isOpen' | 'isSuccess'> {
  isCopy?: boolean;
}

const ColonyLinkWrapper: FC<PropsWithChildren<ColonyLinkWrapperProps>> = ({
  children,
  tooltipContent,
  isOpen,
  isSuccess,
  isCopy,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useMobile();

  if (isMobile && !isCopy) {
    return <>{children}</>;
  }

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleTouchStart = () => setIsHovered(true);
  const handleTouchEnd = () => setIsHovered(false);

  return (
    <Tooltip
      isOpen={isOpen || isHovered}
      isSuccess={isMobile ? true : isSuccess}
      placement="top"
      tooltipContent={tooltipContent}
      trigger={null}
    >
      <div
        className="flex"
        {...(isMobile
          ? {
              onTouchStart: handleTouchStart,
              onTouchEnd: handleTouchEnd,
            }
          : {
              onMouseEnter: handleMouseEnter,
              onMouseLeave: handleMouseLeave,
            })}
      >
        {children}
      </div>
    </Tooltip>
  );
};

const ColonyLinks = () => {
  const { colony } = useColonyContext();
  const { colonyAddress, metadata } = colony || {};
  const { dropdownMenuProps } = useHeaderLinks();
  const { pathname } = useLocation();
  const isMobile = useMobile();
  const {
    handleClipboardCopy: handleShareUrlCopy,
    isCopied: isShareUrlCopied,
    resetCopiedState: resetShareUrlCopiedState,
  } = useCopyToClipboard(5000);
  const {
    handleClipboardCopy: handleColonyAddressCopy,
    isCopied: isColonyAddressCopied,
    resetCopiedState: resetColonyAddressCopiedState,
  } = useCopyToClipboard(5000);

  const colonyUrl = `${APP_URL.host}${pathname}`;
  const topLinks = metadata?.externalLinks
    ? sortExternalLinks(metadata.externalLinks).slice(0, 3)
    : [];

  const resetCopiedStates = useCallback(() => {
    resetShareUrlCopiedState();
    resetColonyAddressCopiedState();
  }, [resetColonyAddressCopiedState, resetShareUrlCopiedState]);

  useOnElementScroll({
    scrollableElementId: 'main-content-container',
    callback: resetCopiedStates,
  });

  return (
    <ul className="flex items-center gap-2.5">
      {topLinks.map(({ link, name }) => {
        const { label, LinkIcon } = COLONY_LINK_CONFIG[name];

        if (!label || !LinkIcon) {
          return null;
        }

        return (
          <li key={name}>
            <ColonyLinkWrapper
              tooltipContent={formatText({
                id: 'colony.tooltip.goToExternalLink',
              })}
            >
              <ExternalLink href={link}>
                <LinkIcon size={isMobile ? 14 : 16} />
              </ExternalLink>
            </ColonyLinkWrapper>
          </li>
        );
      })}
      <li>
        <ColonyLinkWrapper
          isOpen={isColonyAddressCopied || undefined}
          isSuccess={isColonyAddressCopied}
          tooltipContent={getCopyVariant({
            uncopied: 'colony.tooltip.contractAddress.copy',
            copied: 'colony.tooltip.colonyAddress.copied',
            isCopied: isColonyAddressCopied,
            isMobile,
          })}
          isCopy
        >
          <button
            type="button"
            className="md:hover:text-blue-400"
            onClick={() => handleColonyAddressCopy(colonyAddress ?? '')}
          >
            <CopySimple size={16} />
          </button>
        </ColonyLinkWrapper>
      </li>
      <li>
        <ColonyLinkWrapper
          isOpen={isShareUrlCopied || undefined}
          isSuccess={isShareUrlCopied}
          tooltipContent={getCopyVariant({
            uncopied: 'colony.tooltip.colonyAddress.copy',
            copied: 'colony.tooltip.url.copied',
            isCopied: isColonyAddressCopied,
            isMobile,
          })}
          isCopy
        >
          <button
            type="button"
            className="md:hover:text-blue-400"
            onClick={() => handleShareUrlCopy(colonyUrl)}
          >
            <ShareNetwork size={16} />
          </button>
        </ColonyLinkWrapper>
      </li>
      <li>
        <DropdownMenu {...dropdownMenuProps} />
      </li>
    </ul>
  );
};

ColonyLinks.displayName = displayName;

export default ColonyLinks;
