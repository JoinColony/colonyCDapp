import { type ExternalLink } from '~gql';
import { COLONY_LINK_CONFIG } from '~v5/shared/SocialLinks/colonyLinks.ts';

export const sortExternalLinks = (
  externalLinks: ExternalLink[],
): ExternalLink[] => {
  const linksPriority = Object.keys(COLONY_LINK_CONFIG);

  return [...externalLinks].sort(
    (link1, link2) =>
      linksPriority.indexOf(link1.name) - linksPriority.indexOf(link2.name),
  );
};
