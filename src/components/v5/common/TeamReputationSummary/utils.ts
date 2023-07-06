export const setTeamColor = (color: string) => {
  switch (color) {
    case 'purple':
      return 'bg-teams-purple-400';
    case 'pink':
      return 'bg-teams-red-600';
    case 'yellow':
      return 'bg-teams-yellow-500';
    case 'blue':
      return 'bg-teams-blue-400';
    case 'green':
      return 'bg-teams-green-500';
    default:
      return 'bg-teams-purple-400';
  }
};
