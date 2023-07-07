import { usePopperTooltip } from 'react-popper-tooltip';
import { useGetMembersForColonyQuery } from '~gql';
import { useColonyContext } from '~hooks';

export const useMembersPage = () => {
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

  const followers = data?.getMembersForColony?.watchers ?? [];
  const contributors = data?.getMembersForColony?.contributors ?? [];

  return {
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
    followers,
    contributors,
    loading,
    followersURL,
    contributorsURL,
  };
};
