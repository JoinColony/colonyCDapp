import { usePopperTooltip } from 'react-popper-tooltip';
import { useGetMembersForColonyQuery } from '~gql';

import { useColonyContext } from '~hooks';
import { Member } from '~types';

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
      trigger: 'click',
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

  const searchMembers = (members: Member[]) =>
    members.filter(({ user }) => {
      return (
        user?.name.toLowerCase().startsWith(searchValue?.toLowerCase() ?? '') ||
        user?.walletAddress
          .toLowerCase()
          .startsWith(searchValue?.toLowerCase() ?? '')
      );
    });

  const followers = data?.getMembersForColony?.watchers ?? [];
  const contributors = data?.getMembersForColony?.contributors ?? [];

  const searchedFollowers = searchValue ? searchMembers(followers) : followers;
  const searchedContributors = searchValue
    ? searchMembers(contributors)
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
