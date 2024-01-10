import { DomainColor } from '~gql';
import { getTeamColor } from '~utils/teams';

const useColors = () => {
  const colors = Object.values(DomainColor).map((color) => {
    return {
      label: color,
      value: color,
      color: getTeamColor(color),
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
