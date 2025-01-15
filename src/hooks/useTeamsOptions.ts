import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { notNull } from '~utils/arrays/index.ts';
import {
  type TeamOption,
  type SearchSelectOption,
  type SearchSelectOptionProps,
} from '~v5/shared/SearchSelect/types.ts';

const sortByDomainId = (
  { nativeId: firstDomainId },
  { nativeId: secondDomainId },
) => firstDomainId - secondDomainId;

const useTeamsOptions = (
  filterOptionsFn?: (option: SearchSelectOption<TeamOption>) => boolean,
): SearchSelectOptionProps<TeamOption>['options'] => {
  const {
    colony: { domains },
  } = useColonyContext();

  const teams =
    domains?.items
      .filter(notNull)
      .sort(sortByDomainId)
      .map(({ metadata, nativeId, isRoot }) => {
        const { color, name: teamName } = metadata || {};

        return {
          label: teamName || '',
          value: nativeId,
          isDisabled: false,
          isRoot,
          color,
        };
      }) || [];

  if (filterOptionsFn) {
    return teams?.filter(filterOptionsFn);
  }

  return teams;
};

export default useTeamsOptions;
