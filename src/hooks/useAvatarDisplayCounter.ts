import { useMemo } from 'react';

// import { ColonyWatcher } from '~types';
// @NOTE this is all fixed in PR #111 - just added here to stop the complaints
type ColonyWatcher = {
  id: string;
};

const useAvatarDisplayCounter = (
  maxAvatars: number,
  members: ColonyWatcher[],
  isLastAvatarIncluded = true,
) => {
  const avatarsDisplaySplitRules = useMemo(() => {
    if (!members?.length) {
      return 0;
    }
    if (members.length <= maxAvatars) {
      return members.length;
    }
    return isLastAvatarIncluded ? maxAvatars : maxAvatars - 1;
  }, [members, maxAvatars, isLastAvatarIncluded]);
  const remainingAvatarsCount = useMemo(() => {
    if (!members?.length) {
      return 0;
    }
    if (members.length <= maxAvatars) {
      return 0;
    }
    return (
      members.length - (isLastAvatarIncluded ? maxAvatars : maxAvatars - 1)
    );
  }, [members, maxAvatars, isLastAvatarIncluded]);
  return {
    avatarsDisplaySplitRules,
    remainingAvatarsCount,
  };
};

export default useAvatarDisplayCounter;
