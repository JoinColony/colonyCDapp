import { useColonyContext } from '~context/ColonyContext.tsx';
import { notNull } from '~utils/arrays/index.ts';
import {
  SearchSelectOption,
  SearchSelectOptionProps,
} from '~v5/shared/SearchSelect/types.ts';

const sortByDomainId = (
  { nativeId: firstDomainId },
  { nativeId: secondDomainId },
) => firstDomainId - secondDomainId;

const useTeamsOptions = (
  filterOptionsFn?: (option: SearchSelectOption) => boolean,
): SearchSelectOptionProps['options'] => {
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
