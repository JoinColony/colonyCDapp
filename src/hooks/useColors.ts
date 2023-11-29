import { DomainColor } from '~gql';
import { setTeamColor } from '~v5/common/TeamReputationSummary/utils';

const useColors = () => {
  const colors = Object.values(DomainColor).map((color) => {
    return {
      label: color,
      value: color,
      color: setTeamColor(color),
      isDisabled: false,
    };
  });

  return {
    options: colors || [],
    key: 'colors',
    title: { id: 'actions.colors' },
    isAccordion: false,
  };
};

export default useColors;
