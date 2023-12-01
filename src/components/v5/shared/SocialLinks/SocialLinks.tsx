import clsx from 'clsx';
import React from 'react';

import { ExternalLink as ExternalLinkFragment } from '~gql';
import ExternalLink from '~shared/Extensions/ExternalLink';

import { COLONY_LINK_CONFIG } from './colonyLinks';

interface SocialLinksProps {
  className?: string;
  externalLinks: ExternalLinkFragment[];
  showLabels?: boolean;
}

const SocialLinks = ({
  className,
  externalLinks,
  showLabels,
}: SocialLinksProps) => {
  return (
    <div
      className={clsx(
        `${className} flex flex-wrap items-start gap-4 sm:flex-row sm:items-center`,
        {
          // If there are labels to show, we want to stack the links vertically (on mobile only)
          'flex-col': showLabels,
        },
      )}
    >
      {externalLinks.map(({ name: linkName, link }) => {
        const { label, LinkIcon } = COLONY_LINK_CONFIG[linkName];

        if (!label || !LinkIcon) {
          return null;
        }

        return (
          <ExternalLink
            href={link}
            key={`${linkName}:${link}`}
            className="flex items-center gap-2 text-gray-900 text-md"
          >
            <LinkIcon size={18} />
            {showLabels ? label : null}
          </ExternalLink>
        );
      })}
    </div>
  );
};

export default SocialLinks;
