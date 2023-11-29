import { useColonyContext } from '~hooks';
import { setTeamColor } from '~v5/common/TeamReputationSummary/utils';
import { SearchSelectOptionProps } from '~v5/shared/SearchSelect/types';

const useTeams = (): SearchSelectOptionProps => {
  const { colony } = useColonyContext();
  const { domains } = colony || {};

  const teams = domains?.items.map((team) => {
    const { metadata, nativeId } = team || {};
    const { color, name: teamName } = metadata || {};

    const teamColor = setTeamColor(color);

    return {
      label: teamName || '',
      value: (nativeId || '').toString(),
      isDisabled: false,
      color: teamColor,
    };
  });

  return {
    options: teams || [],
    key: 'teams',
    title: { id: 'actions.teams' },
    isAccordion: false,
  };
};

export default useTeams;
