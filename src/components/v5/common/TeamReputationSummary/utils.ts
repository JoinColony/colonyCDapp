import { DomainColor } from '~gql';

export const setTeamColor = (color?: DomainColor) => {
  switch (color) {
    case DomainColor.Purple:
      return 'bg-teams-purple-400';
    case DomainColor.LightPink:
      return 'bg-teams-pink-400';
    case DomainColor.Yellow:
      return 'bg-teams-yellow-500';
    case DomainColor.Blue:
      return 'bg-indigo-400';
    case DomainColor.Green:
      return 'bg-teams-green-500';
    case DomainColor.Aqua:
      return 'bg-teams-teal-500';
    case DomainColor.Black:
      return 'bg-teams-grey-500';
    case DomainColor.BlueGrey:
      return 'bg-teams-grey-100';
    case DomainColor.EmeraldGreen:
      return 'bg-teams-green-400';
    case DomainColor.Gold:
      return 'bg-teams-yellow-100';
    case DomainColor.Magenta:
      return 'bg-teams-pink-600';
    case DomainColor.Orange:
      return 'bg-teams-red-400';
    case DomainColor.Pink:
      return 'bg-teams-pink-500';
    case DomainColor.Periwinkle:
      return 'bg-teams-indigo-500';
    case DomainColor.PurpleGrey:
      return 'bg-teams-purple-400';
    case DomainColor.Red:
      return 'bg-teams-red-600';
    default:
      return 'bg-teams-purple-400';
  }
};

export const setHexTeamColor = (color?: DomainColor) => {
  switch (color) {
    case DomainColor.Purple:
      return '#7A5AF8';
    case DomainColor.LightPink:
      return '#EE46BC';
    case DomainColor.Yellow:
      return '#FD853A';
    case DomainColor.Blue:
      return '#444CE7';
    case DomainColor.Green:
      return '#039855';
    case DomainColor.Aqua:
      return '#0694A2';
    case DomainColor.Black:
      return '#415A77';
    case DomainColor.BlueGrey:
      return '#ECEFF1';
    case DomainColor.EmeraldGreen:
      return '#0FA98A';
    case DomainColor.Gold:
      return '#FFF6ED';
    case DomainColor.Magenta:
      return '#A11043';
    case DomainColor.Orange:
      return '#C4320A';
    case DomainColor.Pink:
      return '#C11574';
    case DomainColor.Periwinkle:
      return '#4E5BA6';
    case DomainColor.PurpleGrey:
      return '#7A5AF8';
    case DomainColor.Red:
      return '#E31B54';
    default:
      return '#7A5AF8';
  }
};

export const setTeamBadge = (color?: DomainColor) => {
  switch (color) {
    case DomainColor.Purple:
      return 'text-teams-purple-400 border-teams-purple-100';
    case DomainColor.LightPink:
      return 'text-teams-pink-400 border-teams-pink-100';
    case DomainColor.Yellow:
      return 'text-teams-yellow-500 border-teams-yellow-100';
    case DomainColor.Blue:
      return 'text-indigo-400 border-indigo-100';
    case DomainColor.Green:
      return 'text-teams-green-500 border-teams-green-100';
    case DomainColor.Aqua:
      return 'text-teams-teal-500 border-teams-teal-100';
    case DomainColor.Black:
      return 'text-gray-900 border-teams-grey-100';
    case DomainColor.BlueGrey:
      return 'text-teams-grey-500 border-teams-grey-100';
    case DomainColor.EmeraldGreen:
      return 'text-teams-green-400 border-teams-green-50';
    case DomainColor.Gold:
      return 'text-teams-red-400 border-teams-red-100';
    case DomainColor.Magenta:
      return 'text-teams-pink-600 border-teams-pink-150';
    case DomainColor.Orange:
      return 'text-teams-red-400 border-teams-yellow-50';
    case DomainColor.Pink:
      return 'text-teams-pink-500 border-teams-pink-100';
    case DomainColor.Periwinkle:
      return 'text-teams-indigo-500 border-teams-indigo-50';
    case DomainColor.PurpleGrey:
      return 'text-teams-purple-400 border-teams-purple-100';
    case DomainColor.Red:
      return 'text-teams-red-600 border-teams-red-50';
    default:
      return 'text-teams-red-600 border-teams-red-50';
  }
};
