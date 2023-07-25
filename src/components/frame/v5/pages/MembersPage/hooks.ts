import { usePopperTooltip } from 'react-popper-tooltip';
import { useGetMembersForColonyQuery } from '~gql';

import { useColonyContext } from '~hooks';
import { searchMembers } from '~utils/members';

export const useMembersPage = (searchValue?: string) => {
  const { colony } = useColonyContext();
  const { colonyAddress, name } = colony || {};
  const followersURL = `/colony/${name}/followers`;
  const contributorsURL = `/colony/${name}/contributors`;

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      delayShow: 200,
      delayHide: 200,
      placement: 'bottom-start',
      trigger: ['click', 'hover'],
      interactive: true,
    });

  const { data, loading } = useGetMembersForColonyQuery({
    skip: !colonyAddress,
    variables: {
      input: {
        colonyAddress: colonyAddress ?? '',
      },
    },
  });

  const followers = data?.getMembersForColony?.watchers ?? [];
  const contributors = data?.getMembersForColony?.contributors ?? [];

  const searchedFollowers = searchValue
    ? searchMembers(followers, searchValue)
    : followers;
  const searchedContributors = searchValue
    ? searchMembers(contributors, searchValue)
    : contributors;

  return {
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
    followers: searchedFollowers,
    contributors: searchedContributors,
    loading,
    followersURL,
    contributorsURL,
  };
};
