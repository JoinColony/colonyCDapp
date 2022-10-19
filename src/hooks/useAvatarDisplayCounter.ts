// import { useMemo } from 'react';
// import Maybe from 'graphql/tsutils/Maybe';

// import { ColonyContributor, ColonyWatcher } from '~data/index';

/*
 * @TODO This needs to be addressed and either refactored or removed
 */

// const useAvatarDisplayCounter = () =>
// maxAvatars: number,
// members: ColonyContributor[] | ColonyWatcher[] | Maybe<string[]>,
// isLastAvatarIncluded = true,
// {
// const avatarsDisplaySplitRules = useMemo(() => {
//   if (!members?.length) {
//     return 0;
//   }
//   if (members.length <= maxAvatars) {
//     return members.length;
//   }
//   return isLastAvatarIncluded ? maxAvatars : maxAvatars - 1;
// }, [members, maxAvatars, isLastAvatarIncluded]);
// const remainingAvatarsCount = useMemo(() => {
//   if (!members?.length) {
//     return 0;
//   }
//   if (members.length <= maxAvatars) {
//     return 0;
//   }
//   return (
//     members.length - (isLastAvatarIncluded ? maxAvatars : maxAvatars - 1)
//   );
// }, [members, maxAvatars, isLastAvatarIncluded]);
// return {
//   avatarsDisplaySplitRules,
//   remainingAvatarsCount,
// };
// };

const useAvatarDisplayCounter = (...args) => args;

export default useAvatarDisplayCounter;
