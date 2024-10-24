import { type ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';

export const sortAgreementsByDate = (agreements: ActivityFeedColonyAction[]) =>
  agreements.sort((a, b) => {
    const aDate = new Date(a?.decisionData?.createdAt || '');
    const bDate = new Date(b?.decisionData?.createdAt || '');
    return bDate.getTime() - aDate.getTime();
  });
