import { useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';
import { setTeamColor } from '~utils/teams';
import {
  SearchSelectOption,
  SearchSelectOptionProps,
} from '~v5/shared/SearchSelect/types';

const sortByDomainId = (
  { nativeId: firstDomainId },
  { nativeId: secondDomainId },
) => firstDomainId - secondDomainId;

const useTeamsOptions = (
  filterOptionsFn?: (option: SearchSelectOption) => boolean,
): SearchSelectOptionProps['options'] => {
  const { colony } = useColonyContext();
  const { domains } = colony || {};

  const teams =
    domains?.items
      .filter(notNull)
      .sort(sortByDomainId)
      .map(({ metadata, nativeId, isRoot }) => {
        const { color, name: teamName } = metadata || {};
        const teamColor = setTeamColor(color);

        return {
          label: teamName || '',
          value: (nativeId || '').toString(),
          isDisabled: false,
          color: teamColor,
          isRoot,
        };
      }) || [];

  if (filterOptionsFn) {
    return teams?.filter(filterOptionsFn);
  }

  return teams;
};

export default useTeamsOptions;
