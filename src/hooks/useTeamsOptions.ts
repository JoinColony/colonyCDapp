import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type Domain } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';
import {
  type SearchSelectOption,
  type SearchSelectOptionProps,
} from '~v5/shared/SearchSelect/types.ts';

const sortByReputationAndName = (a: Domain, b: Domain) => {
  const reputationA = parseFloat(a.reputationPercentage || '0');
  const reputationB = parseFloat(b.reputationPercentage || '0');

  // Sort by reputation percentage in descending order
  if (reputationA !== reputationB) {
    return reputationB - reputationA;
  }

  // If reputation percentages are equal or missing, sort alphabetically by name
  const nameA = a.metadata?.name || '';
  const nameB = b.metadata?.name || '';
  return nameA.localeCompare(nameB);
};

const useTeamsOptions = (
  filterOptionsFn?: (option: SearchSelectOption) => boolean,
): SearchSelectOptionProps['options'] => {
  const {
    colony: { domains },
  } = useColonyContext();

  const teams =
    domains?.items
      .filter(notNull)
      .sort(sortByReputationAndName)
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
