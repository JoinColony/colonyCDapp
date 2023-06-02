import { themeList } from './index';
import { IMappedTheme, ITheme } from './types';

export const mapTheme = (variables: ITheme): IMappedTheme => {
  return {
    '--color-gray-25': variables.gray25 || '',
    '--color-gray-50': variables.gray50 || '',
    '--color-gray-100': variables.gray100 || '',
    '--color-gray-200': variables.gray200 || '',
    '--color-gray-300': variables.gray300 || '',
    '--color-gray-400': variables.gray400 || '',
    '--color-gray-500': variables.gray500 || '',
    '--color-gray-600': variables.gray600 || '',
    '--color-gray-700': variables.gray700 || '',
    '--color-gray-900': variables.gray900 || '',
    '--color-base-white': variables.baseWhite || '',
    '--color-base-black': variables.baseBlack || '',
    '--color-base-bg': variables.baseBg || '',
    '--color-base-sprite': variables.baseSprite || '',
    '--color-blue-100': variables.blue100 || '',
    '--color-blue-200': variables.blue200 || '',
    '--color-blue-300': variables.blue300 || '',
    '--color-blue-400': variables.blue400 || '',
    '--color-blue-light-100': variables.blueLight100 || '',
    '--color-blue-light-200': variables.blueLight200 || '',
    '--color-pink-100': variables.pink100 || '',
    '--color-pink-200': variables.pink200 || '',
    '--color-negative-100': variables.negative100 || '',
    '--color-negative-200': variables.negative200 || '',
    '--color-negative-300': variables.negative300 || '',
    '--color-negative-400': variables.negative400 || '',
    '--color-warning-100': variables.warning100 || '',
    '--color-warning-200': variables.warning200 || '',
    '--color-warning-400': variables.warning400 || '',
    '--color-success-100': variables.success100 || '',
    '--color-success-200': variables.success200 || '',
    '--color-success-400': variables.success400 || '',
    '--color-indigo-100': variables.indigo100 || '',
    '--color-indigo-200': variables.indigo200 || '',
    '--color-indigo-400': variables.indigo400 || '',
    '--color-purple-100': variables.purple100 || '',
    '--color-purple-200': variables.purple200 || '',
    '--color-purple-400': variables.purple400 || '',
    '--color-teams-yellow-50': variables.teamsYellow50 || '',
    '--color-teams-yellow-100': variables.teamsYellow100 || '',
    '--color-teams-yellow-500': variables.teamsYellow500 || '',
    '--color-teams-red-50': variables.teamsRed50 || '',
    '--color-teams-red-100': variables.teamsRed100 || '',
    '--color-teams-red-400': variables.teamsRed400 || '',
    '--color-teams-red-600': variables.teamsRed600 || '',
    '--color-teams-pink-50': variables.teamsPink50 || '',
    '--color-teams-pink-100': variables.teamsPink100 || '',
    '--color-teams-pink-150': variables.teamsPink150 || '',
    '--color-teams-pink-400': variables.teamsPink400 || '',
    '--color-teams-pink-500': variables.teamsPink500 || '',
    '--color-teams-pink-600': variables.teamsPink600 || '',
    '--color-teams-green-50': variables.teamsGreen50 || '',
    '--color-teams-green-100': variables.teamsGreen100 || '',
    '--color-teams-green-400': variables.teamsGreen400 || '',
    '--color-teams-green-500': variables.teamsGreen500 || '',
    '--color-teams-teal-50': variables.teamsTeal50 || '',
    '--color-teams-teal-500': variables.teamsTeal500 || '',
    '--color-teams-blue-50': variables.teamsBlue50 || '',
    '--color-teams-blue-400': variables.teamsBlue400 || '',
    '--color-teams-indigo-50': variables.teamsIndigo50 || '',
    '--color-teams-indigo-500': variables.teamsIndigo500 || '',
    '--color-teams-purple-100': variables.teamsPurple100 || '',
    '--color-teams-purple-400': variables.teamsPurple400 || '',
    '--color-teams-purple-500': variables.teamsPurple500 || '',
    '--color-teams-grey-50': variables.teamsGrey50 || '',
    '--color-teams-grey-100': variables.teamsGrey100 || '',
    '--color-teams-grey-500': variables.teamsGrey500 || '',
  };
};

export const applyTheme = (theme: string): void => {
  const themeObject: IMappedTheme = mapTheme(themeList[theme]);
  if (!themeObject) return;

  const root = document.documentElement;

  Object.keys(themeObject).forEach((property) => {
    if (property === 'name') {
      return;
    }

    root.style.setProperty(property, themeObject[property]);
  });
};
